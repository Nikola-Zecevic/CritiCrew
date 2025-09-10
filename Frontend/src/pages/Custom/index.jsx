import React from "react";
import styles from "../../styles/Page.module.css";

function Custom() {
  return (
    <div className={styles.page}>
      <h1 className={styles.heroTitle}>Custom Page</h1>
      <p className={styles.heroText}>This is a custom page.</p>
    </div>
  );
}

export default Custom;
