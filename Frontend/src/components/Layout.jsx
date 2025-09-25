// src/components/Layout.jsx
import React from "react";
import Navbar from "./Navbar";
import ApiTestButton from "./ApiTestButton";
import CacheDebugPanel from "./CacheDebugPanel";
import "../styles/index.css";

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <ApiTestButton />
      <CacheDebugPanel />
      <main className="main-content">
        <div className="container">{children}</div>
      </main>
    </>
  );
}

export default Layout;
