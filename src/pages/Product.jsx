import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { fetchProduct } from "../api.js";
import usePageTitle, { clipMeta } from "../hooks/usePageTitle.js";

export default function Product() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  usePageTitle(
    item ? `${item.title} — Каталог — БазМет` : "Каталог — БазМет",
    item
      ? clipMeta(
          item.description,
          `${item.title}. Изделие каталога ООО «БазМет»: характеристики и заявка на изготовление.`
        )
      : "Карточка изделия в каталоге метизов ООО «БазМет»."
  );

  useEffect(() => {
    let cancelled = false;
    fetchProduct(id)
      .then((data) => {
        if (!cancelled) setItem(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (!ready) return <p className="search-status product-loading">Загрузка…</p>;
  if (error || !item) return <Navigate to="/catalog" replace />;

  return (
    <article className="product-card">
      <div className="product-info">
        <h1>{item.title}</h1>
        <p>{item.description}</p>
        <form onSubmit={(event) => event.preventDefault()}>
          {(item.fields || []).map((field) => (
            <div key={field.id}>
              <label className="visually-hidden" htmlFor={field.id}>
                {field.label}
              </label>
              <select id={field.id} name={field.id} defaultValue="">
                <option value="">Выберите {field.label.toLowerCase()}</option>
                {field.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </form>
      </div>
      <div className="product-photo">
        <img
          src={item.detailImg || item.img}
          alt={item.title}
          width="800"
          height="800"
          fetchpriority="high"
          decoding="async"
        />
        <div className="product-actions">
          <Link className="btn" to={`/order?product=${encodeURIComponent(item.title)}`}>
            Оставить заявку
          </Link>
        </div>
      </div>
    </article>
  );
}
