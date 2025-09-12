import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AuthForm from "../../components/AuthForm";
import "../../styles/authentication.css";

export default function AuthenticationPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") === "signup" ? "signup" : "login";

  function handleSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.target);
    const identifier = form.get("email");
    const password = form.get("password");

    if (mode === "login") {
      const result = login(identifier, password);
      if (result.success) {
        navigate("/");
      } else {
        alert(result.message);
      }
    } else {
      // For now, fake signup: just alert and redirect
      // Later, we can add logic to insert new user
      alert("Account created successfully! Please login.");
      navigate("/auth?mode=login");
    }
  }

  return (
    // <AuthForm mode={mode} onSubmit={handleSubmit} />
    <div className="auth-container">
      <AuthForm mode={mode} onSubmit={handleSubmit} />
    </div>
  );
}
