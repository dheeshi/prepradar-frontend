import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate, useParams } from "react-router-dom";

const EditQuestion = () => {
  const [form, setForm] = useState({
    questionText: "",
    topic: "",
    difficulty: "EASY",
    correctAnswer: "",
    options: ["", "", "", ""]
  });

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/questions/all").then((res) => {
      const q = res.data.find((item) => item.id === id);
      if (q) setForm(q);
    });
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOptionChange = (i, val) => {
    const updated = [...form.options];
    updated[i] = val;
    setForm({ ...form, options: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.put(`/questions/${id}`, form);
    navigate("/admin");
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">Edit Question</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="questionText" value={form.questionText} onChange={handleChange} placeholder="Question text" className="w-full p-2 border" />
        <input name="topic" value={form.topic} onChange={handleChange} placeholder="Topic" className="w-full p-2 border" />
        <select name="difficulty" value={form.difficulty} onChange={handleChange} className="w-full p-2 border">
          <option value="EASY">EASY</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HARD">HARD</option>
        </select>
        {form.options.map((opt, i) => (
          <input key={i} value={opt} onChange={(e) => handleOptionChange(i, e.target.value)} placeholder={`Option ${i + 1}`} className="w-full p-2 border" />
        ))}
        <input name="correctAnswer" value={form.correctAnswer} onChange={handleChange} placeholder="Correct Answer" className="w-full p-2 border" />
        <button type="submit" className="bg-yellow-600 text-white px-4 py-2 rounded">Update</button>
      </form>
    </div>
  );
};

export default EditQuestion;
