import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:4000/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("data", data);

      if (res.ok && data.success) {
        localStorage.setItem("USER", JSON.stringify(data.user));
        setEmail("");
        setPassword("");

        if (data.user.role === "ADMIN") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      } else {
        alert(data.msg || "Login failed");
      }
    } catch (error) {
      alert("Server error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-purple-900 via-indigo-800 to-pink-700">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md p-8 rounded-xl
                   bg-white/5 backdrop-blur-md
                   border border-white/30
                   shadow-lg
                   text-white space-y-6"
      >
        <h2 className="text-3xl font-bold text-center">Login</h2>

        <div>
          <label htmlFor="email" className="block mb-2 font-medium">
            Email
          </label>

          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-white/90">
              <FaRegUser className="w-5 h-5" />
            </div>
            <input
              type="email"
              id="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded bg-white/20 text-white
               placeholder-white/70
               border border-white/30
               focus:outline-none focus:ring-2 focus:ring-indigo-400
               backdrop-blur-sm transition pl-10"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block mb-2 font-medium">
            Password
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none  text-white/80">
              <FaLock className="w-5 h-5" />
            </div>

            <input
              type={showPassword ? "text" : "password"}
              id="password"
              required
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded bg-white/20 text-white
                   placeholder-white/70
                   border border-white/30
                   focus:outline-none focus:ring-2 focus:ring-indigo-400
                   backdrop-blur-sm transition pl-10 pr-10"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white opacity-70 hover:opacity-100 focus:outline-none"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <FaEye className="w-5 h-5" />
              ) : (
                <FaEyeSlash className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded bg-indigo-600 font-semibold transition-colors ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-500"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center mt-4 text-sm text-white/70">
          Don't have an account?{" "}
          <a href="/signup" className="text-indigo-400 hover:underline">
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
}
