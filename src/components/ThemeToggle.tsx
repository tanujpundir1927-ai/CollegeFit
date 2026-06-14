"use client";

import React, { useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof document === "undefined") return "dark";
    return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
  });

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("collegefit_theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  return (
    <button
      onClick={toggleTheme}
      style={{
        background: "rgba(255, 255, 255, 0.05)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "0.5rem",
        padding: "0.4rem 0.65rem",
        cursor: "pointer",
        color: "inherit",
        fontSize: "0.85rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.2s ease",
        height: "2rem",
        width: "2.2rem",
      }}
      className="hover:scale-105"
      title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label="Toggle Theme"
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
