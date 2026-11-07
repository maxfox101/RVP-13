import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Carousel from "../components/Carousel.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { fetchFilters, fetchProducts } from "../api.js";
import usePageTitle from "../hooks/usePageTitle.js";

export default function Catalog() {
  usePageTitle(
    "Каталог — БазМет",
    "Каталог метизов БазМет с поиском и фильтрами по типу, стандарту и материалу. Гайки, болты, винты, заклёпки и шайбы."
  );
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "";
  const type = params.get("type") || "";
  const standard = params.get("standard") || "";
  const material = params.get("material") || "";
  const coating = params.get("coating") || "";

  const [list, setList] = useState([]);
  const [filters, setFilters] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFilters()
      .then(setFilters)
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchProducts({ q, type, standard, material, coating })
      .then((data) => {
        if (!cancelled) {
          setList(data.items || []);
          setError("");
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [q, type, standard, material, coating]);

  function set(name, value) {
    const next = new URLSearchParams(params);
    if (value) next.set(name, value);
    else next.delete(name);
    setParams(next);
  }

  function onSearch(event) {
    event.preventDefault();
    set("q", new FormData(event.target).get("q"));
  }

  function reset() {
    setParams({});
  }

  const hasFilters = Boolean(q || type || standard || material || coating);
  let status = `Все изделия: ${list.length}. Можно сузить список фильтрами.`;
  if (loading) status = "Загрузка с сервера…";
  else if (error) status = `Ошибка API: ${error}`;
  else if (!list.length) status = "По выбранным условиям ничего не найдено.";
  else if (hasFilters) status = `Найдено: ${list.length}`;

  return (
    <>
      <h1>Каталог продукции</h1>
      <form role="search" onSubmit={onSearch}>
        <label htmlFor="q">Поиск по каталогу</label>
        <input
          type="search"
          id="q"
          name="q"
          list="nomenclature"
          placeholder="Например: ОСТ 1 33055-80"
          autoComplete="off"
          value={q}
          onChange={(event) => set("q", event.target.value)}
        />
        <datalist id="nomenclature">
          {list.map((item) => (
            <option key={item.id} value={item.title} />
          ))}
        </datalist>
        <button type="submit">Найти</button>
      </form>

      <section>
        <h2>Категории</h2>
        <Carousel />
      </section>

      <div className="catalog-layout">
        <section className="filters" aria-label="Фильтры каталога">
          <h2>Подбор по параметрам</h2>
          <div className="filter-bar">
            {filters ? (
              <>
                <Select id="filter-type" label="Метиз" value={type} onChange={(v) => set("type", v)} options={filters.type} />
                <Select id="filter-standard" label="Стандарт" value={standard} onChange={(v) => set("standard", v)} options={filters.standard} />
                <Select id="filter-material" label="Материал" value={material} onChange={(v) => set("material", v)} options={filters.material} />
                <Select id="filter-coating" label="Покрытие" value={coating} onChange={(v) => set("coating", v)} options={filters.coating} />
              </>
            ) : (
              <p>Загрузка фильтров…</p>
            )}
            <button type="button" onClick={reset}>Сбросить</button>
          </div>
        </section>
        <div className="catalog-content">
          <section>
            <h2>Изделия</h2>
            <p className="search-status">{status}</p>
            <div className="grid">
              {list.map((item, index) => (
                <ProductCard key={item.id} item={item} eager={index < 3} priority={index === 0} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

function Select({ id, label, value, onChange, options }) {
  return (
    <label htmlFor={id}>
      {label}
      <select id={id} value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option.value || "all"} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
