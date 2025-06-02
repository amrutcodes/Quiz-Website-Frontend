import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

export default function QuizPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(15);
  const timerRef = useRef(null);

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

  useEffect(() => {
    if (quiz && !showScore) {
      setTimeLeft(15);
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [index, quiz, showScore]);

  const handleTimeout = () => {
    const currentQuestion = quiz.questions[index];
    if (index + 1 === quiz.questions.length) {
      saveHistory();
      setShowScore(true);
    } else {
      setIndex((prev) => prev + 1);
    }
  };

  const handleAnswer = (selectedOption) => {
    clearInterval(timerRef.current);

    const currentQuestion = quiz.questions[index];
    const selectedOptObj = currentQuestion.options.find(opt => opt.option === selectedOption);
    const correct = selectedOptObj?.correct === true;

    if (correct) setScore((prev) => prev + 1);

    setAnswers((prev) => [
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
      saveHistory(selectedOption, correct);
    }
  };

  const saveHistory = async (lastSelectedOption = null, lastCorrect = false) => {
    const currentQuestion = quiz.questions[index];
    const attempted = answers.length > 0 || lastSelectedOption !== null;

    const finalAnswers = lastSelectedOption
      ? [
          ...answers,
          {
            question: currentQuestion.question,
            selectedOption: lastSelectedOption,
            isCorrect: lastCorrect,
          },
        ]
      : answers;

    const finalScore = lastSelectedOption && lastCorrect ? score + 1 : score;

    try {
      await fetch("http://localhost:4000/api/history/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail,
          quizId,
          score: attempted ? finalScore : 0,
          totalQuestions: quiz.questions.length,
          answers: finalAnswers,
          attempted,
        }),
      });
    } catch (err) {
      console.error("Failed to save result", err);
    }
  };

  if (!quiz) return <div className="text-white text-center mt-40">Loading quiz...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-pink-700 text-white px-4 pt-8 pb-12 flex flex-col items-center relative">
      
      {/* Back to Dashboard top right */}
      <button
        onClick={() => navigate("/dashboard")}
        className="absolute top-6 left-6 text-pink-300 underline hover:text-pink-500 transition-colors font-semibold"
      >
        ← Back to Dashboard
      </button>

      {/* Quiz Title near top */}
      <h2 className="text-5xl font-extrabold mb-12 mt-4 text-orange-400 text-center max-w-4xl">
        {quiz.title} Quiz
      </h2>

      {showScore ? (
        <div className="text-center max-w-md px-8 py-12 bg-gray-800/70 rounded-3xl shadow-2xl backdrop-blur-md">
          <h3 className="text-3xl font-bold mb-4">Score: {score} / {quiz.questions.length}</h3>
          <p className="text-lg mb-6 text-gray-300 leading-relaxed">
            {(() => {
              const percent = (score / quiz.questions.length) * 100;
              if (percent === 100) return "🌟 Perfect score! Outstanding!";
              if (percent >= 60) return "👍 Good job! Keep practicing!";
              return "📚 Don't worry! Practice makes perfect.";
            })()}
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-4 bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-full font-bold"
          >
            Back to Dashboard
          </button>
        </div>
      ) : (
        <div className="w-full max-w-4xl bg-black/30 rounded-3xl p-10 shadow-2xl flex flex-col gap-8 md:flex-row items-start">
          {/* Question section */}
          <div className="flex-1 flex flex-col gap-6">
            <p className="text-pink-300 text-sm font-medium tracking-wider uppercase">
              Question {index + 1} / {quiz.questions.length}
            </p>
            <h3 className="text-2xl font-semibold leading-snug">{quiz.questions[index].question}</h3>

            <div className="flex flex-col gap-4 mt-4">
              {quiz.questions[index].options.map(({ option }) => (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  className="bg-pink-500/20 border border-pink-400 text-pink-100 rounded-full py-3 px-5 font-semibold
                    hover:bg-pink-600 hover:text-white transition-colors duration-200 shadow-md
                    focus:outline-none focus:ring-4 focus:ring-pink-400/50"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Timer section */}
          <div className="flex flex-col items-center justify-center ml-auto">
            <p className="text-sm text-pink-200 uppercase tracking-widest">Time Left</p>
            <div
              className={`text-6xl font-bold mt-2 ${
                timeLeft <= 5
                  ? "text-red-500 animate-pulse"
                  : "text-orange-300"
              }`}
            >
              {timeLeft}s
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
