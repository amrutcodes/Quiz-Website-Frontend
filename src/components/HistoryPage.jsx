import React, { useEffect, useState } from "react";

const HistoryPage = () => {
  const user = localStorage.getItem("USER");
  const userEmail = user ? JSON.parse(user).email : null;
  const [history, setHistory] = useState([]);
  const [selectedAttempt, setSelectedAttempt] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState(null);
  console.log("userEmail", userEmail);
  useEffect(() => {
  
    if (userEmail) {
      fetch(`http://localhost:4000/api/history/get?userEmail=${userEmail}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setHistory(data.data);
        });
    }
  }, [userEmail]);

  const viewAttemptDetails = async (historyId) => {
    console.log("historyId", historyId);
    setLoadingDetails(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:4000/api/history/getById/${historyId}`);
      const data = await res.json();
      console.log("data", data);
      if (data.success) {
        setSelectedAttempt(data.data);
      } else {
        setError("Failed to load attempt details");
      }
    } catch (err){
      setError("Failed to load attempt details");
      console.log("err", err);
    }
    setLoadingDetails(false);
  };

  const closeDetails = () => {
    setSelectedAttempt(null);
    setError(null);
  };

  return (
    <div className="bg-gradient-to-br from-purple-900 via-indigo-800 to-pink-700 w-full min-h-screen flex justify-center items-center p-4">
      <div className="w-full max-w-4xl bg-gray-900 p-8 rounded-lg shadow-xl mx-auto">
        <h2 className="text-4xl font-bold mb-6 text-pink-400">Quiz History</h2>
        {history.length === 0 ? (
          <p className="text-gray-400">No past attempts found.</p>
        ) : (
          <table className="w-full text-left text-white">
            <thead>
              <tr className="border-b border-pink-600">
                <th className="py-2 px-4">Topic</th>
                <th className="py-2 px-4">Score</th>
                <th className="py-2 px-4">Date</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {history.map(({ _id, title, score, totalQuestions, date }, idx) => (
                <tr
                  key={_id}
                  className="border-b border-gray-700 hover:bg-pink-900/30"
                >
                  <td className="py-2 px-4 capitalize">{title}</td>
                  <td className="py-2 px-4">
                    {score} / {totalQuestions}
                  </td>
                  <td className="py-2 px-4">{new Date(date).toLocaleString()}</td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => viewAttemptDetails(_id)}
                      className="bg-pink-600 hover:bg-pink-700 text-white px-3 py-1 rounded shadow"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedAttempt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 max-w-xl w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-4 text-pink-400">
              Attempt Details: {selectedAttempt.quizId.title}
            </h3>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            {loadingDetails ? (
              <p className="text-gray-400">Loading...</p>
            ) : (
              <>
                {selectedAttempt.quizId.questions ? (
                  selectedAttempt.quizId.questions.map((q, i) => {
                    const userAnswerObj = selectedAttempt.answers?.find(
                      (a) =>
                        a.question.trim().toLowerCase() ===
                        q.question.trim().toLowerCase()
                    );

                    return (
                      <div key={i} className="mb-4">
                        <p className="font-semibold text-white mb-2">
                          Q{i + 1}: {q.question}
                        </p>
                        <ul>
                          {q.options.map((opt, idx) => {
                            const isSelected = userAnswerObj?.selectedOption === opt.option;
                            const isCorrect = opt.correct;

                            let icon = null;
                            let styleClasses = "pl-4 flex items-center rounded px-2 py-0.5 ";

                            if (isSelected && isCorrect) {
                              icon = <span className="text-green-500 font-bold mr-2">✔</span>;
                              styleClasses += "bg-green-900 text-white font-bold border-2 border-green-500";
                            } else if (isSelected && !isCorrect) {
                              icon = <span className="text-red-500 font-bold mr-2">✘</span>;
                              styleClasses += "bg-red-900 text-red-400 font-semibold border-2 border-red-500";
                            } else if (!isSelected && isCorrect) {
                              icon = <span className="text-green-500 font-bold mr-2">✔</span>;
                              styleClasses += "text-green-400";
                            } else {
                              styleClasses += "text-gray-500";
                            }

                            return (
                              <li key={idx} className={styleClasses}>
                                {icon} {opt.option}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-400">No question details available.</p>
                )}
              </>
            )}

            <button
              onClick={closeDetails}
              className="mt-4 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded shadow"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
