import { useEffect, useState } from "react";
import { api } from "../../api";

export default function LessonsPage() {
  const [lessons, setLessons] = useState<any[]>([]);
  const [cats, setCats] = useState<any[]>([]);
  const [form, setForm] = useState({ category_id: 1, title: "", content: "", order_index: 0 });
  const [editing, setEditing] = useState<number | null>(null);

  const fetch = async () => {
    api.get<any[]>("/admin/lessons").then(setLessons).catch(() => {});
    api.get<any[]>("/admin/categories").then(setCats).catch(() => {});
  };
  useEffect(() => { fetch(); }, []);

  const save = async () => {
    if (editing) {
      await api.put(`/admin/lessons/${editing}`, form);
    } else {
      await api.post("/admin/lessons", form);
    }
    setForm({ category_id: cats[0]?.id || 1, title: "", content: "", order_index: 0 });
    setEditing(null);
    fetch();
  };

  const edit = (l: any) => {
    setForm({ category_id: l.category_id, title: l.title, content: l.content, order_index: l.order_index });
    setEditing(l.id);
  };

  const remove = async (id: number) => {
    if (!confirm("Xóa bài học này?")) return;
    await api.delete(`/admin/lessons/${id}`);
    fetch();
  };

  return (
    <div>
      <h1>Quản lý bài học</h1>

      <div className="admin-form">
        <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: parseInt(e.target.value) })}>
          {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input placeholder="Tiêu đề" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <textarea placeholder="Nội dung (markdown)" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={6} />
        <input type="number" placeholder="Thứ tự" value={form.order_index} onChange={(e) => setForm({ ...form, order_index: parseInt(e.target.value) || 0 })} className="admin-input-sm" />
        <button className="admin-btn" onClick={save}>{editing ? "Cập nhật" : "Thêm"}</button>
      </div>

      <table className="admin-table">
        <thead>
          <tr><th>ID</th><th>Danh mục</th><th>Tiêu đề</th><th>Hành động</th></tr>
        </thead>
        <tbody>
          {lessons.map((l) => (
            <tr key={l.id}>
              <td>{l.id}</td>
              <td>{l.category_name}</td>
              <td>{l.title}</td>
              <td>
                <button className="admin-edit-btn" onClick={() => edit(l)}>Sửa</button>
                <button className="admin-delete-btn" onClick={() => remove(l.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
