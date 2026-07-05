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
