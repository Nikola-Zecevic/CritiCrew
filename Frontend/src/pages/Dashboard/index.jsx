import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import usersFromFile from "../../apis/users.json";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Paper,
  TextField,
  Button,
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
} from "@mui/material";

export default function Dashboard() {
  const { currentUser, isAuthenticated, isAdmin, isSuperadmin, logout } =
    useAuth();
  const navigate = useNavigate();
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

    if (userToDelete.role === "superadmin" && currentUser?.id === id) {
      alert("You cannot delete your own superadmin account.");
      return;
    }

    if (!confirm("Delete this user? This action cannot be undone (demo)."))
      return;

    const next = users.filter((u) => u.id !== id);
    persistUsers(next);

    if (currentUser?.id === id) {
      alert("You deleted your own account in the demo. Logging out.");
      logout();
      navigate("/", { replace: true });
    } else {
      alert("User deleted.");
    }
  }

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
    if (u.role === "superadmin") {
      return (
        <Typography variant="body2" color="text.secondary">
          superadmin
        </Typography>
      );
    }

    if (u.role === "admin") {
      return (
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => {
              if (!confirm("Demote this admin to regular?")) return;
              demoteUser(u.id);
            }}
          >
            Demote
          </Button>
          <Button
            size="small"
            color="error"
            variant="contained"
            onClick={() => deleteUser(u.id)}
          >
            Delete
          </Button>
        </Stack>
      );
    }

    return (
      <Stack direction="row" spacing={1}>
        <Button
          size="small"
          color="warning"
          variant="contained"
          onClick={() => {
            if (!confirm("Promote this user to admin?")) return;
            promoteUser(u.id);
          }}
        >
          Promote
        </Button>
        <Button
          size="small"
          color="error"
          variant="contained"
          onClick={() => deleteUser(u.id)}
        >
          Delete
        </Button>
      </Stack>
    );
  }
  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
          <Typography variant="body2">
            Welcome, {currentUser?.name} ({currentUser?.role})
          </Typography>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Card sx={{ mb: 4 }}>
          <CardHeader title="Add Movie (demo)" />
          <CardContent>
            <Box component="form" onSubmit={handleAddMovie}>
              <Stack spacing={2}>
                <Stack direction="row" spacing={2}>
                  <TextField name="title" label="Title" required fullWidth />
                  <TextField name="year" label="Year" fullWidth />
                </Stack>
                <TextField name="genre" label="Genre" fullWidth />
                <TextField
                  name="description"
                  label="Short description"
                  multiline
                  rows={3}
                  fullWidth
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ alignSelf: "flex-start" }}
                >
                  Add Movie
                </Button>
              </Stack>
            </Box>

            <Typography variant="h6" sx={{ mt: 3 }}>
              Added movies (demo)
            </Typography>
            {movies.length === 0 ? (
              <Typography color="text.secondary">
                No movies added yet.
              </Typography>
            ) : (
              <Stack spacing={2} sx={{ mt: 1 }}>
                {movies.map((m) => (
                  <Paper key={m.id} sx={{ p: 2 }}>
                    <Typography variant="subtitle1">
                      <strong>{m.title}</strong> {m.year ? `(${m.year})` : ""}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Added by {m.addedBy} —{" "}
                      {new Date(m.addedAt).toLocaleString()}
                    </Typography>
                    {m.description && (
                      <Typography variant="body2" color="text.secondary">
                        {m.description}
                      </Typography>
                    )}
                  </Paper>
                ))}
              </Stack>
            )}
          </CardContent>
        </Card>

        {isSuperadmin && (
          <Card>
            <CardHeader title="Users (manage)" />
            <CardContent>
              {users.length === 0 ? (
                <Typography color="text.secondary">No users loaded.</Typography>
              ) : (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Username / Name</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users.map((u) => (
                        <TableRow key={u.id}>
                          <TableCell>{u.id}</TableCell>
                          <TableCell>
                            {u.name || u.username || u.email}
                          </TableCell>
                          <TableCell>{u.role}</TableCell>
                          <TableCell>{renderUserActions(u)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        )}
      </Container>
    </Box>
  );
}
