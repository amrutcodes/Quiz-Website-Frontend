// components/Navbar.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlay, FaHistory } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
export default function Navbar() {
  const [mode, setMode] = useState("quizzes");
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      const response = await fetch(
        "http://localhost:4000/api/user/logout",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.ok) {
        localStorage.clear();
        navigate("/");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="w-full fixed top-0 left-0 right-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-4 px-6 shadow-lg z-50">
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row md:justify-between md:items-center">
        {/* Logo/Project Name */}
        <div className="text-3xl font-bold text-pink-400 mb-4 md:mb-0">
          QuiZpert
        </div>

        {/* Toggle Buttons */}
        <div className="flex gap-4 mb-4 md:mb-0">
  <button
    className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${
      mode === "quizzes" ? "bg-pink-500" : "bg-pink-700"
    } hover:bg-pink-600`}
    onClick={() => navigate("/dashboard")}
  >
    <FaPlay /> Solve Quizzes
  </button>
  <button
    className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${
      mode === "history" ? "bg-pink-500" : "bg-pink-700"
    } hover:bg-pink-600`}
    onClick={() => navigate("/history")}
  >
    <FaHistory /> View History
  </button>
</div>

       <button
  onClick={handleLogout}
  className="flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 rounded-full font-semibold shadow-md"
>
  <FiLogOut /> Logout
</button>
      </div>
    </nav>
  );
}
