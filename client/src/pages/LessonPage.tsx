import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../api";
import type { Lesson, Question } from "../types";

function renderContent(content: string): (string | { type: string; text: string })[] {
  return content.split("\n").map((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("[SECTION:")) {
      return { type: "section", text: trimmed.replace("[SECTION:", "").replace("]", "").trim() };
    }
    if (trimmed.startsWith("[TIP:")) {
      return { type: "tip", text: trimmed.replace("[TIP:", "").replace("]", "").trim() };
    }
    if (trimmed.startsWith("•") && (trimmed.includes("Ctrl+") || trimmed.includes("F12") || trimmed.includes("F5") || trimmed.includes("F7"))) {
      return { type: "shortcut", text: line };
    }
    if (trimmed.startsWith("📍") || trimmed.startsWith("📌") || trimmed.startsWith("⚠️")) {
      return { type: "subhead", text: line };
    }
    return { type: "normal", text: line };
  });
}

export default function LessonPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    setSubmitted(false);
    setAnswers({});
    setScore(0);
    setLoading(true);
    setError("");
    Promise.all([
      api.get<Lesson>(`/lessons/${id}`),
      api.get<Question[]>(`/questions?lesson_id=${id}`),
    ]).then(([les, qs]) => {
      setLesson(les);
      setQuestions(qs);
      api.get<Lesson[]>(`/categories/${les.category_id}/lessons`).then((l) => setLessons(l)).catch(() => {});
      setLoading(false);
    }).catch(() => {
      setError("Không thể tải bài học");
      setLoading(false);
    });
  }, [id]);

  const currentIndex = useMemo(() => {
    return lessons.findIndex((l) => l.id === Number(id));
  }, [lessons, id]);

  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  const lines = useMemo(() => lesson ? renderContent(lesson.content) : [], [lesson]);

  const selectAnswer = (qId: number, answer: string) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qId]: answer }));
  };

  const submitQuiz = () => {
    let correct = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correct_answer) correct++;
    });
    setScore(correct);
    setSubmitted(true);
  };

  const tryAgain = () => {
    setSubmitted(false);
    setAnswers({});
    setScore(0);
  };

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="page"><p className="empty">{error}</p></div>;
  if (!lesson) return <div className="empty">Không tìm thấy bài học</div>;

  const allAnswered = questions.every((q) => answers[q.id] !== undefined);

  return (
    <div className="page">
      <div className="lesson-nav-top">
        <Link to={`/categories/${lesson.category_id}`} className="back-btn">← Danh sách bài học</Link>
      </div>

      <h1>{lesson.title}</h1>

      <div className="lesson-nav-between">
        {prevLesson ? (
          <button className="nav-lesson-btn" onClick={() => navigate(`/lessons/${prevLesson.id}`)}>
            ← {prevLesson.title}
          </button>
        ) : <div />}
        <span className="lesson-counter">Bài {currentIndex + 1}/{lessons.length}</span>
        {nextLesson ? (
          <button className="nav-lesson-btn" onClick={() => navigate(`/lessons/${nextLesson.id}`)}>
            {nextLesson.title} →
          </button>
        ) : <div />}
      </div>

      <div className="lesson-content-rendered">
        {lines.map((line, i) => {
          if (typeof line === "string") return null;
          if (line.type === "section") {
            return <div key={i} className="lesson-section-header">{line.text}</div>;
          }
          if (line.type === "tip") {
            return <div key={i} className="lesson-tip">💡 {line.text}</div>;
          }
          if (line.type === "subhead") {
            return <div key={i} className="lesson-subhead">{line.text}</div>;
          }
          if (line.type === "shortcut") {
            return <div key={i} className="lesson-shortcut">{line.text}</div>;
          }
          if (!line.text.trim()) {
            return <div key={i} className="lesson-spacer" />;
          }
          return <div key={i} className="lesson-text">{line.text}</div>;
        })}
      </div>

      <div className="lesson-nav-between" style={{ marginTop: "1.5rem" }}>
        {prevLesson ? (
          <button className="nav-lesson-btn" onClick={() => navigate(`/lessons/${prevLesson.id}`)}>
            ← {prevLesson.title}
          </button>
        ) : <div />}
        {nextLesson ? (
          <button className="nav-lesson-btn" onClick={() => navigate(`/lessons/${nextLesson.id}`)}>
            {nextLesson.title} →
          </button>
        ) : <div />}
      </div>

      {questions.length > 0 && (
        <>
          <h2 className="quiz-section-title">📝 Câu hỏi trắc nghiệm</h2>
          <p className="quiz-section-desc">Kiểm tra kiến thức bài học</p>

          {questions.map((q, idx) => {
            let opts: string[] = [];
            try { opts = JSON.parse(q.options); } catch { opts = []; }
            for (let i = opts.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [opts[i], opts[j]] = [opts[j], opts[i]]; }
            return (
              <div key={q.id} className="exercise-card">
                <p className="ex-question">Câu {idx + 1}: {q.question}</p>
                <div className="ex-options">
                  {opts.map((opt) => {
                    let cls = "ex-option";
                    if (submitted) {
                      if (opt === q.correct_answer) cls += " correct";
                      else if (opt === answers[q.id] && opt !== q.correct_answer) cls += " wrong";
                    } else if (answers[q.id] === opt) {
                      cls += " selected";
                    }
                    return (
                      <div key={opt} className={cls} onClick={() => selectAnswer(q.id, opt)}>
                        <input
                          type="radio"
                          name={`q${q.id}`}
                          checked={answers[q.id] === opt}
                          onChange={() => selectAnswer(q.id, opt)}
                          disabled={submitted}
                        />
                        <span>{opt}</span>
                      </div>
                    );
                  })}
                </div>
                {submitted && answers[q.id] !== q.correct_answer && (
                  <div className="ex-result ex-result-exp">
                    ✅ {q.correct_answer} — {q.explanation}
                  </div>
                )}
                {submitted && answers[q.id] === q.correct_answer && (
                  <div className="ex-result ex-result-correct">✅ Đúng!</div>
                )}
              </div>
            );
          })}

          {!submitted ? (
            <button className="submit-btn" onClick={submitQuiz} disabled={!allAnswered}>
              {allAnswered ? "📥 Nộp bài" : `Trả lời hết (${Object.keys(answers).length}/${questions.length})`}
            </button>
          ) : (
            <div className="score-section">
              <p>Kết quả: {score}/{questions.length} — {Math.round((score / questions.length) * 100)}%</p>
              <button className="try-again-btn" onClick={tryAgain}>🔄 Làm lại</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
