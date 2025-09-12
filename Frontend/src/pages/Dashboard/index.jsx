import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import usersFromFile from "../../apis/users.json";
import "../../styles/Dashboard.css";

export default function Dashboard() {
  const { currentUser, isAuthenticated, isAdmin, isSuperadmin, logout } =
    useAuth();
  const navigate = useNavigate();

  // --- Users state (for superadmin table) ---
  const [users, setUsers] = useState(() => {
    const stored = localStorage.getItem("usersData");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {}
    }
    return usersFromFile.map((u) => ({ ...u }));
  });

  function persistUsers(next) {
    setUsers(next);
    try {
      localStorage.setItem("usersData", JSON.stringify(next));
    } catch {}
  }

  function promoteUser(id) {
    const next = users.map((u) => (u.id === id ? { ...u, role: "admin" } : u));
    persistUsers(next);
    alert("User promoted to admin.");
  }

  function demoteUser(id) {
    const next = users.map((u) =>
      u.id === id ? { ...u, role: "regular" } : u
    );
    persistUsers(next);

    if (currentUser?.id === id) {
      alert("You have been demoted. You will be logged out.");
      logout();
      navigate("/", { replace: true });
    } else {
      alert("User demoted to regular.");
    }
  }

  function deleteUser(id) {
    const userToDelete = users.find((u) => u.id === id);
    if (!userToDelete) return;

    // === IMPORTANT: prevent superadmin from deleting themself ===
    if (userToDelete.role === "superadmin" && currentUser?.id === id) {
      alert("You cannot delete your own superadmin account.");
      return;
    }

    if (!confirm("Delete this user? This action cannot be undone (demo)."))
      return;

    const next = users.filter((u) => u.id !== id);
    persistUsers(next);

    // if we deleted the currently logged in user (non-superadmin case), log them out
    if (currentUser?.id === id) {
      alert("You deleted your own account in the demo. Logging out.");
      logout();
      navigate("/", { replace: true });
    } else {
      alert("User deleted.");
    }
  }

  // --- Movies state (simple simulated add) ---
  const [movies, setMovies] = useState(() => {
    const stored = localStorage.getItem("moviesData");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {}
    }
    return [];
  });

  function persistMovies(next) {
    setMovies(next);
    try {
      localStorage.setItem("moviesData", JSON.stringify(next));
    } catch {}
  }

  function handleAddMovie(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const title = (fd.get("title") || "").toString().trim();
    const year = (fd.get("year") || "").toString().trim();
    const genre = (fd.get("genre") || "").toString().trim();
    const description = (fd.get("description") || "").toString().trim();

    if (!title) {
      alert("Title is required.");
      return;
    }

    const newMovie = {
      id: Date.now(),
      title,
      year,
      genre,
      description,
      addedBy: currentUser?.name || "unknown",
      addedAt: new Date().toISOString(),
    };

    persistMovies([newMovie, ...movies]);
    e.target.reset();
    alert("Movie added (demo).");
  }

  function renderUserActions(u) {
    // keep superadmin rows safe: don't render actions for superadmin accounts
    if (u.role === "superadmin") {
      return <em className="muted">superadmin</em>;
    }

    if (u.role === "admin") {
      return (
        <>
          <button
            className="btn btn-muted"
            onClick={() => {
              if (!confirm("Demote this admin to regular?")) return;
              demoteUser(u.id);
            }}
          >
            Demote
          </button>
          <button className="btn btn-danger" onClick={() => deleteUser(u.id)}>
            Delete
          </button>
        </>
      );
    }

    // regular user
    return (
      <>
        <button
          className="btn btn-yellow"
          onClick={() => {
            if (!confirm("Promote this user to admin?")) return;
            promoteUser(u.id);
          }}
        >
          Promote
        </button>
        <button className="btn btn-danger" onClick={() => deleteUser(u.id)}>
          Delete
        </button>
      </>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <p className="muted">
          Welcome, {currentUser?.name} ({currentUser?.role})
        </p>
      </header>

      <section className="movie-section card">
        <h2>Add Movie (demo)</h2>
        <form className="movie-form" onSubmit={handleAddMovie}>
          <div className="row">
            <input name="title" placeholder="Title" required />
            <input name="year" placeholder="Year" />
          </div>
          <div className="row">
            <input name="genre" placeholder="Genre" />
          </div>
          <div>
            <textarea name="description" placeholder="Short description" />
          </div>
          <div className="row actions">
            <button className="btn btn-yellow" type="submit">
              Add Movie
            </button>
          </div>
        </form>

        <h3>Added movies (demo)</h3>
        {movies.length === 0 ? (
          <p className="muted">No movies added yet.</p>
        ) : (
          <ul className="movie-list">
            {movies.map((m) => (
              <li key={m.id} className="movie-item">
                <strong>{m.title}</strong> {m.year ? `(${m.year})` : ""}
                <div className="muted small">
                  Added by {m.addedBy} — {new Date(m.addedAt).toLocaleString()}
                </div>
                {m.description && <p className="muted">{m.description}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>

      {isSuperadmin && (
        <section className="users-section card">
          <h2>Users (manage)</h2>
          {users.length === 0 ? (
            <p className="muted">No users loaded.</p>
          ) : (
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username / Name</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.name || u.username || u.email}</td>
                    <td>{u.role}</td>
                    <td className="actions-td">{renderUserActions(u)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}
    </div>
  );
}
