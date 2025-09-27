import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "../layouts/Layout";
import Home from "../pages/Home";
import Favorites from "../pages/Favorites";
import About from "../pages/About";
import Random from "../pages/Random";
import Movies from "../pages/Movies/";
import MovieModal from "../components/MovieModal";
import AuthenticationPage from "../pages/Authentication";
import ProfilePage from "../pages/ProfilePage";
import Dashboard from "../pages/Dashboard";
import AdminPage from "../pages/Admin";
import ManageMovies from "../pages/ManageMovies";
import ManageUsers from "../pages/ManageUsers";
import NotFound from "../pages/NotFound";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="about" element={<About />} />
          <Route path="random" element={<Random />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="movie/:slug" element={<MovieModal />} />
          <Route path="profile" element={<ProfilePage></ProfilePage>}></Route>
          <Route path="dashboard" element={<Dashboard></Dashboard>}></Route>
          <Route path="admin" element={<AdminPage></AdminPage>}></Route>
          <Route path="manage-movies" element={<ManageMovies></ManageMovies>}></Route>
          <Route path="manage-users" element={<ManageUsers></ManageUsers>}></Route>
        </Route>
        <Route path="auth" element={<AuthenticationPage />}></Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
