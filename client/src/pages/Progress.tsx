import { useState, useEffect } from "react";
import { api } from "../api";

interface CategoryStat {
  id: number; name: string; icon: string; cert: string;
  tests_taken: number; total_correct: number; total_questions: number;
}

interface TestResult {
  id: number; user_id: number; category_id: number | null;
  score: number; total: number; time_taken: number;
  created_at: string; category_name: string | null;
}

export default function Progress() {
  const [stats, setStats] = useState<CategoryStat[]>([]);
  const [history, setHistory] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      api.get<CategoryStat[]>("/progress/category-stats").catch(() => []),
      api.get<TestResult[]>("/progress/test-history").catch(() => []),
    ]).then(([s, h]) => {
      setStats(s); setHistory(h); setLoading(false);
    }).catch(() => { setError("Vui lòng đăng nhập để xem tiến độ"); setLoading(false); });
  }, []);

  const overall = stats.reduce((a, s) => ({ tests: a.tests + s.tests_taken, correct: a.correct + s.total_correct, total: a.total + s.total_questions }), { tests: 0, correct: 0, total: 0 });

  if (error) return <div className="page"><h1>Tiến độ</h1><p>{error}</p></div>;
  if (loading) return <div className="page"><h1>Tiến độ</h1><p>Đang tải...</p></div>;

  return (
    <div className="page progress-page">
      <h1>Tiến độ học tập</h1>

      <div className="progress-overview">
        <div className="progress-stat"><span className="progress-num">{overall.tests}</span> Bài thi</div>
        <div className="progress-stat"><span className="progress-num">{overall.correct}/{overall.total}</span> Câu đúng</div>
        <div className="progress-stat"><span className="progress-num">{overall.total > 0 ? Math.round((overall.correct / overall.total) * 100) : 0}%</span> Tỉ lệ đúng</div>
      </div>

      <h2>Tiến độ theo chứng chỉ</h2>
      <div className="progress-cats">
        {stats.map((s) => {
          const pct = s.total_questions > 0 ? Math.round((s.total_correct / s.total_questions) * 100) : 0;
          return (
            <div key={s.id} className="progress-cat-card">
              <div className="progress-cat-header">{s.icon} {s.name}</div>
              <div className="progress-bar"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
              <div className="progress-cat-info">{s.tests_taken} bài thi &middot; {pct}% đúng</div>
            </div>
          );
        })}
      </div>

      {history.length > 0 && (
        <>
          <h2>Lịch sử thi thử</h2>
          <div className="progress-history">
            {history.map((h) => (
              <div key={h.id} className="progress-history-item">
                <div className="progress-h-left">
                  <strong>{h.category_name || "Tất cả"}</strong>
                  <span className="progress-h-date">{new Date(h.created_at).toLocaleDateString("vi-VN")}</span>
                </div>
                <div className="progress-h-right">
                  <span className="progress-h-score">{h.score}/{h.total}</span>
                  <span className="progress-h-pct">{Math.round((h.score / h.total) * 100)}%</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
