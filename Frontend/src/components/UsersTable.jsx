// src/components/UsersTable.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Box,
  Typography,
  CircularProgress,
  Stack,
  Tooltip,
  Paper,
} from "@mui/material";
import {
  People as PeopleIcon,
  Delete as DeleteIcon,
  ArrowUpward as PromoteIcon,
  ArrowDownward as DemoteIcon,
  Security as SuperAdminIcon,
  Star as AdminIcon,
  Person as RegularIcon,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import apiService from "../services/apiService";

/*
  UsersTable:
  - Prikazuje korisnike (iz API-ja ili iz localStorage/users.json fallback).
  - Dostupno samo superadminu (proverava currentUser iz useAuth()).
  - Za role: regular -> [Promote, Delete], admin -> [Demote, Delete], superadmin -> nema akcija.
*/

const ROLE_MAP = { 1: "regular", 2: "admin", 3: "superadmin" };

function safeRowId(u, idx) {
  return u?.id ?? u?._id ?? u?.user_id ?? u?.email ?? u?.username ?? idx;
}

function deriveRoleFromUserObject(u) {
  if (!u) return "regular";
  if (u?.role && typeof u.role === "string") {
    const s = u.role.toLowerCase();
    if (s.includes("super")) return "superadmin";
    if (s.includes("admin")) return "admin";
    return "regular";
  }
  const rid = u?.role_id ?? u?.roleId ?? null;
  if (rid != null) return ROLE_MAP[Number(rid)] ?? "regular";
  // if there's a 'type' or 'userType' field, you can extend here
  return "regular";
}

function RoleIcon({ role }) {
  switch (role) {
    case "superadmin":
      return <SuperAdminIcon />;
    case "admin":
      return <AdminIcon />;
    default:
      return <RegularIcon />;
  }
}

export default function UsersTable({ showNotification }) {
  const { currentUser, updateUser, logout } = useAuth() || {};
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // viewerRole - treba da bude 'superadmin' da bi se dashboard video
  const viewerRole = deriveRoleFromUserObject(currentUser);
  const canAct = viewerRole === "superadmin";

  // util: send notification via callback ili fallback na alert
  const notify = (msg, severity = "info") => {
    if (typeof showNotification === "function") showNotification(msg, severity);
    else alert(msg);
  };

  const getId = (u) => u?.id ?? u?._id ?? u?.user_id ?? u?.__rowId ?? null;

  // fetch users: prvo pokušaj API, pa fallback na localStorage / users.json
  async function fetchUsers() {
    setLoading(true);
    setError(null);
    try {
      let list = [];
      let usedApi = false;
      try {
        if (apiService && typeof apiService.getAllUsers === "function") {
          const res = await apiService.getAllUsers();
          // standardne oblike odgovora:
          if (Array.isArray(res)) list = res;
          else if (res?.users && Array.isArray(res.users)) list = res.users;
          else if (res?.data && Array.isArray(res.data)) list = res.data;
          else if (res?.results && Array.isArray(res.results))
            list = res.results;
          else if (res && typeof res === "object") {
            // ako vraća object sa korisnicima u pod-objectima
            const maybe = Object.values(res).filter((v) => Array.isArray(v));
            if (maybe.length > 0) list = maybe[0];
            else {
              // fallback: uzmi sve vrednosti objekta koje su objekti (manje verovatno)
              const possible = Object.values(res).filter(
                (v) => v && typeof v === "object"
              );
              if (possible.length > 0 && Array.isArray(possible[0]))
                list = possible[0];
              else list = [];
            }
          }
          usedApi = true;
        }
      } catch (apiErr) {
        console.warn(
          "API getAllUsers failed, falling back to local data:",
          apiErr
        );
        usedApi = false;
      }

      if (!usedApi) {
        // localStorage fallback
        const stored = localStorage.getItem("usersData");
        if (stored) {
          try {
            list = JSON.parse(stored);
          } catch (e) {
            console.warn("Failed parse stored usersData", e);
            list = [];
          }
        } else {
          // import local json
          try {
            // dynamic import returns a module with .default
            // note: bundlers resolve this at build time
            // eslint-disable-next-line
            const json = await import("../apis/users.json");
            list = json?.default ?? [];
          } catch (impErr) {
            console.warn("No local users.json found", impErr);
            list = [];
          }
        }
      }

      if (!Array.isArray(list)) list = [];

      const normalized = list.map((u, idx) => ({
        __rowId: safeRowId(u, idx),
        __role: deriveRoleFromUserObject(u),
        ...u,
      }));

      setUsers(normalized);
    } catch (err) {
      console.error("fetchUsers error:", err);
      setError(err?.message || "Failed to load users");
      notify("Ne mogu da učitam korisnike.", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Helper: persist to localStorage (store full users array)
  const persistLocal = (arr) => {
    try {
      localStorage.setItem("usersData", JSON.stringify(arr));
    } catch (e) {
      console.warn("Failed to persist users to localStorage", e);
    }
  };

  // ACTIONS: Promote, Demote, Delete
  const handlePromote = async (row) => {
    if (!canAct) return;
    if (!window.confirm("Promovisati ovog korisnika u admin?")) return;
    const id = getId(row);
    try {
      if (apiService && typeof apiService.promoteUser === "function") {
        await apiService.promoteUser(id);
        notify("Korisnik je promovisán u admin.", "success");
        await fetchUsers();
        return;
      }
      throw new Error("API promoteUser nije dostupan");
    } catch (err) {
      console.warn("Promote API failed, doing local update:", err);
      // lokalna promena
      setUsers((prev) => {
        const updated = prev.map((u) => {
          const uid = getId(u);
          if (uid === id) return { ...u, role: "admin", __role: "admin" };
          return u;
        });
        persistLocal(updated);
        return updated;
      });
      // opcionalno: pokušaj obavestiti auth context (ako postoji)
      try {
        if (typeof updateUser === "function") updateUser(id, { role: "admin" });
      } catch (e) {
        console.warn("updateUser (context) failed", e);
      }
      notify("Korisnik promovisán (lokalno).", "success");
    }
  };

  const handleDemote = async (row) => {
    if (!canAct) return;
    if (!window.confirm("Degradirati ovog admina u regular korisnika?")) return;
    const id = getId(row);
    // blokiraj demote superadmina
    if (row.__role === "superadmin") {
      notify("Ne možete degradirati superadmin-a.", "error");
      return;
    }
    try {
      if (apiService && typeof apiService.demoteUser === "function") {
        await apiService.demoteUser(id);
        notify("Korisnik degradiran u regular.", "success");
        // ako je demoting trenutni korisnik, mora logout
        if (currentUser && (currentUser.id === id || currentUser._id === id)) {
          notify("Vi ste degradirani. Bićete odjavljeni.", "warning");
          try {
            logout && logout();
          } catch (e) {
            console.warn(e);
          }
          navigate("/", { replace: true });
          return;
        }
        await fetchUsers();
        return;
      }
      throw new Error("API demoteUser nije dostupan");
    } catch (err) {
      console.warn("Demote API failed, doing local update:", err);
      setUsers((prev) => {
        const updated = prev.map((u) => {
          const uid = getId(u);
          if (uid === id) return { ...u, role: "regular", __role: "regular" };
          return u;
        });
        persistLocal(updated);
        return updated;
      });
      try {
        if (
          typeof updateUser === "function" &&
          currentUser &&
          (currentUser.id === id || currentUser._id === id)
        ) {
          // ako si sebe demotovao, updateuj kontekst i logout
          updateUser(id, { role: "regular" });
          notify("Vi ste degradirani. Bićete odjavljeni.", "warning");
          try {
            logout && logout();
          } catch (e) {
            console.warn(e);
          }
          navigate("/", { replace: true });
          return;
        }
      } catch (e) {
        console.warn("updateUser on demote failed", e);
      }
      notify("Korisnik degradiran (lokalno).", "success");
    }
  };

  const handleDelete = async (row) => {
    if (!canAct) return;
    if (row.__role === "superadmin") {
      notify("Ne možete obrisati superadmin-a.", "error");
      return;
    }
    if (
      !window.confirm(
        "Obrisati ovog korisnika? Ova akcija se ne može poništiti."
      )
    )
      return;
    const id = getId(row);
    try {
      if (apiService && typeof apiService.deleteUser === "function") {
        await apiService.deleteUser(id);
        notify("Korisnik obrisan.", "success");
        // ako obrisan trenutni korisnik -> logout
        if (currentUser && (currentUser.id === id || currentUser._id === id)) {
          notify("Obrisali ste svoj nalog. Bićete odjavljeni.", "warning");
          try {
            logout && logout();
          } catch (e) {
            console.warn(e);
          }
          navigate("/", { replace: true });
          return;
        }
        await fetchUsers();
        return;
      }
      throw new Error("API deleteUser nije dostupan");
    } catch (err) {
      console.warn("Delete API failed, doing local update:", err);
      setUsers((prev) => {
        const updated = prev.filter((u) => getId(u) !== id);
        persistLocal(updated);
        return updated;
      });
      if (currentUser && (currentUser.id === id || currentUser._id === id)) {
        notify(
          "Obrisali ste svoj nalog (lokalno). Bićete odjavljeni.",
          "warning"
        );
        try {
          logout && logout();
        } catch (e) {
          console.warn(e);
        }
        navigate("/", { replace: true });
        return;
      }
      notify("Korisnik obrisan (lokalno).", "success");
    }
  };

  const getRoleColor = (role) => {
    switch ((role || "").toLowerCase()) {
      case "superadmin":
        return "error";
      case "admin":
        return "warning";
      case "regular":
      case "user":
        return "primary";
      default:
        return "default";
    }
  };

  const getRoleLabel = (role) =>
    role ? role.charAt(0).toUpperCase() + role.slice(1) : "Unknown";

  // Ako viewer nije superadmin -> zabrana pristupa (prečica jer dashboard samo za superadmin)
  if (!canAct) {
    return (
      <Card sx={{ mb: 4 }}>
        <CardHeader
          title="Users Management"
          subheader="Dostupno samo superadmin korisniku"
          avatar={<PeopleIcon />}
        />
        <CardContent>
          <Box display="flex" flexDirection="column" alignItems="center" py={4}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Nemate pristup
            </Typography>
            <Typography color="text.secondary" align="center">
              Ovaj deo je dostupan samo superadmin nalogu.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ mb: 4 }}>
      <CardHeader
        title={`Users Management (${users.length})`}
        subheader="Manage user roles and permissions"
        avatar={<PeopleIcon />}
      />
      <CardContent>
        {error ? (
          <Box mb={2}>
            <Typography color="error">{error}</Typography>
          </Box>
        ) : null}

        {users.length === 0 ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            py={4}
            sx={{ backgroundColor: "background.paper", borderRadius: 2 }}
          >
            <PeopleIcon sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No users found
            </Typography>
            <Typography color="text.secondary" align="center">
              Users will appear here when they register
            </Typography>
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Username / Name</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.__rowId} hover>
                    <TableCell>
                      {u.id ?? u._id ?? u.user_id ?? u.__rowId}
                    </TableCell>
                    <TableCell>
                      {u.name || u.username || u.email || "-"}
                    </TableCell>
                    <TableCell>
                      <Tooltip title={u.__role ?? "regular"}>
                        <Chip
                          label={getRoleLabel(u.__role)}
                          color={getRoleColor(u.__role)}
                          size="small"
                          variant="outlined"
                          icon={<RoleIcon role={u.__role} />}
                        />
                      </Tooltip>
                    </TableCell>
                    <TableCell align="right">
                      {/* akcije koje zelis: admin -> Demote + Delete, user -> Promote + Delete */}
                      {u.__role === "superadmin" ? null : (
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="flex-end"
                          flexWrap="wrap"
                        >
                          {u.__role === "regular" ? (
                            <>
                              <Button
                                size="small"
                                color="warning"
                                variant="contained"
                                startIcon={<PromoteIcon />}
                                onClick={() => handlePromote(u)}
                              >
                                Promote
                              </Button>
                              <Button
                                size="small"
                                color="error"
                                variant="contained"
                                startIcon={<DeleteIcon />}
                                onClick={() => handleDelete(u)}
                              >
                                Delete
                              </Button>
                            </>
                          ) : (
                            // admin
                            <>
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<DemoteIcon />}
                                onClick={() => handleDemote(u)}
                              >
                                Demote
                              </Button>
                              <Button
                                size="small"
                                color="error"
                                variant="contained"
                                startIcon={<DeleteIcon />}
                                onClick={() => handleDelete(u)}
                              >
                                Delete
                              </Button>
                            </>
                          )}
                        </Stack>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
}
