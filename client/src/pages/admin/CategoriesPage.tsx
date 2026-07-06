import { useEffect, useState } from "react";
import { api } from "../../api";
import type { AdminCategory } from "../../types";

export default function CategoriesPage() {
  const [cats, setCats] = useState<AdminCategory[]>([]);
  const [form, setForm] = useState({ name: "", description: "", cert: "MOS", icon: "📁", order_index: 0 });
  const [editing, setEditing] = useState<number | null>(null);

  const fetch = () => api.get<AdminCategory[]>("/admin/categories").then(setCats).catch(() => {});
  useEffect(() => { fetch(); }, []);

  const save = async () => {
    if (editing) {
      await api.put(`/admin/categories/${editing}`, form);
    } else {
      await api.post("/admin/categories", form);
    }
    setForm({ name: "", description: "", cert: "MOS", icon: "📁", order_index: 0 });
    setEditing(null);
    fetch();
  };

  const edit = (c: any) => {
    setForm(c);
    setEditing(c.id);
  };

  const remove = async (id: number) => {
    if (!confirm("Xóa danh mục này?")) return;
    await api.delete(`/admin/categories/${id}`);
    fetch();
  };

  return (
    <div>
      <h1>Quản lý danh mục</h1>

      <div className="admin-form">
        <input placeholder="Tên" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Mô tả" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <select value={form.cert} onChange={(e) => setForm({ ...form, cert: e.target.value })}>
          <option value="MOS">MOS</option>
          <option value="IC3">IC3</option>
        </select>
        <input placeholder="Icon" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="admin-input-sm" />
        <input type="number" placeholder="Thứ tự" value={form.order_index} onChange={(e) => setForm({ ...form, order_index: parseInt(e.target.value) || 0 })} className="admin-input-sm" />
        <button className="admin-btn" onClick={save}>{editing ? "Cập nhật" : "Thêm"}</button>
      </div>

      <table className="admin-table">
        <thead>
          <tr><th>ID</th><th>Tên</th><th>Chứng chỉ</th><th>Hành động</th></tr>
        </thead>
        <tbody>
          {cats.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.icon} {c.name}</td>
              <td>{c.cert}</td>
              <td>
                <button className="admin-edit-btn" onClick={() => edit(c)}>Sửa</button>
                <button className="admin-delete-btn" onClick={() => remove(c.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
