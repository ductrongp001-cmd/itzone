import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import type { Category } from "../types";

const certColors: Record<string, string> = {
  MOS: "#2563eb",
  IC3: "#7c3aed",
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get<Category[]>("/categories").then((data) => {
      setCategories(data);
      setLoading(false);
    }).catch(() => {
      setError("Không thể tải danh sách chứng chỉ");
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="page"><p className="empty">{error}</p></div>;

  return (
    <div className="page">
      <h1>Chứng chỉ</h1>
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
            <span
              className="level-badge"
              style={{
                background: certColors[cat.cert] || "#4f46e5",
                marginTop: "0.5rem",
                display: "inline-block",
              }}
            >
              {cat.cert}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
