import { useState, useEffect, useRef } from "react";
import { api } from "../api";

interface MockQuestion {
  id: number;
  question: string;
  options: string;
  difficulty: string;
  category_id: number;
  lesson_id: number;
  category_name: string;
}

interface Category {
  id: number;
  name: string;
  icon: string;
}

export default function MockTest() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCatId, setSelectedCatId] = useState<number | null>(null);
  const [questionCount, setQuestionCount] = useState(10);
  const [timeLimit, setTimeLimit] = useState(15);
  const [questions, setQuestions] = useState<MockQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [phase, setPhase] = useState<"setup" | "test" | "result">("setup");
  const [result, setResult] = useState<{ score: number; total: number; results: any[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    api.get<Category[]>("/categories").then((data) => {
      setCategories(data);
      setLoading(false);
    });
  }, []);

  const startTest = async () => {
    const params = selectedCatId ? `?category_id=${selectedCatId}&limit=${questionCount}` : `?limit=${questionCount}`;
    const data = await api.get<MockQuestion[]>("/mock/questions" + params);
    if (data.length === 0) return alert("Không đủ câu hỏi!");
    setQuestions(data);
    setAnswers({});
    setCurrentIdx(0);
    setTimeLeft(timeLimit * 60);
    setPhase("test");
  };

  useEffect(() => {
    if (phase !== "test") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { clearInterval(timerRef.current!); submitTest(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  const selectAnswer = (qId: number, ans: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: ans }));
  };

  const submitTest = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const payload = { answers: Object.entries(answers).map(([qId, selected]) => ({ question_id: parseInt(qId), selected })) };
    const res = await api.post<{ score: number; total: number; results: any[] }>("/mock/submit", payload);
    setResult(res);
    setPhase("result");
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  if (loading) return <div className="page"><h1>Thi thử</h1><p>Đang tải...</p></div>;

  if (phase === "result" && result) {
    const pct = Math.round((result.score / result.total) * 100);
    return (
      <div className="page mock-page">
        <h1>Kết quả thi thử</h1>
        <div className="mock-result-card">
          <div className="mock-result-score">{result.score}/{result.total}</div>
          <div className="mock-result-pct">{pct}%</div>
          <div className="mock-progress-bar">
            <div className="mock-progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <p>{pct >= 80 ? "Xuất sắc!" : pct >= 60 ? "Khá tốt!" : pct >= 40 ? "Cần cố gắng hơn" : "Ôn tập lại nhé!"}</p>
        </div>
        <div className="mock-review">
          {result.results.map((r, i) => (
            <div key={r.question_id} className={`mock-review-item ${r.correct ? "correct" : "wrong"}`}>
              <div className="mock-review-q">Câu {i + 1}: {questions.find(q => q.id === r.question_id)?.question}</div>
              <div className="mock-review-ans">Đáp án: {r.correct_answer}</div>
              {r.explanation && <div className="mock-review-exp">{r.explanation}</div>}
            </div>
          ))}
        </div>
        <button className="mock-btn" onClick={() => setPhase("setup")}>Làm bài khác</button>
      </div>
    );
  }

  if (phase === "test") {
    const q = questions[currentIdx];
    let opts: string[] = [];
    try { opts = JSON.parse(q.options || "[]"); } catch {}
    const answered = Object.keys(answers).length;
    return (
      <div className="page mock-page">
        <div className="mock-header">
          <h1>Thi thử</h1>
          <div className="mock-timer">{formatTime(timeLeft)}</div>
        </div>
        <div className="mock-progress-bar">
          <div className="mock-progress-fill" style={{ width: `${(answered / questions.length) * 100}%` }} />
        </div>
        <div className="mock-info">
          Câu {currentIdx + 1}/{questions.length} &middot; {q.category_name}
        </div>
        <div className="mock-question">
          <div className="mock-q-text">{q.question}</div>
          <div className="mock-options">
            {opts.map((opt, i) => (
              <button
                key={i}
                className={`mock-option ${answers[q.id] === opt ? "selected" : ""}`}
                onClick={() => selectAnswer(q.id, opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
        <div className="mock-nav">
          <button className="mock-btn" disabled={currentIdx === 0} onClick={() => setCurrentIdx((i) => i - 1)}>Trước</button>
          <button className="mock-btn" disabled={currentIdx >= questions.length - 1} onClick={() => setCurrentIdx((i) => i + 1)}>Sau</button>
        </div>
        <div className="mock-dots">
          {questions.map((_, i) => (
            <span key={i} className={`mock-dot ${answers[questions[i].id] ? "answered" : ""} ${i === currentIdx ? "active" : ""}`} onClick={() => setCurrentIdx(i)} />
          ))}
        </div>
        <div className="mock-submit-area">
          <button className="mock-btn submit" onClick={submitTest}>
            Nộp bài ({answered}/{questions.length})
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page mock-page">
      <h1>Thi thử</h1>
      <p className="mock-desc">Chọn chứng chỉ và số lượng câu hỏi</p>
      <div className="mock-setup">
        <div className="mock-field">
          <label>Chứng chỉ</label>
          <div className="mock-cats">
            <button className={`mock-cat-btn ${selectedCatId === null ? "selected" : ""}`} onClick={() => setSelectedCatId(null)}>Tất cả</button>
            {categories.map((c) => (
              <button key={c.id} className={`mock-cat-btn ${selectedCatId === c.id ? "selected" : ""}`} onClick={() => setSelectedCatId(c.id)}>{c.icon} {c.name}</button>
            ))}
          </div>
        </div>
        <div className="mock-field">
          <label>Số câu hỏi: {questionCount}</label>
          <input type="range" min={5} max={30} step={5} value={questionCount} onChange={(e) => setQuestionCount(parseInt(e.target.value))} />
        </div>
        <div className="mock-field">
          <label>Thời gian: {timeLimit} phút</label>
          <input type="range" min={5} max={60} step={5} value={timeLimit} onChange={(e) => setTimeLimit(parseInt(e.target.value))} />
        </div>
        <button className="mock-btn start" onClick={startTest}>Bắt đầu thi</button>
      </div>
    </div>
  );
}
