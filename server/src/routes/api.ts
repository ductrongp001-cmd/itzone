import { Router } from "express";
import { getDb } from "../database";

const router = Router();

function parseRows(result: any) {
  if (!result || !result.columns) return [];
  return result.values.map((row: any[]) => {
    const obj: any = {};
    result.columns.forEach((col: string, i: number) => { obj[col] = row[i]; });
    return obj;
  });
}

router.get("/categories", async (_req, res) => {
  const db = await getDb();
  const r = db.exec("SELECT * FROM categories ORDER BY order_index");
  res.json(parseRows(r[0]));
});

router.get("/categories/:id", async (req, res) => {
  const db = await getDb();
  const r = db.exec("SELECT * FROM categories WHERE id = ?", [req.params.id]);
  if (!r.length || !r[0].values.length) return res.status(404).json({ error: "Not found" });
  res.json(parseRows(r[0])[0]);
});

router.get("/categories/:id/lessons", async (req, res) => {
  const db = await getDb();
  const r = db.exec("SELECT * FROM lessons WHERE category_id = ? ORDER BY order_index", [req.params.id]);
  res.json(parseRows(r[0]));
});

router.get("/lessons/:id", async (req, res) => {
  const db = await getDb();
  const r = db.exec("SELECT * FROM lessons WHERE id = ?", [req.params.id]);
  if (!r.length || !r[0].values.length) return res.status(404).json({ error: "Not found" });
  res.json(parseRows(r[0])[0]);
});

router.get("/questions", async (req, res) => {
  const db = await getDb();
  const { category_id, lesson_id, difficulty } = req.query;
  let sql = "SELECT * FROM questions WHERE 1=1";
  const params: any[] = [];
  if (category_id) { sql += " AND category_id = ?"; params.push(category_id); }
  if (lesson_id) { sql += " AND lesson_id = ?"; params.push(lesson_id); }
  if (difficulty) { sql += " AND difficulty = ?"; params.push(difficulty); }
  sql += " ORDER BY id";
  const r = db.exec(sql, params);
  res.json(parseRows(r[0]));
});

router.get("/flashcards", async (req, res) => {
  const db = await getDb();
  const { category_id, limit } = req.query;
  let sql = "SELECT q.*, c.name as category_name, l.title as lesson_title FROM questions q LEFT JOIN categories c ON q.category_id = c.id LEFT JOIN lessons l ON q.lesson_id = l.id WHERE 1=1";
  const params: any[] = [];
  if (category_id) { sql += " AND q.category_id = ?"; params.push(category_id); }
  sql += " ORDER BY RANDOM()";
  const lim = parseInt(limit as string) || 20;
  sql += " LIMIT ?";
  params.push(lim);
  const r = db.exec(sql, params);
  res.json(parseRows(r[0]));
});

router.post("/questions/check", async (req, res) => {
  const db = await getDb();
  const { question_id, answer } = req.body;
  const r = db.exec("SELECT correct_answer FROM questions WHERE id = ?", [question_id]);
  if (!r.length || !r[0].values.length) return res.status(404).json({ error: "Not found" });
  res.json({ correct: r[0].values[0][0] === answer });
});

export default router;
