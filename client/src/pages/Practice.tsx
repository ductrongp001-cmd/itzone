import { useState, useEffect } from "react";
import { api } from "../api";

interface PracticeQuestion {
  id: number; question: string; options: string;
  difficulty: string; category_id: number; lesson_id: number; category_name: string;
}

export default function Practice() {
  const [categories, setCategories] = useState<{ id: number; name: string; icon: string }[]>([]);
  const [selectedCatId, setSelectedCatId] = useState<number | null>(null);
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [phase, setPhase] = useState<"setup" | "practice" | "done">("setup");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ id: number; name: string; icon: string }[]>("/categories").then((data) => { setCategories(data); setLoading(false); });
  }, []);

  const startPractice = async () => {
    const params = selectedCatId ? `?category_id=${selectedCatId}` : "";
    const data = await api.get<PracticeQuestion[]>("/questions" + params);
    for (let i = data.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [data[i], data[j]] = [data[j], data[i]]; }
    setQuestions(data.slice(0, 20));
    setCurrentIdx(0);
    setSelected(null);
    setRevealed(false);
    setCorrectCount(0);
    setPhase("practice");
  };

  const checkAnswer = (ans: string) => {
    if (revealed) return;
    setSelected(ans);
    setRevealed(true);
    if (ans === (questions[currentIdx] as any).correct_answer) setCorrectCount((c) => c + 1);
  };

  const next = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((i) => i + 1);
      setSelected(null);
      setRevealed(false);
    } else {
      setPhase("done");
    }
  };

  if (loading) return <div className="page"><h1>Luyện tập</h1><p>Đang tải...</p></div>;

  if (phase === "done") {
    const pct = Math.round((correctCount / questions.length) * 100);
    return (
      <div className="page practice-page">
        <h1>Luyện tập</h1>
        <div className="practice-done">
          <h2>Hoàn thành!</h2>
          <p>Đúng: <strong>{correctCount}</strong>/{questions.length} ({pct}%)</p>
          <div className="mock-progress-bar"><div className="mock-progress-fill" style={{ width: `${pct}%` }} /></div>
          <button className="practice-btn start" onClick={startPractice}>Luyện tiếp</button>
          <button className="practice-btn" onClick={() => setPhase("setup")}>Chọn chủ đề</button>
        </div>
      </div>
    );
  }

  if (phase === "practice") {
    const q = questions[currentIdx];
    let opts: string[] = [];
    try { opts = JSON.parse(q.options || "[]"); } catch {}
    for (let i = opts.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [opts[i], opts[j]] = [opts[j], opts[i]]; }
    const correct = (q as any).correct_answer;
    return (
      <div className="page practice-page">
        <div className="practice-header">
          <h1>Luyện tập</h1>
          <span className="practice-counter">{currentIdx + 1}/{questions.length}</span>
        </div>
        <div className="mock-progress-bar"><div className="mock-progress-fill" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }} /></div>
        <div className="practice-info">{q.category_name}</div>
        <div className="practice-card">
          <div className="practice-q">{q.question}</div>
          <div className="practice-options">
            {opts.map((opt, i) => {
              let cls = "practice-opt";
              if (revealed) {
                if (opt === correct) cls += " correct";
                if (opt === selected && opt !== correct) cls += " wrong";
              }
              return (
                <button key={i} className={cls} onClick={() => checkAnswer(opt)} disabled={revealed}>
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
        {revealed && (
          <div className={`practice-feedback ${selected === correct ? "correct" : "wrong"}`}>
            {selected === correct ? "✅ Đúng rồi!" : "❌ Sai rồi!"}
            <div className="practice-answer">Đáp án: {correct}</div>
            <button className="practice-btn" onClick={next}>{currentIdx < questions.length - 1 ? "Câu tiếp" : "Xem kết quả"}</button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="page practice-page">
      <h1>Luyện tập</h1>
      <p className="practice-desc">Chọn chứng chỉ để luyện tập (bỏ trống để học tất cả)</p>
      <div className="practice-cats">
        <button className={`practice-cat-btn ${selectedCatId === null ? "selected" : ""}`} onClick={() => setSelectedCatId(null)}>Tất cả</button>
        {categories.map((c) => (
          <button key={c.id} className={`practice-cat-btn ${selectedCatId === c.id ? "selected" : ""}`} onClick={() => setSelectedCatId(c.id)}>{c.icon} {c.name}</button>
        ))}
      </div>
      <button className="practice-btn start" onClick={startPractice} disabled={categories.length === 0}>Bắt đầu</button>
    </div>
  );
}
