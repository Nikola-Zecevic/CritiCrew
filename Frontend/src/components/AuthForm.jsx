import { Box, Typography, TextField, Button, Link, Paper, Alert, CircularProgress } from "@mui/material";

export default function AuthForm({ mode, onSubmit, loading, error, success }) {
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
        {mode === "signup" && (
          <>
            <TextField
              label="First Name"
              name="name"
              type="text"
              required
              fullWidth
            />
            <TextField
              label="Last Name"
              name="surname"
              type="text"
              required
              fullWidth
            />
            <TextField
              label="Address"
              name="address"
              type="text"
              fullWidth
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              required
              fullWidth
            />
            <TextField
              label="Username"
              name="username"
              type="text"
              required
              fullWidth
            />
          </>
        )}
        
        {mode === "login" && (
          <TextField
            label="Username"
            name="username"
            type="text"
            required
            fullWidth
          />
        )}
        
        <TextField
          label="Password"
          name="password"
          type="password"
          required
          fullWidth
          helperText={mode === "signup" ? "Minimum 8 characters" : ""}
        />

        {error && (
          <Alert severity="error" sx={{ mt: 1 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mt: 1 }}>
            {success}
          </Alert>
        )}

        <Button 
          type="submit" 
          variant="contained" 
          fullWidth 
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            mode === "signup" ? "Create Account" : "Login"
          )}
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
