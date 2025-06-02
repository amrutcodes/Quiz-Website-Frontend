import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Button = ({ children, className = "", ...props }) => (
  <button
    className={`px-6 py-3 rounded-full font-semibold shadow-md transition-all ${className}`}
    {...props}
  >
    {children}
  </button>
);


export default function LandingPage() {
  const navigate = useNavigate(); // Initialize navigate here

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-pink-700 text-white px-6 py-12 scroll-smooth relative overflow-hidden">
      {/* Left-side Abstract Shapes */}
      <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-tl from-transparent via-indigo-700 to-transparent opacity-50 z-0">
        <svg
          className="absolute top-1/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2"
          width="250"
          height="250"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="50" cy="50" r="40" stroke="white" strokeWidth="4" fill="none" />
          <circle cx="50" cy="50" r="30" stroke="white" strokeWidth="2" fill="none" />
          <circle cx="50" cy="50" r="20" stroke="white" strokeWidth="1" fill="none" />
        </svg>
      </div>

      {/* Right-side Abstract Shapes */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-tr from-transparent via-pink-700 to-transparent opacity-50 z-0">
        <svg
          className="absolute top-1/4 right-1/4 transform translate-x-1/2 -translate-y-1/2"
          width="300"
          height="300"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon points="50,15 90,85 10,85" stroke="white" strokeWidth="2" fill="none" />
        </svg>
      </div>

      {/* Header */}
      <header className="mb-20 z-10 relative">
        <h1 className="text-3xl font-bold tracking-tight">QuiZpert</h1>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col items-center text-center z-10 relative">
        <motion.h2
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-extrabold mb-6"
        >
          Test Your Knowledge
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg md:text-xl mb-8 max-w-2xl"
        >
          Dive into fun and challenging quizzes on Web Development, Python, Java, and more. Track your scores and level up!
        </motion.p>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            className="text-lg bg-pink-600 hover:bg-pink-500 text-white"
            onClick={() => navigate("/login")} // Navigate to the form page
          >
            <Sparkles className="inline mr-2" />
            Start Learning
          </Button>
        </motion.div>
      </main>
    </div>
  );
}
