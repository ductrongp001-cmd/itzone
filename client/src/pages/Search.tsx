import { useState } from "react";
import { api } from "../api";
import { Link } from "react-router-dom";

interface SearchLesson {
  id: number; title: string; category_id: number; preview: string;
}

interface SearchQuestion {
  id: number; question: string; difficulty: string;
  category_name: string; lesson_title: string;
}

export default function Search() {
  const [query, setQuery] = useState("");
  const [lessons, setLessons] = useState<SearchLesson[]>([]);
  const [questions, setQuestions] = useState<SearchQuestion[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const doSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const data = await api.get<{ lessons: SearchLesson[]; questions: SearchQuestion[] }>(`/search?q=${encodeURIComponent(query)}`);
      setLessons(data.lessons);
      setQuestions(data.questions);
    } catch {}
    setSearched(true);
    setLoading(false);
  };

  return (
    <div className="page search-page">
      <h1>Tìm kiếm</h1>
      <div className="search-box">
        <input className="search-input" placeholder="Tìm bài học, câu hỏi..." value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && doSearch()} />
        <button className="search-btn" onClick={doSearch} disabled={loading}>{loading ? "..." : "Tìm"}</button>
      </div>
      {searched && !loading && (
        <div className="search-results">
          {lessons.length === 0 && questions.length === 0 && <p className="search-none">Không tìm thấy kết quả</p>}
          {lessons.length > 0 && (
            <section>
              <h2>Bài học ({lessons.length})</h2>
              {lessons.map((l) => (
                <Link key={l.id} to={`/lessons/${l.id}`} className="search-item">
                  <div className="search-item-title">{l.title}</div>
                  <div className="search-item-preview">{l.preview}</div>
                </Link>
              ))}
            </section>
          )}
          {questions.length > 0 && (
            <section>
              <h2>Câu hỏi ({questions.length})</h2>
              {questions.map((q) => (
                <div key={q.id} className="search-item">
                  <div className="search-item-title">{q.question}</div>
                  <div className="search-item-meta">{q.category_name} &middot; {q.lesson_title}</div>
                </div>
              ))}
            </section>
          )}
        </div>
      )}
    </div>
  );
}
