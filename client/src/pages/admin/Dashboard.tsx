import { useEffect, useState } from "react";
import { api } from "../../api";

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/admin/stats").then(setStats).catch(() => setError("Không thể tải thống kê"));
  }, []);

  const cards = stats ? [
    { label: "Danh mục", value: stats.categories, color: "#3b82f6" },
    { label: "Bài học", value: stats.lessons, color: "#10b981" },
    { label: "Câu hỏi", value: stats.questions, color: "#f59e0b" },
    { label: "Người dùng", value: stats.users, color: "#8b5cf6" },
  ] : [];

  return (
    <div>
      <h1>Dashboard</h1>
      {error ? (
        <p className="empty">{error}</p>
      ) : stats ? (
        <div className="admin-cards">
          {cards.map((card) => (
            <div key={card.label} className="admin-card" style={{ borderTopColor: card.color }}>
              <div className="admin-card-value">{card.value}</div>
              <div className="admin-card-label">{card.label}</div>
            </div>
          ))}
        </div>
      ) : (
        <p>Đang tải...</p>
      )}
    </div>
  );
}
