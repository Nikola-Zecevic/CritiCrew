export default function AuthForm({ mode, onSubmit }) {
  return (
    <div className="auth-box">
      <h1>{mode === "signup" ? "Sign Up" : "Sign In"}</h1>

      <form onSubmit={onSubmit}>
        <div>
          <label>Email or Username</label>
          <input type="text" name="email" required />
        </div>

        <div>
          <label>Password</label>
          <input type="password" name="password" required />
        </div>

        <button type="submit">
          {mode === "signup" ? "Create Account" : "Login"}
        </button>
        <p>
          {mode === "login" ? (
            <a href="/auth?mode=signup">Create new account</a>
          ) : (
            <a href="/auth?mode=login">Already have an account? Login</a>
          )}
          <br></br>
          <a href="/">Use without an account</a>
        </p>
      </form>
    </div>
  );
}
