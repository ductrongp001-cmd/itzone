import { Router, Response } from "express";
import { getDb, saveDb } from "../database";
import { adminOnly } from "../middleware";

const router = Router();

function parseRows(result: { columns: string[]; values: any[][] }) {
  if (!result || !result.columns) return [];
  return result.values.map((row: any[]) => {
    const obj: any = {};
    result.columns.forEach((col: string, i: number) => { obj[col] = row[i]; });
    return obj;
  });
}

router.use(adminOnly);

router.get("/stats", async (_req, res) => {
  const db = await getDb();
  const categories = parseRows(db.exec("SELECT COUNT(*) as count FROM categories")[0])[0]?.count || 0;
  const lessons = parseRows(db.exec("SELECT COUNT(*) as count FROM lessons")[0])[0]?.count || 0;
  const questions = parseRows(db.exec("SELECT COUNT(*) as count FROM questions")[0])[0]?.count || 0;
  const users = parseRows(db.exec("SELECT COUNT(*) as count FROM users")[0])[0]?.count || 0;
  res.json({ categories, lessons, questions, users });
});

router.get("/users", async (_req, res) => {
  const db = await getDb();
  const result = db.exec("SELECT id, name, email, role, created_at FROM users ORDER BY id");
  res.json(parseRows(result[0] || { columns: [], values: [] }));
});

router.delete("/users/:id", async (req, res) => {
  const db = await getDb();
  db.run("DELETE FROM users WHERE id = ?", [parseInt(req.params.id)]);
  saveDb();
  res.json({ success: true });
});

router.get("/categories", async (_req, res) => {
  const db = await getDb();
  const result = db.exec("SELECT * FROM categories ORDER BY order_index");
  res.json(parseRows(result[0] || { columns: [], values: [] }));
});

router.post("/categories", async (req, res) => {
  const { name, description, cert, icon, order_index } = req.body;
  const db = await getDb();
  db.run("INSERT INTO categories (name, description, cert, icon, order_index) VALUES (?, ?, ?, ?, ?)",
    [name, description || "", cert || "MOS", icon || "📁", order_index || 0]);
  saveDb();
  res.json({ success: true });
});

router.put("/categories/:id", async (req, res) => {
  const { name, description, cert, icon, order_index } = req.body;
  const db = await getDb();
  db.run("UPDATE categories SET name=?, description=?, cert=?, icon=?, order_index=? WHERE id=?",
    [name, description, cert, icon, order_index, parseInt(req.params.id)]);
  saveDb();
  res.json({ success: true });
});

router.delete("/categories/:id", async (req, res) => {
  const db = await getDb();
  db.run("DELETE FROM categories WHERE id = ?", [parseInt(req.params.id)]);
  db.run("DELETE FROM lessons WHERE category_id = ?", [parseInt(req.params.id)]);
  db.run("DELETE FROM questions WHERE category_id = ?", [parseInt(req.params.id)]);
  saveDb();
  res.json({ success: true });
});

router.get("/lessons", async (_req, res) => {
  const db = await getDb();
  const result = db.exec(`SELECT l.*, c.name as category_name FROM lessons l JOIN categories c ON l.category_id = c.id ORDER BY l.category_id, l.order_index`);
  res.json(parseRows(result[0] || { columns: [], values: [] }));
});

router.post("/lessons", async (req, res) => {
  const { category_id, title, content, order_index } = req.body;
  const db = await getDb();
  db.run("INSERT INTO lessons (category_id, title, content, order_index) VALUES (?, ?, ?, ?)",
    [category_id, title, content, order_index || 0]);
  saveDb();
  res.json({ success: true });
});

router.put("/lessons/:id", async (req, res) => {
  const { category_id, title, content, order_index } = req.body;
  const db = await getDb();
  db.run("UPDATE lessons SET category_id=?, title=?, content=?, order_index=? WHERE id=?",
    [category_id, title, content, order_index, parseInt(req.params.id)]);
  saveDb();
  res.json({ success: true });
});

router.delete("/lessons/:id", async (req, res) => {
  const db = await getDb();
  db.run("DELETE FROM lessons WHERE id = ?", [parseInt(req.params.id)]);
  db.run("DELETE FROM questions WHERE lesson_id = ?", [parseInt(req.params.id)]);
  saveDb();
  res.json({ success: true });
});

export default router;
