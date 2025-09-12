import React, { createContext, useContext, useEffect, useState } from "react";
import usersFile from "../apis/users.json";

const AuthContext = createContext();

const GUEST_USER = { id: null, username: null, role: "guest", name: "Guest" };

/* Helpers to read / write demo users list in localStorage */
function loadUsersData() {
  const raw = localStorage.getItem("usersData");
  if (!raw) return usersFile.map((u) => ({ ...u }));
  try {
    return JSON.parse(raw);
  } catch {
    return usersFile.map((u) => ({ ...u }));
  }
}
function persistUsersData(users) {
  try {
    localStorage.setItem("usersData", JSON.stringify(users));
  } catch {}
}

/* Remove sensitive fields and ensure display name */
function sanitizeUser(u) {
  if (!u) return null;
  const { password, ...rest } = u;
  return { ...rest, name: rest.username || rest.name || rest.email || "User" };
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(GUEST_USER);

  // Load persisted auth user on mount (if any)
  useEffect(() => {
    const raw = localStorage.getItem("authUser");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setCurrentUser(parsed);
        return;
      } catch {
        localStorage.removeItem("authUser");
      }
    }
    setCurrentUser(GUEST_USER);
  }, []);

  /**
   * login(identifier, password)
   * identifier: username or email
   */
  function login(identifier, password) {
    const id = String(identifier || "").toLowerCase();
    const users = loadUsersData();
    const found = users.find(
      (u) =>
        (u.username && u.username.toLowerCase() === id) ||
        (u.email && u.email.toLowerCase() === id)
    );

    if (!found) {
      return { success: false, message: "User not found" };
    }
    if (found.password !== password) {
      return { success: false, message: "Invalid credentials" };
    }

    const safe = sanitizeUser(found);
    setCurrentUser(safe);
    try {
      localStorage.setItem("authUser", JSON.stringify(safe));
    } catch {}
    return { success: true, user: safe };
  }

  function logout() {
    setCurrentUser(GUEST_USER);
    try {
      localStorage.removeItem("authUser");
    } catch {}
  }

  /**
   * updateUser(id, updates)
   * updates: partial user object (e.g. { password: 'new', username: 'newname' })
   * Persists to localStorage usersData and if the current user is updated,
   * updates currentUser + authUser storage so UI stays in sync.
   */
  function updateUser(id, updates = {}) {
    const users = loadUsersData();
    const next = users.map((u) => (u.id === id ? { ...u, ...updates } : u));
    persistUsersData(next);

    // If we updated the currently logged in user, update currentUser & authUser storage
    if (currentUser && currentUser.id === id) {
      const updatedFull = next.find((u) => u.id === id);
      const safe = sanitizeUser(updatedFull);
      if (safe) {
        setCurrentUser(safe);
        try {
          localStorage.setItem("authUser", JSON.stringify(safe));
        } catch {}
      } else {
        // fallback logout if something odd happened
        logout();
      }
    }

    return next.find((u) => u.id === id) || null;
  }

  const isAuthenticated = !!(
    currentUser &&
    currentUser.role &&
    currentUser.role !== "guest"
  );
  const isAdmin =
    isAuthenticated &&
    (currentUser.role === "admin" || currentUser.role === "superadmin");
  const isSuperadmin = isAuthenticated && currentUser.role === "superadmin";

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        logout,
        updateUser,
        isAuthenticated,
        isAdmin,
        isSuperadmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
