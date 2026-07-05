import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import type { Category } from "../types";

const certColors: Record<string, string> = {
  MOS: "#2563eb",
  IC3: "#7c3aed",
};

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Category[]>("/categories").then((data) => {
      setCategories(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="loading">Đang tải...</div>;

  return (
    <div>
      <section className="hero-section">
        <h1>ITZone — Luyện thi chứng chỉ IT</h1>
        <p className="hero-sub">
          MOS (Word, Excel, PowerPoint) & IC3 — Học lý thuyết, làm bài tập, thi thử
        </p>
        <Link to="/categories" className="cta-button">Bắt đầu ôn luyện</Link>
      </section>

      <section className="features-section">
        <h2>Chứng chỉ</h2>
        <div className="features-grid">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/categories/${cat.id}`}
              className="feature-card"
              style={{ borderTopColor: certColors[cat.cert] || "#4f46e5" }}
            >
              <div className="feature-icon">{cat.icon}</div>
              <h3>{cat.name}</h3>
              <p>{cat.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="levels-section">
        <h2>Lộ trình ôn thi</h2>
        <div className="levels-list">
          <div className="level-item" style={{ borderLeftColor: "#2563eb" }}>
            <h3>📝 MOS — Microsoft Office Specialist</h3>
            <p>Word, Excel, PowerPoint — Chứng chỉ tin học văn phòng của Microsoft</p>
          </div>
          <div className="level-item" style={{ borderLeftColor: "#7c3aed" }}>
            <h3>🌐 IC3 — Internet and Computing Core Certification</h3>
            <p>Computing Fundamentals, Key Applications, Living Online — Chứng chỉ tin học căn bản</p>
          </div>
        </div>
      </section>
    </div>
  );
}
