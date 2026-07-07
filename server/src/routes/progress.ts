import { Router, Request, Response } from "express";
import { getDb } from "../database";
import { authenticate } from "../middleware";

const router = Router();
router.use(authenticate);

function parseRows(result: any) {
  if (!result || !result.columns) return [];
  return result.values.map((row: any[]) => {
    const obj: any = {};
    result.columns.forEach((col: string, i: number) => { obj[col] = row[i]; });
    return obj;
  });
}

router.post("/test-result", async (req: Request, res: Response) => {
  const db = await getDb();
  const { category_id, score, total, time_taken } = req.body;
  const user = (req as any).user;
  db.run("INSERT INTO test_results (user_id, category_id, score, total, time_taken) VALUES (?, ?, ?, ?, ?)",
    [user.id, category_id || null, score, total, time_taken || null]);
  res.json({ ok: true });
});

router.get("/test-history", async (req: Request, res: Response) => {
  const db = await getDb();
  const user = (req as any).user;
  const r = db.exec(`SELECT tr.*, c.name as category_name FROM test_results tr LEFT JOIN categories c ON tr.category_id = c.id WHERE tr.user_id = ? ORDER BY tr.created_at DESC LIMIT 50`, [user.id]);
  res.json(parseRows(r[0]));
});

router.get("/category-stats", async (req: Request, res: Response) => {
  const db = await getDb();
  const user = (req as any).user;
  const r = db.exec(`SELECT c.id, c.name, c.icon, c.cert,
    COUNT(tr.id) as tests_taken,
    COALESCE(SUM(tr.score), 0) as total_correct,
    COALESCE(SUM(tr.total), 0) as total_questions
    FROM categories c LEFT JOIN test_results tr ON tr.category_id = c.id AND tr.user_id = ?
    GROUP BY c.id ORDER BY c.order_index`, [user.id]);
  res.json(parseRows(r[0]));
});

router.post("/lesson", async (req: Request, res: Response) => {
  const db = await getDb();
  const user = (req as any).user;
  const { lesson_id, score } = req.body;
  const existing = db.exec("SELECT id FROM lesson_progress WHERE user_id = ? AND lesson_id = ?", [user.id, lesson_id]);
  if (existing.length && existing[0].values.length) {
    db.run("UPDATE lesson_progress SET completed = 1, score = ? WHERE user_id = ? AND lesson_id = ?", [score || null, user.id, lesson_id]);
  } else {
    db.run("INSERT INTO lesson_progress (user_id, lesson_id, completed, score) VALUES (?, ?, 1, ?)", [user.id, lesson_id, score || null]);
  }
  res.json({ ok: true });
});

router.get("/lessons", async (req: Request, res: Response) => {
  const db = await getDb();
  const user = (req as any).user;
  const r = db.exec(`SELECT lp.*, l.title, l.category_id, c.name as category_name FROM lesson_progress lp JOIN lessons l ON lp.lesson_id = l.id JOIN categories c ON l.category_id = c.id WHERE lp.user_id = ? ORDER BY l.order_index`, [user.id]);
  res.json(parseRows(r[0]));
});

export default router;
