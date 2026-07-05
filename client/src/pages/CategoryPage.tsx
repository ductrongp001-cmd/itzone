import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api";
import type { Category, Lesson } from "../types";

const certColors: Record<string, string> = {
  MOS: "#2563eb",
  IC3: "#7c3aed",
};

export default function CategoryPage() {
  const { id } = useParams<{ id: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      api.get<Category>(`/categories/${id}`),
      api.get<Lesson[]>(`/categories/${id}/lessons`),
    ]).then(([cat, less]) => {
      setCategory(cat);
      setLessons(less);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="loading">Đang tải...</div>;
  if (!category) return <div className="empty">Không tìm thấy chứng chỉ</div>;

  return (
    <div className="page">
      <Link to="/categories" className="back-btn">← Danh sách chứng chỉ</Link>
      <h1>{category.icon} {category.name}</h1>
      <p style={{ color: "#64748b", marginBottom: "1.5rem" }}>{category.description}</p>
      <div className="lessons-list">
        {lessons.map((lesson) => (
          <Link
            key={lesson.id}
            to={`/lessons/${lesson.id}`}
            className="lesson-card"
            style={{ borderLeft: `4px solid ${certColors[category.cert] || "#4f46e5"}`, display: "block" }}
          >
            <div className="lesson-header">
              <h3>{lesson.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
