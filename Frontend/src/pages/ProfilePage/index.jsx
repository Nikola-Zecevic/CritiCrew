import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import "../../styles/ProfilePage.css";

export default function ProfilePage() {
  const { currentUser, isAuthenticated, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  // Local form state
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);

  // Redirect guests -> login; populate form for logged-in user
  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      navigate("/auth?mode=login", { replace: true });
      return;
    }
    // populate fields when currentUser becomes available
    setUsername(currentUser?.username || currentUser?.name || "");
  }, [isAuthenticated, currentUser, navigate]);

  // If redirecting, render nothing
  if (!isAuthenticated) return null;

  // Safety: ensure currentUser exists
  if (!currentUser) return null;

  async function handleUpdateUsername(e) {
    e.preventDefault();
    const newName = (username || "").trim();
    if (!newName) {
      alert("Username cannot be empty.");
      return;
    }
    setSaving(true);
    try {
      updateUser(currentUser.id, { username: newName });
      alert("Username updated.");
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    const pw = (newPassword || "").trim();
    if (!pw) {
      alert("Password cannot be empty.");
      return;
    }
    setSaving(true);
    try {
      updateUser(currentUser.id, { password: pw });
      setNewPassword("");
      alert("Password changed.");
    } finally {
      setSaving(false);
    }
  }

  function handleLogout() {
    logout();
    navigate("/", { replace: true });
  }

  return (
    <div className="profile-container">
      <h1>Profile</h1>

      <p>
        <strong>Username:</strong> {currentUser.username}
      </p>
      <p>
        <strong>Role:</strong> {currentUser.role}
      </p>

      <form onSubmit={handleUpdateUsername} className="profile-form">
        <label>Change Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={saving}
        />
        <button type="submit" disabled={saving}>
          Update Username
        </button>
      </form>

      <form onSubmit={handleChangePassword} className="profile-form">
        <label>New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          disabled={saving}
        />
        <button type="submit" disabled={saving}>
          Change Password
        </button>
      </form>

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}
