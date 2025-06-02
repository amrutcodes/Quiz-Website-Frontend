
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const colors = [
  "text-yellow-400",
  "text-red-400",
  "text-blue-400",
  "text-green-400",
  "text-orange-400",
  "text-pink-400",
  "text-purple-400",
]; // you can extend this color list

export default function Dashboard() {
  const [quizTopics, setQuizTopics] = useState([]);
  const userName = localStorage.getItem("userName");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch topics from backend
    const fetchTopics = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/quiz/getTopics");
        if (!res.ok) throw new Error("Failed to fetch topics");
        const data = await res.json();
        setQuizTopics(data);
      } catch (error) {
        console.error("Error loading quiz topics:", error);
      }
    };

    fetchTopics();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-pink-700 text-white px-6 pt-24 pb-12 flex flex-col items-center">
      <Navbar />
      <>
        <h2 className="text-5xl font-extrabold mb-4 text-center drop-shadow-lg">
          {userName ? `Hello, ${userName}!` : "Welcome!"}
        </h2>
        <p className="text-center mb-12 max-w-3xl text-lg tracking-wide text-gray-300">
          Select a topic and start your quiz journey!
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-6xl w-full">
          {quizTopics.length === 0 ? (
            <p className="text-center col-span-full text-gray-400">Loading topics...</p>
          ) : (
            quizTopics.map(({ _id, title, description }, index) => {
              const color = colors[index % colors.length];
              return (
                <div
                  key={_id}
                  className="rounded-xl p-8 shadow-2xl bg-gradient-to-br from-gray-900 to-gray-800 hover:scale-105 transition-transform hover:shadow-pink-500/70 border-2 border-transparent hover:border-pink-500"
                >
                  <h3 className={`text-3xl font-bold mb-3 ${color}`}>{title}</h3>
                  <p className="text-gray-400">{description}</p>
                  <button
                    onClick={() => navigate(`/quiz/${_id}`)}
                    className="mt-6 py-2 px-5 rounded-full bg-pink-500 text-white font-semibold hover:bg-pink-600"
                  >
                    Start Quiz →
                  </button>
                </div>
              );
            })
          )}
        </div>
      </>
    </div>
  );
}
