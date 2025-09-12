import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "../layouts/Layout";
import Home from "../pages/Home";
import About from "../pages/About";
import Random from "../pages/Random";
import Filter from "../pages/Filter/";
import MovieModal from "../components/MovieModal";
import AuthenticationPage from "../pages/Authentication";
import ProfilePage from "../pages/ProfilePage";
import Dashboard from "../pages/Dashboard";
import NotFound from "../pages/NotFound";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="random" element={<Random />} />
          <Route path="/filter" element={<Filter />} />
          <Route path="movie/:slug" element={<MovieModal />} />
          <Route path="profile" element={<ProfilePage></ProfilePage>}></Route>
          <Route path="dashboard" element={<Dashboard></Dashboard>}></Route>
        </Route>
        <Route path="auth" element={<AuthenticationPage />}></Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
