import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

const AdminPanel = () => {
  const [questions, setQuestions] = useState([]);

  const loadQuestions = async () => {
    try {
      const res = await API.get("/questions/all");
      setQuestions(res.data);
    } catch  {
      alert("Access denied or error loading questions");
    }
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  const deleteQuestion = async (id) => {
    if (!window.confirm("Are you sure you want to delete?")) return;
    await API.delete(`/questions/${id}`);
    loadQuestions();
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Admin Panel - Questions</h2>
        <Link to="/admin/add" className="bg-blue-600 text-white px-4 py-2 rounded">
          + Add New
        </Link>
      </div>
      <ul className="space-y-4">
        {questions.map((q) => (
          <li key={q.id} className="border p-4 rounded">
            <div className="flex justify-between">
              <div>
                <p><strong>{q.questionText}</strong></p>
                <p className="text-sm text-gray-500">{q.topic} • {q.difficulty}</p>
              </div>
              <div className="space-x-2">
                <Link to={`/admin/edit/${q.id}`} className="text-blue-600 underline">Edit</Link>
                <button onClick={() => deleteQuestion(q.id)} className="text-red-600 underline">Delete</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPanel;
