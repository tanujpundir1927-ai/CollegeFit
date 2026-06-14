"use client";

import React from "react";

export default function AnimatedBackground() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        overflow: "hidden",
        pointerEvents: "none",
        background: "var(--background)",
        transition: "background 0.5s ease",
      }}
    >
      {/* Orb 1: Indigo */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "10%",
          width: "45vw",
          height: "45vw",
          maxHeight: "550px",
          maxWidth: "550px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)",
          filter: "blur(60px)",
          animation: "float-blob-1 28s infinite alternate ease-in-out",
          willChange: "transform",
        }}
      />
      {/* Orb 2: Purple */}
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          right: "10%",
          width: "50vw",
          height: "50vw",
          maxHeight: "650px",
          maxWidth: "650px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%)",
          filter: "blur(70px)",
          animation: "float-blob-2 32s infinite alternate ease-in-out",
          willChange: "transform",
        }}
      />
      {/* Orb 3: Blue */}
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "40%",
          width: "35vw",
          height: "35vw",
          maxHeight: "450px",
          maxWidth: "450px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
          filter: "blur(50px)",
          animation: "float-blob-3 22s infinite alternate ease-in-out",
          willChange: "transform",
        }}
      />

      <style>{`
        @keyframes float-blob-1 {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(8vw, 6vh) scale(1.15); }
          100% { transform: translate(-4vw, 12vh) scale(0.95); }
        }
        @keyframes float-blob-2 {
          0% { transform: translate(0, 0) scale(1.1); }
          50% { transform: translate(-10vw, -8vh) scale(0.9); }
          100% { transform: translate(5vw, -4vh) scale(1.05); }
        }
        @keyframes float-blob-3 {
          0% { transform: translate(0, 0) scale(0.9); }
          50% { transform: translate(6vw, -10vh) scale(1.1); }
          100% { transform: translate(-6vw, 6vh) scale(0.95); }
        }
      `}</style>
    </div>
  );
}
