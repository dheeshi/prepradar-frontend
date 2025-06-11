import { useEffect, useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await API.get("/quiz/start");
        setQuestions(res.data);
      } catch {
        toast.error("Failed to load quiz. Please log in.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleChange = (qid, ans) => {
    setAnswers({ ...answers, [qid]: ans });
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length === 0) {
      toast.warn("Please answer at least one question.");
      return;
    }

    const payload = Object.keys(answers).map((qid) => ({
      questionId: qid,
      userAnswer: answers[qid],
    }));

    try {
      const res = await API.post("/quiz/submit", payload);
      setResult(res.data);
      console.log("🧪 Result from backend:", res.data);
    } catch  {
      toast.error("Quiz submission failed.");
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  if (result) {
    return (
      <div className="max-w-3xl mx-auto mt-10">
        <h2 className="text-2xl font-bold mb-4 text-center">Quiz Results</h2>
        <p className="mb-2 text-center">
          You scored {result.totalCorrect} out of {result.totalQuestions}
        </p>
        <ul className="space-y-4">
          {result.feedbackList.map((item, i) => (
            <li key={i} className="border p-4 rounded">
              <p className="font-medium">{item.question}</p>
              <p className="text-sm">Your Answer: <strong>{item.userAnswer}</strong></p>
              <p className="text-sm">Correct Answer: <strong>{item.correctAnswer}</strong></p>
              <p className={`text-sm ${item.correct ? "text-green-600" : "text-red-500"}`}>
                {item.correct ? "Congrats" : "sorry! try again"}
              </p>
              <p className="mt-1 italic text-gray-700">AI Feedback: {item.aiFeedback}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Quiz</h2>
      {questions.length === 0 ? (
        <p className="text-center text-red-500">No questions available.</p>
      ) : (
        questions.map((q, index) => (
          <div key={q.id} className="mb-6 border p-4 rounded">
            <p className="mb-2 font-medium">
              {index + 1}. {q.questionText}
            </p>
            {q.options.map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={q.id}
                  value={opt}
                  onChange={() => handleChange(q.id, opt)}
                  checked={answers[q.id] === opt}
                />
                <label>{opt}</label>
              </div>
            ))}
          </div>
        ))
      )}

      {questions.length > 0 && (
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Submit Quiz
        </button>
      )}
    </div>
  );
};

export default Quiz;
