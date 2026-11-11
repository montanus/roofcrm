# Specs

One file per feature area under `specs/`. An agent reads the relevant spec
before implementing and the `reviewer` subagent checks the diff against it.

Format: Purpose, Requirements (numbered, testable), Out of scope, Open
questions. Keep each spec under a page. When code and spec disagree, the PR
that changes the code updates the spec too.
