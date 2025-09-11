import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";
import "../styles/index.css";

function Layout() {
  return (
    <>
      <Navbar />
      <main className="main-content">
        <div className="container">
          <Outlet />
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Layout;
