import { useState, useEffect, useRef } from "react";
import { api } from "../api";

interface MockQuestion {
  id: number; question: string; options: string;
  difficulty: string; category_id: number; lesson_id: number; category_name: string;
}

interface Category { id: number; name: string; icon: string; }

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
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const timerRef = useRef<any>(null);
  const answersRef = useRef<Record<number, string>>({});

  useEffect(() => {
    api.get<Category[]>("/categories").then((data) => {
      setCategories(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => { answersRef.current = answers; }, [answers]);

  const startTest = async () => {
    setError("");
    const params = selectedCatId ? `?category_id=${selectedCatId}&limit=${questionCount}` : `?limit=${questionCount}`;
    const data = await api.get<MockQuestion[]>("/mock/questions" + params);
    if (data.length === 0) return alert("Không đủ câu hỏi!");
    setQuestions(data);
    setAnswers({});
    answersRef.current = {};
    setCurrentIdx(0);
    setTimeLeft(timeLimit * 60);
    setPhase("test");
  };

  useEffect(() => {
    if (phase !== "test") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { clearInterval(timerRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  useEffect(() => {
    if (phase !== "test" || timeLeft > 0 || submitting) return;
    handleSubmit();
  }, [timeLeft]);

  const selectAnswer = (qId: number, ans: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: ans }));
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    setError("");
    if (timerRef.current) clearInterval(timerRef.current);
    try {
      const ans = answersRef.current;
      const payload = { answers: Object.entries(ans).map(([qId, selected]) => ({ question_id: parseInt(qId), selected })) };
      const res = await api.post<any>("/mock/submit", payload);
      if (!res || typeof res.score !== "number") throw new Error("Invalid response");
      setResult(res);
      setPhase("result");
    } catch (e: any) {
      setError(e.message || "Không thể nộp bài");
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  if (error) {
    return (
      <div className="page">
        <h1>Thi thử</h1>
        <div className="auth-error" style={{padding:"1rem",marginBottom:"1rem"}}>{error}</div>
        <button className="mock-btn" onClick={() => { setError(""); setPhase("setup"); }}>Thử lại</button>
      </div>
    );
  }

  if (loading) return <div className="page"><h1>Thi thử</h1><p>Đang tải...</p></div>;

  if (phase === "result") {
    if (!result) return <div className="page"><h1>Thi thử</h1><p>Đang xử lý...</p></div>;
    const total = result.total || 1;
    const pct = Math.round((result.score / total) * 100);
    const items = Array.isArray(result.results) ? result.results : [];
    return (
      <div className="page" style={{paddingBottom:"2rem"}}>
        <h1>Kết quả thi thử</h1>
        <div style={{textAlign:"center",padding:"2rem",background:"var(--bg-card,#fff)",borderRadius:16,border:"2px solid var(--border,#e2e8f0)",marginBottom:"1.5rem"}}>
          <div style={{fontSize:"3rem",fontWeight:700,color:"#2563eb"}}>{result.score}/{result.total}</div>
          <div style={{fontSize:"1.3rem",color:"#64748b",marginBottom:"0.5rem"}}>{pct}%</div>
          <div style={{height:6,background:"#e2e8f0",borderRadius:3,maxWidth:300,margin:"1rem auto",overflow:"hidden"}}>
            <div style={{height:"100%",width:`${pct}%`,background:"linear-gradient(135deg,#2563eb,#7c3aed)",borderRadius:3,transition:"width 0.3s"}} />
          </div>
          <p style={{fontSize:"1.1rem",fontWeight:600,color:pct>=80?"#059669":"#64748b"}}>
            {pct >= 80 ? "Xuất sắc!" : pct >= 60 ? "Khá tốt!" : pct >= 40 ? "Cần cố gắng hơn" : "Ôn tập lại nhé!"}
          </p>
        </div>
        {items.length > 0 && (
          <div style={{display:"flex",flexDirection:"column",gap:"0.8rem",marginBottom:"1.5rem"}}>
            {items.map((r: any, i: number) => (
              <div key={r.question_id || i} style={{padding:"1rem",borderRadius:12,border:"2px solid",background:r.correct?"#f0fdf4":"#fef2f2",borderColor:r.correct?"#86efac":"#fca5a5"}}>
                <div style={{fontWeight:600,marginBottom:"0.3rem",color:"#1e293b"}}>
                  Câu {i + 1}: {questions.find(q => q.id === r.question_id)?.question || ""}
                </div>
                <div style={{fontSize:"0.9rem",color:"#059669",fontWeight:500}}>Đáp án: {r.correct_answer || ""}</div>
                {r.explanation && <div style={{fontSize:"0.85rem",color:"#64748b",marginTop:"0.3rem"}}>{r.explanation}</div>}
              </div>
            ))}
          </div>
        )}
        <button className="mock-btn" onClick={() => { setResult(null); setPhase("setup"); }}>Làm bài khác</button>
      </div>
    );
  }

  if (phase === "test") {
    const q = questions[currentIdx];
    let opts: string[] = [];
    try { opts = JSON.parse(q?.options || "[]"); } catch {}
    for (let i = opts.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [opts[i], opts[j]] = [opts[j], opts[i]]; }
    const answered = Object.keys(answers).length;
    return (
      <div className="page" style={{paddingBottom:"2rem"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1rem"}}>
          <h1 style={{margin:0}}>Thi thử</h1>
          <div style={{fontSize:"1.5rem",fontWeight:700,color:"#dc2626",fontVariantNumeric:"tabular-nums"}}>{formatTime(timeLeft)}</div>
        </div>
        <div style={{height:6,background:"#e2e8f0",borderRadius:3,marginBottom:"1rem",overflow:"hidden"}}>
          <div style={{height:"100%",width:`${(answered/questions.length)*100}%`,background:"linear-gradient(135deg,#2563eb,#7c3aed)",borderRadius:3,transition:"width 0.3s"}} />
        </div>
        <div style={{fontSize:"0.9rem",color:"#64748b",marginBottom:"1rem"}}>Câu {currentIdx+1}/{questions.length} &middot; {q?.category_name||""}</div>
        <div style={{background:"var(--bg-card,#fff)",borderRadius:16,padding:"1.5rem",border:"2px solid var(--border,#e2e8f0)",marginBottom:"1rem"}}>
          <div style={{fontSize:"1.1rem",fontWeight:600,color:"var(--text,#1e293b)",marginBottom:"1.2rem",lineHeight:1.5}}>{q?.question||""}</div>
          <div style={{display:"flex",flexDirection:"column",gap:"0.6rem"}}>
            {opts.map((opt, i) => (
              <button key={i} onClick={() => selectAnswer(q.id, opt)}
                style={{padding:"0.8rem 1rem",border:"2px solid",borderRadius:10,background:answers[q.id]===opt?"#dbeafe":"var(--bg-card,#fff)",borderColor:answers[q.id]===opt?"#2563eb":"#e2e8f0",color:answers[q.id]===opt?"#2563eb":"var(--text,#1e293b)",fontFamily:"inherit",fontSize:"0.95rem",cursor:"pointer",textAlign:"left",transition:"all 0.2s"}}>
                {opt}
              </button>
            ))}
          </div>
        </div>
        <div style={{display:"flex",gap:"1rem",justifyContent:"center",marginBottom:"1rem"}}>
          <button className="mock-btn" disabled={currentIdx===0} onClick={() => setCurrentIdx(i=>i-1)}>Trước</button>
          <button className="mock-btn" disabled={currentIdx>=questions.length-1} onClick={() => setCurrentIdx(i=>i+1)}>Sau</button>
        </div>
        <div style={{display:"flex",gap:"0.4rem",justifyContent:"center",marginBottom:"1rem",flexWrap:"wrap"}}>
          {questions.map((_, i) => (
            <span key={i} onClick={() => setCurrentIdx(i)}
              style={{width:14,height:14,borderRadius:"50%",background:answers[questions[i].id]?"#2563eb":"#e2e8f0",cursor:"pointer",transition:"all 0.2s",border: i===currentIdx?"2px solid #1e293b":"2px solid transparent",transform:i===currentIdx?"scale(1.3)":"none"}} />
          ))}
        </div>
        <div style={{textAlign:"center"}}>
          <button onClick={handleSubmit} disabled={submitting}
            style={{padding:"0.7rem 2rem",border:"none",borderRadius:10,background:"#059669",color:"#fff",fontFamily:"inherit",fontSize:"1rem",fontWeight:600,cursor:"pointer"}}>
            {submitting ? "Đang nộp..." : `Nộp bài (${answered}/${questions.length})`}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page" style={{paddingBottom:"2rem"}}>
      <h1>Thi thử</h1>
      <p style={{color:"#64748b",marginBottom:"1.5rem",fontSize:"1.05rem"}}>Chọn chứng chỉ và số lượng câu hỏi</p>
      <div style={{maxWidth:500}}>
        <div style={{marginBottom:"1.5rem"}}>
          <label style={{display:"block",fontWeight:600,marginBottom:"0.5rem",color:"var(--text,#1e293b)",fontSize:"0.95rem"}}>Chứng chỉ</label>
          <div style={{display:"flex",flexWrap:"wrap",gap:"0.5rem"}}>
            <button onClick={() => setSelectedCatId(null)}
              style={{padding:"0.5rem 1rem",border:"2px solid",borderRadius:10,fontFamily:"inherit",fontSize:"0.9rem",cursor:"pointer",background:selectedCatId===null?"#2563eb":"var(--bg-card,#fff)",color:selectedCatId===null?"#fff":"var(--text,#1e293b)",borderColor:selectedCatId===null?"#2563eb":"#e2e8f0"}}>Tất cả</button>
            {categories.map(c => (
              <button key={c.id} onClick={() => setSelectedCatId(c.id)}
                style={{padding:"0.5rem 1rem",border:"2px solid",borderRadius:10,fontFamily:"inherit",fontSize:"0.9rem",cursor:"pointer",background:selectedCatId===c.id?"#2563eb":"var(--bg-card,#fff)",color:selectedCatId===c.id?"#fff":"var(--text,#1e293b)",borderColor:selectedCatId===c.id?"#2563eb":"#e2e8f0"}}>{c.icon} {c.name}</button>
            ))}
          </div>
        </div>
        <div style={{marginBottom:"1.5rem"}}>
          <label style={{display:"block",fontWeight:600,marginBottom:"0.5rem",color:"var(--text,#1e293b)",fontSize:"0.95rem"}}>Số câu hỏi: {questionCount}</label>
          <input type="range" min={5} max={30} step={5} value={questionCount} onChange={e => setQuestionCount(parseInt(e.target.value))} style={{width:"100%",accentColor:"#2563eb"}} />
        </div>
        <div style={{marginBottom:"1.5rem"}}>
          <label style={{display:"block",fontWeight:600,marginBottom:"0.5rem",color:"var(--text,#1e293b)",fontSize:"0.95rem"}}>Thời gian: {timeLimit} phút</label>
          <input type="range" min={5} max={60} step={5} value={timeLimit} onChange={e => setTimeLimit(parseInt(e.target.value))} style={{width:"100%",accentColor:"#2563eb"}} />
        </div>
        <button onClick={startTest}
          style={{padding:"1rem 3rem",border:"none",borderRadius:12,background:"linear-gradient(135deg,#2563eb,#7c3aed)",color:"#fff",fontFamily:"inherit",fontSize:"1.1rem",fontWeight:600,cursor:"pointer"}}>Bắt đầu thi</button>
      </div>
    </div>
  );
}
