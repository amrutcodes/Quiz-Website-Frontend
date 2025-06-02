import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddQuiz() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([
    {
      question: "",
      options: [
        { option: "", correct: false },
        { option: "", correct: false },
        { option: "", correct: false },
        { option: "", correct: false },
      ],
    },
  ]);
  const navigate = useNavigate();

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].question = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex].option = value;
    setQuestions(newQuestions);
  };

  const handleCorrectChange = (qIndex, oIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options = newQuestions[qIndex].options.map((opt, idx) => ({
      ...opt,
      correct: idx === oIndex,
    }));
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        options: [
          { option: "", correct: false },
          { option: "", correct: false },
          { option: "", correct: false },
          { option: "", correct: false },
        ],
      },
    ]);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      alert("Title and description are required");
      return;
    }
    for (const q of questions) {
      if (!q.question.trim()) {
        alert("All questions must have text");
        return;
      }
      for (const opt of q.options) {
        if (!opt.option.trim()) {
          alert("All options must have text");
          return;
        }
      }
      if (!q.options.some((opt) => opt.correct)) {
        alert("Each question must have one correct option");
        return;
      }
    }

    try {
      await axios.post("http://localhost:4000/api/quiz/create", { title, description, questions });
      alert("Quiz added successfully");
      navigate("/admin");
    } catch (error) {
      console.error(error);
      alert("Failed to add quiz");
    }
  };

  return (
    <div className="min-h-screen w-full p-8 bg-gradient-to-br from-purple-900 via-indigo-800 to-pink-700 text-white font-sans relative">
      
      {/* Back to Dashboard button aligned top-left */}
      <button
        type="button"
        onClick={() => navigate("/admin")}
        className="absolute top-4 left-4 px-4 py-2 bg-pink-600 hover:bg-pink-900 rounded-md font-semibold transition"
      >
        &larr; Back to Dashboard
      </button>

      <h1 className="text-4xl font-bold mb-8 text-center">Add New Quiz</h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto" autoComplete="off">
        <div>
          <label className="block mb-1 font-semibold" htmlFor="title">
            Title:
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoComplete="off"
            className="w-full rounded-md px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold" htmlFor="description">
            Description:
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={3}
            autoComplete="off"
            className="w-full rounded-md px-3 py-2 text-black resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <h3 className="text-2xl font-semibold mb-4 border-b border-white/30 pb-2">Questions</h3>

        {questions.map((q, qIndex) => (
          <div key={qIndex} className="bg-white/10 p-5 rounded-md mb-6 shadow-md">
            <label className="block mb-2 font-semibold" htmlFor={`question-${qIndex}`}>
              Question {qIndex + 1}:
              <input
                id={`question-${qIndex}`}
                type="text"
                value={q.question}
                onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                required
                autoComplete="off"
                className="mt-1 block w-full rounded-md px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </label>

            <div className="mt-4">
              <b className="block mb-2">Options:</b>
              {q.options.map((opt, oIndex) => (
                <div key={oIndex} className="flex items-center mb-3 space-x-3">
                  <input
                    type="radio"
                    name={`correctOption${qIndex}`}
                    checked={opt.correct}
                    onChange={() => handleCorrectChange(qIndex, oIndex)}
                    required
                    className="w-5 h-5 text-pink-500 focus:ring-pink-400"
                  />
                  <input
                    type="text"
                    value={opt.option}
                    onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                    placeholder={`Option ${oIndex + 1}`}
                    required
                    autoComplete="off"
                    className="flex-grow rounded-md px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
              ))}
            </div>

            {questions.length > 1 && (
              <button
                type="button"
                onClick={() => removeQuestion(qIndex)}
                className="mt-2 px-3 py-1 text-sm bg-red-600 hover:bg-red-500 rounded-md transition"
              >
                Remove Question
              </button>
            )}
          </div>
        ))}

        <div>
          <button
            type="button"
            onClick={addQuestion}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-md font-semibold transition"
          >
            Add Question
          </button>
        </div>

        <div>
          <button
            type="submit"
            className="w-full px-5 py-3 bg-pink-600 hover:bg-pink-500 rounded-md text-white font-bold transition"
          >
            Create Quiz
          </button>
        </div>
      </form>
    </div>
  );
}
