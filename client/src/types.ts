export interface Category {
  id: number;
  name: string;
  description: string;
  cert: string;
  icon: string;
  order_index: number;
}

export interface Lesson {
  id: number;
  category_id: number;
  title: string;
  content: string;
  order_index: number;
}

export interface Question {
  id: number;
  lesson_id: number;
  category_id: number;
  question: string;
  options: string;
  correct_answer: string;
  explanation: string;
  difficulty: string;
}

export interface AdminCategory extends Category {
  id: number;
}

export interface AdminLesson extends Lesson {
  id: number;
  category_name?: string;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export interface AdminStats {
  categories: number;
  lessons: number;
  questions: number;
  users: number;
}
