import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchServices } from "../api.js";
import usePageTitle from "../hooks/usePageTitle.js";

export default function Services() {
  usePageTitle(
    "Услуги — БазМет",
    "Услуги завода БазМет: изготовление крепежа по ГОСТ, ОСТ и чертежам заказчика. Оставьте заявку на расчёт партии."
  );
  const [services, setServices] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchServices()
      .then(setServices)
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p className="search-status">Ошибка API: {error}</p>;
  if (!services.length) return <p className="search-status">Загрузка…</p>;

  return (
    <>
      <h1>Услуги</h1>
      <div className="grid">
        {services.map((item) => (
          <article className="card service-card" key={item.title}>
            <h2>{item.title}</h2>
            <p>{item.text}</p>
            <Link className="btn" to={`/order?service=${encodeURIComponent(item.title)}`}>
              Оставить заявку
            </Link>
          </article>
        ))}
      </div>
    </>
  );
}
