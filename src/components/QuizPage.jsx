import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function QuizPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [answers, setAnswers] = useState([]);

   const user = localStorage.getItem("USER");
  const userEmail = user ? JSON.parse(user).email : null;

  useEffect(() => {
    async function fetchQuiz() {
      try {
        const res = await fetch(`http://localhost:4000/api/quiz/getById/${quizId}`);
        if (!res.ok) throw new Error("Quiz not found");
        const data = await res.json();
        setQuiz(data);
        setIndex(0);
        setScore(0);
        setShowScore(false);
        setAnswers([]);
      } catch (err) {
        console.error(err);
      }
    }
    fetchQuiz();
  }, [quizId]);

  const handleAnswer = async (selectedOption) => {
    const currentQuestion = quiz.questions[index];
    const selectedOptObj = currentQuestion.options.find(opt => opt.option === selectedOption);
    const correct = selectedOptObj?.correct === true;

    if (correct) setScore(prev => prev + 1);

    setAnswers(prev => [
      ...prev,
      {
        question: currentQuestion.question,
        selectedOption,
        isCorrect: correct,
      },
    ]);

    const next = index + 1;
    if (next < quiz.questions.length) {
      setIndex(next);
    } else {
      setShowScore(true);

      try {
        await fetch("http://localhost:4000/api/history/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userEmail,
            quizId,
            score: correct ? score + 1 : score,
            totalQuestions: quiz.questions.length,
            answers: [
              ...answers,
              {
                question: currentQuestion.question,
                selectedOption,
                isCorrect: correct,
              },
            ],
          }),
        });
      } catch (err) {
        console.error("Failed to save result", err);
      }
    }
  };

  if (!quiz) return <div className="text-white text-center mt-40">Loading quiz...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-pink-700 text-white px-6 pt-24 pb-12 flex flex-col items-center">
      <button
        onClick={() => navigate("/dashboard")}
        className="self-start mb-6 text-pink-300 underline hover:text-pink-500 transition-colors"
      >
        ← Back to Dashboard
      </button>

      <h2 className="text-4xl font-extrabold mb-8 text-orange-400">
        {quiz.title} Quiz
      </h2>

      {showScore ? (
        <div className="text-center max-w-md px-6 py-10 bg-gray-800 rounded-lg shadow-lg">
          <h3 className="text-3xl font-semibold mb-4">
            Score: {score} / {quiz.questions.length}
          </h3>

          <p className="text-xl mb-6 text-gray-300 leading-relaxed">
            {(() => {
              const percent = (score / quiz.questions.length) * 100;
              if (percent === 100) return "🌟 Perfect score! Outstanding!";
              if (percent >= 60) return "👍 Good job! Keep practicing!";
              return "📚 Don't worry! Practice makes perfect.";
            })()}
          </p>

          <button
            onClick={() => navigate("/dashboard")}
            className="mt-4 bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded font-bold"
          >
            Back to Dashboard
          </button>
        </div>
      ) : (
        <div className="w-full max-w-3xl bg-gray-900 rounded-lg p-8 shadow-lg">
          <p className="text-lg mb-6 font-medium tracking-wide text-pink-400">
            Question {index + 1} of {quiz.questions.length}
          </p>

          <h3 className="text-2xl font-semibold mb-6 leading-snug">
            {quiz.questions[index].question}
          </h3>

          <div className="grid gap-4">
            {quiz.questions[index].options.map(({ option }) => (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                className="border-2 border-pink-500 text-pink-400 rounded-lg py-3 font-semibold
                  hover:bg-pink-600 hover:text-white transition-colors duration-200 shadow-sm
                  focus:outline-none focus:ring-4 focus:ring-pink-400"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
