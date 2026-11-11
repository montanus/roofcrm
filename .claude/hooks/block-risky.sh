#!/usr/bin/env bash
# PreToolUse hook. Reads the tool call as JSON on stdin and exits 2 to block it.
# Belt-and-braces behind the permission deny list in settings.json: the deny
# list is pattern-matched on the command prefix, this catches the same things
# anywhere in the command (pipes, &&, subshells, env-var tricks).
#
# Blocks:
#   - any read/edit/write of .env, .env.*, .env.deploy.yaml (secrets)
#   - any shell command that mentions those files
#   - production deploys: ./deploy.sh, gcloud run deploy, gcloud builds submit
#   - schema pushes to the live DB: drizzle-kit push / npm run db:push
#   - force pushes against a remote
#   - direct mysql client use (customer PII)
#   - recursive deletes outside node_modules/.next/coverage/dist

set -euo pipefail

input="$(cat)"
tool="$(printf '%s' "$input" | jq -r '.tool_name // empty')"

block() {
  echo "blocked by .claude/hooks/block-risky.sh: $1" >&2
  exit 2
}

secret_file_re='(^|[^A-Za-z0-9_.-])\.env(\.[A-Za-z0-9_.-]+)?($|[^A-Za-z0-9_-])'

case "$tool" in
  Read|Edit|Write|MultiEdit)
    path="$(printf '%s' "$input" | jq -r '.tool_input.file_path // .tool_input.path // empty')"
    base="$(basename -- "$path")"
    case "$base" in
      .env|.env.*)
        case "$base" in
          .env.local.example|.env.deploy.yaml.example) ;;  # examples are fine
          *) block "secrets file $path (use the .example files instead)";;
        esac;;
    esac
    ;;
  Bash)
    cmd="$(printf '%s' "$input" | jq -r '.tool_input.command // empty')"

    if printf '%s' "$cmd" | grep -Eq "$secret_file_re" \
       && ! printf '%s' "$cmd" | grep -Eq '\.env\.(local|deploy\.yaml)\.example'; then
      block "command references a secrets file"
    fi

    if printf '%s' "$cmd" | grep -Eq '(^|[;&| ])(\./)?deploy\.sh|gcloud +run +deploy|gcloud +builds +submit|gcloud +run +services +update'; then
      block "production deploy"
    fi

    if printf '%s' "$cmd" | grep -Eq 'drizzle-kit +push|db:push'; then
      block "schema push to live database (generate a migration instead)"
    fi

    if printf '%s' "$cmd" | grep -Eq 'git +push[^|;&]*(--force|-f( |$)|\+[A-Za-z])'; then
      block "force push"
    fi

    if printf '%s' "$cmd" | grep -Eq '(^|[;&| ])mysql(dump)? '; then
      block "direct database client (customer PII)"
    fi

    if printf '%s' "$cmd" | grep -Eq 'rm +(-[a-zA-Z]*r[a-zA-Z]*f|-[a-zA-Z]*f[a-zA-Z]*r)' \
       && ! printf '%s' "$cmd" | grep -Eq 'rm +-[a-zA-Z]+ +(\./)?(node_modules|\.next|coverage|dist)(/|$| )'; then
      block "recursive delete outside build artifacts"
    fi
    ;;
esac

exit 0
