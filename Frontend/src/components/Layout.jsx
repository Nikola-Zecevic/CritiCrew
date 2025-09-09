// src/components/Layout.jsx
import React from "react";
import Navbar from "./Navbar";
import "../styles/index.css";

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main className="main-content">
        <div className="container">{children}</div>
      </main>
    </>
  );
}

export default Layout;
