"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Box, Button, Card, CardContent, TextField, Typography } from "@mui/material";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const result = await signIn("credentials", {
      password,
      redirect: false,
    });

    setSubmitting(false);
    if (result?.error) {
      setError("Incorrect passcode");
      return;
    }
    router.push(searchParams.get("callbackUrl") ?? "/");
    router.refresh();
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Card sx={{ maxWidth: 360, width: "100%" }}>
        <CardContent component="form" onSubmit={handleSubmit}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            RL Spencer CRM
          </Typography>
          <TextField
            fullWidth
            autoFocus
            type="password"
            label="Passcode"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={Boolean(error)}
            helperText={error}
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained" fullWidth disabled={submitting}>
            {submitting ? "Signing in..." : "Sign in"}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
