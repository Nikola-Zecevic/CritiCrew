import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "../layouts/Layout";
import Home from "../pages/Home";
import About from "../pages/About";
import Custom from "../pages/Custom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="custom" element={<Custom />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
