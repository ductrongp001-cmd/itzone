import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/", label: "Trang chủ" },
  { to: "/categories", label: "Chứng chỉ" },
  { to: "/flashcard", label: "Flashcard" },
];

export default function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem("itzone_dark") === "true";
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem("itzone_dark", String(next));
    document.documentElement.classList.toggle("dark", next);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">ITZone</Link>
      <div className="nav-links">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={location.pathname === link.to ? "nav-link active" : "nav-link"}
          >
            {link.label}
          </Link>
        ))}
        {user?.role === "admin" && (
          <Link
            to="/admin"
            className={location.pathname.startsWith("/admin") ? "nav-link active" : "nav-link"}
          >
            Admin
          </Link>
        )}
        <button className="nav-btn" onClick={toggleDark} title="Dark mode">
          {dark ? "☀️" : "🌙"}
        </button>
        {user ? (
          <div className="nav-user">
            <Link to="/auth" className="nav-link">{user.name}</Link>
            <button className="nav-btn" onClick={logout}>Thoát</button>
          </div>
        ) : (
          <Link to="/auth" className="nav-link auth-link">Đăng nhập</Link>
        )}
      </div>
    </nav>
  );
}
