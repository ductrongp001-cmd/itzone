import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./pages/admin/AdminLayout";
import Home from "./pages/Home";
import CategoriesPage from "./pages/CategoriesPage";
import CategoryPage from "./pages/CategoryPage";
import LessonPage from "./pages/LessonPage";
import AuthPage from "./pages/AuthPage";
import Flashcard from "./pages/Flashcard";
import MockTest from "./pages/MockTest";
import Dashboard from "./pages/admin/Dashboard";
import UsersPage from "./pages/admin/UsersPage";
import AdminCategoriesPage from "./pages/admin/CategoriesPage";
import LessonsPage from "./pages/admin/LessonsPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/categories/:id" element={<CategoryPage />} />
            <Route path="/lessons/:id" element={<LessonPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/flashcard" element={<Flashcard />} />
            <Route path="/mock-test" element={<MockTest />} />
            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="categories" element={<AdminCategoriesPage />} />
              <Route path="lessons" element={<LessonsPage />} />
            </Route>
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}
