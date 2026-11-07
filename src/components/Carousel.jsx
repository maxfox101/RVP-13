import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchCategories } from "../api.js";

const DELAY = 4000;

export default function Carousel() {
  const [categories, setCategories] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (!categories.length) return undefined;
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % categories.length);
    }, DELAY);
    return () => clearInterval(timer);
  }, [index, categories.length]);

  function go(next) {
    if (!categories.length) return;
    setIndex((next + categories.length) % categories.length);
  }

  if (!categories.length) {
    return (
      <div className="category-carousel is-loading" aria-busy="true">
        <p className="search-status">Загрузка категорий…</p>
      </div>
    );
  }

  return (
    <div
      className="category-carousel"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") go(index - 1);
        if (event.key === "ArrowRight") go(index + 1);
      }}
    >
      <button type="button" className="carousel-btn carousel-prev" aria-label="Предыдущая категория" onClick={() => go(index - 1)}>
        ‹
      </button>
      <div className="carousel-viewport">
        <div className="carousel-track" style={{ transform: `translateX(-${index * 100}%)` }}>
          {categories.map((item, slideIndex) => (
            <Link className="carousel-slide" to={item.path} key={item.id}>
              <h3>{item.title}</h3>
              <img
                src={item.img}
                alt=""
                width="800"
                height="600"
                loading={slideIndex === index ? "eager" : "lazy"}
                decoding="async"
                fetchpriority={slideIndex === index ? "high" : undefined}
              />
            </Link>
          ))}
        </div>
      </div>
      <button type="button" className="carousel-btn carousel-next" aria-label="Следующая категория" onClick={() => go(index + 1)}>
        ›
      </button>
      <div className="carousel-dots" aria-label="Категории">
        {categories.map((item, i) => (
          <button
            key={item.id}
            type="button"
            className={i === index ? "carousel-dot is-active" : "carousel-dot"}
            aria-label={item.title}
            aria-current={i === index ? "true" : undefined}
            onClick={() => go(i)}
          />
        ))}
      </div>
    </div>
  );
}
