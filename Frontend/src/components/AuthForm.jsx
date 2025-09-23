import { Box, Typography, TextField, Button, Link, Paper } from "@mui/material";

export default function AuthForm({ mode, onSubmit }) {
  return (
    <Paper
      elevation={4}
      sx={{
        p: 4,
        maxWidth: 400,
        mx: "auto",
        mt: 8,
        borderRadius: 3,
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        {mode === "signup" ? "Sign Up" : "Sign In"}
      </Typography>

      <Box
        component="form"
        onSubmit={onSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <TextField
          label="Email or Username"
          name="email"
          type="text"
          required
          fullWidth
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          required
          fullWidth
        />

        <Button type="submit" variant="contained" fullWidth>
          {mode === "signup" ? "Create Account" : "Login"}
        </Button>

        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          {mode === "login" ? (
            <Link href="/auth?mode=signup" underline="hover">
              Create new account
            </Link>
          ) : (
            <Link href="/auth?mode=login" underline="hover">
              Already have an account? Login
            </Link>
          )}
          <br />
          <Link href="/" underline="hover">
            Use without an account
          </Link>
        </Typography>
      </Box>
    </Paper>
  );
}
