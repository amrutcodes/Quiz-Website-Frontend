import { useState } from "react";
import { FaRegUser, FaEnvelope, FaPhone, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:4000/api/user/createUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setName("");
        setEmail("");
        setPhone("");
        setPassword("");
        navigate("/dashboard");
      } else {
        alert(data.msg || "Signup failed");
      }
    } catch (error) {
      alert("Server error");
    }

    setLoading(false);
  };

  // A softer white color with opacity for icons
  const iconClass = "w-5 h-5 text-white/50";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-purple-900 via-indigo-800 to-pink-700">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-md p-8 rounded-xl
                   bg-white/5 backdrop-blur-md
                   border border-white/30
                   shadow-lg
                   text-white space-y-6"
      >
        <h2 className="text-3xl font-bold text-center">Sign Up</h2>

        <div>
          <label htmlFor="name" className="block mb-2 font-medium">
            Full Name
          </label>
          <div className="relative">
            <div className={`absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none ${iconClass}`}>
              <FaRegUser />
            </div>
            <input
              type="text"
              id="name"
              required
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded bg-white/20 text-white
                placeholder-white/70
                border border-white/30
                focus:outline-none focus:ring-2 focus:ring-indigo-400
                backdrop-blur-sm transition pl-10"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block mb-2 font-medium">
            Email
          </label>
          <div className="relative">
            <div className={`absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none ${iconClass}`}>
              <FaEnvelope />
            </div>
            <input
              type="email"
              id="email"
              required
              placeholder="Your email"
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
          <label htmlFor="phone" className="block mb-2 font-medium">
            Phone Number
          </label>
          <div className="relative">
            <div className={`absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none ${iconClass}`}>
              <FaPhone />
            </div>
            <input
              type="tel"
              id="phone"
              required
              placeholder="Your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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
            <div className={`absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none ${iconClass}`}>
              <FaLock />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              required
              placeholder="Create a password"
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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white focus:outline-none"
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
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        <p className="text-center mt-4 text-sm text-white/70">
          Already have an account?{" "}
          <a href="/login" className="text-indigo-400 hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
