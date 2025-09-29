// src/router/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

/**
 * Props:
 *  - children: React node
 *  - requireRole: optional string or array of strings (e.g. "superadmin" or ["admin","superadmin"])
 */
export default function ProtectedRoute({ children, requireRole = null }) {
  const { isAuthenticated, loading, currentUser } = useAuth();

  // While auth is being restored, don't redirect — show nothing or a spinner
  if (loading) {
    return null; // or a spinner component
  }

  // Not authenticated -> go to auth page
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // If role was requested, check it and redirect to home if unauthorized
  if (requireRole) {
    const role = currentUser?.role;
    const allowed = Array.isArray(requireRole)
      ? requireRole.includes(role)
      : role === requireRole;

    if (!allowed) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}
