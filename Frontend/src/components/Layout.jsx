// src/components/Layout.jsx
import React from "react";
import Navbar from "./Navbar";
import ApiTestButton from "./ApiTestButton";
import "../styles/index.css";

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <ApiTestButton />
      <main className="main-content">
        <div className="container">{children}</div>
      </main>
    </>
  );
}

export default Layout;
