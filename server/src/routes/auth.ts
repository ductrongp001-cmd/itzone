import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getDb, saveDb } from "../database";

const JWT_SECRET = process.env.JWT_SECRET || "itzone_secret_key_change_in_prod";
const router = Router();

function parseRows(result: any) {
  if (!result || !result.columns) return [];
  return result.values.map((row: any[]) => {
    const obj: any = {};
    result.columns.forEach((col: string, i: number) => { obj[col] = row[i]; });
    return obj;
  });
}

router.post("/register", async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Vui lòng điền đầy đủ thông tin" });
  }
  const db = await getDb();
  try {
    const hashed = await bcrypt.hash(password, 10);
    db.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashed]);
    saveDb();
    res.json({ success: true, message: "Đăng ký thành công" });
  } catch {
    res.status(400).json({ error: "Email đã tồn tại" });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const db = await getDb();
  const result = db.exec("SELECT * FROM users WHERE email = ?", [email]);
  if (!result.length || !result[0].values.length) {
    return res.status(401).json({ error: "Sai email hoặc mật khẩu" });
  }
  const rows = parseRows(result[0]);
  const user = rows[0];
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ error: "Sai email hoặc mật khẩu" });
  }
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
  res.json({
    success: true,
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role }
  });
});

router.get("/users", async (_req, res) => {
  const db = await getDb();
  const result = db.exec("SELECT id, name, email, role, created_at FROM users ORDER BY id");
  res.json(parseRows(result[0] || { columns: [], values: [] }));
});

export default router;
