import { useState, useEffect, useCallback } from "react";
import { api } from "../api";

interface FlashcardQuestion {
  id: number;
  lesson_id: number;
  category_id: number;
  question: string;
  options: string;
  correct_answer: string;
  explanation: string;
  difficulty: string;
  category_name: string;
  lesson_title: string;
}

interface Category {
  id: number;
  name: string;
  icon: string;
}

export default function Flashcard() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCatId, setSelectedCatId] = useState<number | null>(null);
  const [cards, setCards] = useState<FlashcardQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Set<number>>(new Set());
  const [phase, setPhase] = useState<"select" | "study" | "done">("select");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Category[]>("/categories").then((data) => {
      setCategories(data);
      setLoading(false);
    });
  }, []);

  const startStudy = useCallback(async () => {
    const params = selectedCatId ? `?category_id=${selectedCatId}&limit=30` : "?limit=30";
    const data = await api.get<FlashcardQuestion[]>("/flashcards" + params);
    for (let i = data.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [data[i], data[j]] = [data[j], data[i]];
    }
    setCards(data);
    setIndex(0);
    setFlipped(false);
    setKnown(new Set());
    setPhase("study");
  }, [selectedCatId]);

  const nextCard = (gotIt: boolean) => {
    if (gotIt) setKnown((prev) => new Set(prev).add(cards[index].id));
    if (index < cards.length - 1) {
      setIndex((i) => i + 1);
      setFlipped(false);
    } else {
      setPhase("done");
    }
  };

  const restart = () => {
    setPhase("select");
    setCards([]);
    setIndex(0);
    setFlipped(false);
    setKnown(new Set());
  };

  if (loading) {
    return <div className="page"><h1>Flashcard</h1><p>Đang tải...</p></div>;
  }

  if (phase === "done") {
    return (
      <div className="page flashcard-page">
        <h1>Flashcard</h1>
        <div className="flashcard-done">
          <h2>Hoàn thành!</h2>
          <p>Đã ôn {cards.length} câu hỏi</p>
          <p>Đã nhớ: <strong>{known.size}</strong> câu</p>
          <p>Cần ôn lại: <strong>{cards.length - known.size}</strong> câu</p>
          <div className="flashcard-progress-bar">
            <div className="flashcard-progress-fill" style={{ width: `${(known.size / cards.length) * 100}%` }} />
          </div>
          <button className="flashcard-btn start" onClick={restart}>Học tiếp</button>
        </div>
      </div>
    );
  }

  if (phase === "study") {
    const card = cards[index];
    let parsedOptions: string[] = [];
    try { parsedOptions = JSON.parse(card.options || "[]"); } catch {}
    return (
      <div className="page flashcard-page">
        <div className="flashcard-header">
          <h1>Flashcard</h1>
          <span className="flashcard-counter">{index + 1} / {cards.length}</span>
        </div>
        <div className="flashcard-progress-bar">
          <div className="flashcard-progress-fill" style={{ width: `${((index + 1) / cards.length) * 100}%` }} />
        </div>
        <div className="flashcard-tags">
          <span className="flashcard-tag">{card.category_name}</span>
          <span className="flashcard-tag">{card.lesson_title}</span>
        </div>
        <div className={`flashcard-card ${flipped ? "flipped" : ""}`} onClick={() => setFlipped(!flipped)}>
          <div className="flashcard-inner">
            <div className="flashcard-front">
              <div className="flashcard-label">Câu hỏi</div>
              <div className="flashcard-question">{card.question}</div>
              {parsedOptions.length > 0 && (
                <div className="flashcard-options">
                  {parsedOptions.map((opt, i) => (
                    <div key={i} className="flashcard-option">{opt}</div>
                  ))}
                </div>
              )}
              <div className="flashcard-hint">Nhấn để xem đáp án</div>
            </div>
            <div className="flashcard-back">
              <div className="flashcard-label">Đáp án</div>
              <div className="flashcard-answer">{card.correct_answer}</div>
              {card.explanation && <div className="flashcard-explanation">{card.explanation}</div>}
              <div className="flashcard-hint">Nhấn để quay lại</div>
            </div>
          </div>
        </div>
        <div className="flashcard-actions">
          <button className="flashcard-btn no" onClick={() => nextCard(false)}>Chưa thuộc</button>
          <button className="flashcard-btn yes" onClick={() => nextCard(true)}>Đã thuộc</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page flashcard-page">
      <h1>Flashcard</h1>
      <p className="flashcard-desc">Chọn chứng chỉ để ôn tập (bỏ trống để học tất cả)</p>
      <div className="flashcard-topics">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`flashcard-topic-btn ${selectedCatId === cat.id ? "selected" : ""}`}
            onClick={() => setSelectedCatId(selectedCatId === cat.id ? null : cat.id)}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>
      <button className="flashcard-btn start" onClick={startStudy} disabled={categories.length === 0}>
        Bắt đầu ôn tập
      </button>
    </div>
  );
}
