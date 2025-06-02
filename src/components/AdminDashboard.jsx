import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUserHistory, setSelectedUserHistory] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState(null);
  const navigate = useNavigate();

  const fetchQuizzes = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/quiz/getAll");
      setQuizzes(res.data);
    } catch {
      alert("Failed to fetch quizzes");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/user/findAll");
      setUsers(res.data.data);
    } catch {
      alert("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchQuizzes();
    fetchUsers();
  }, []);

  const handleDeleteQuiz = async (id) => {
    if (!window.confirm("Delete this quiz?")) return;
    try {
      await axios.delete(`http://localhost:4000/api/quiz/delete/${id}`);
      alert("Quiz deleted");
      fetchQuizzes();
    } catch {
      alert("Failed to delete quiz");
    }
  };

  // Fetch history for a given user email and open modal
  const viewUserHistory = async (email) => {
    setLoadingHistory(true);
    setHistoryError(null);
    try {
      const res = await axios.get(`http://localhost:4000/api/history/get?userEmail=${email}`);
      if (res.data.success) {
        setSelectedUserHistory({ email, data: res.data.data });
      } else {
        setHistoryError("No history found for this user.");
      }
    } catch {
      setHistoryError("Failed to load user history.");
    }
    setLoadingHistory(false);
  };

  const closeHistoryModal = () => {
    setSelectedUserHistory(null);
    setHistoryError(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-purple-900 via-indigo-800 to-pink-700 text-white font-sans relative">

      {/* Top bar with Admin Logo and Logout */}
      <div className="flex justify-between items-center mb-6">
        {/* Admin Logo */}
        <div className="flex items-center space-x-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-pink-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
            />
          </svg>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-pink-600 hover:bg-pink-500 rounded-md font-semibold transition shadow-lg cursor-pointer"
        >
          Logout
        </button>
      </div>

      <div className="flex justify-center mb-10">
        <button
          onClick={() => navigate("/add-quiz")}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-md font-semibold transition shadow-md"
        >
          Add New Quiz
        </button>
      </div>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4 border-b border-white/30 pb-2">Quizzes</h2>
        {quizzes.length === 0 ? (
          <p className="text-center text-white/80">No quizzes found</p>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-lg bg-white/10">
            <table className="min-w-full text-white">
              <thead>
                <tr className="bg-indigo-700">
                  <th className="p-3 text-left">Title</th>
                  <th className="p-3 text-left">Description</th>
                  <th className="p-3 text-center">Questions Count</th>
                  <th className="p-3 text-center">Created At</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {quizzes.map((quiz, i) => (
                  <tr
                    key={quiz._id}
                    className={i % 2 === 0 ? "bg-white/10" : "bg-white/5"}
                  >
                    <td className="p-3">{quiz.title}</td>
                    <td className="p-3">{quiz.description}</td>
                    <td className="p-3 text-center">{quiz.questions.length}</td>
                    <td className="p-3 text-center">
                      {new Date(quiz.createdAt).toLocaleString()}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleDeleteQuiz(quiz._id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-500 rounded-md transition shadow-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-3xl font-semibold mb-4 border-b border-white/30 pb-2">Members & Quiz Performances</h2>
        {users.length === 0 ? (
          <p className="text-center text-white/80">No users found</p>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-lg bg-white/10">
            <table className="min-w-full text-white">
              <thead>
                <tr className="bg-indigo-700">
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Phone</th>
                  <th className="p-3 text-left">Role</th>
                  <th className="p-3 text-center">Created At</th>
                  <th className="p-3 text-center">History</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, i) => (
                  <tr
                    key={user._id}
                    className={i % 2 === 0 ? "bg-white/10" : "bg-white/5"}
                  >
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.phone || "-"}</td>
                    <td className="p-3">{user.role}</td>
                    <td className="p-3 text-center">
                      {new Date(user.createdAt).toLocaleString()}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => viewUserHistory(user.email)}
                        className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 rounded-md transition shadow-sm"
                      >
                        View History
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* History Modal */}
      {selectedUserHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-4 text-pink-400">
              History for: {selectedUserHistory.email}
            </h3>

            {loadingHistory && <p className="text-gray-400">Loading...</p>}
            {historyError && <p className="text-red-500">{historyError}</p>}

            {!loadingHistory && !historyError && (
              <>
                {selectedUserHistory.data.length === 0 ? (
                  <p className="text-gray-400">No history available.</p>
                ) : (
                  <table className="min-w-full text-white mb-4">
                    <thead>
                      <tr className="bg-indigo-700">
                        <th className="p-2 text-left">Topic</th>
                        <th className="p-2 text-center">Score</th>
                        <th className="p-2 text-center">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedUserHistory.data.map((attempt) => (
                        <tr key={attempt._id} className="border-b border-gray-600">
                          <td className="p-2">{attempt.title}</td>
                          <td className="p-2 text-center">
                            {attempt.score} / {attempt.totalQuestions}
                          </td>
                          <td className="p-2 text-center">
                            {new Date(attempt.date).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </>
            )}

            <button
              onClick={closeHistoryModal}
              className="mt-4 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded shadow"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
