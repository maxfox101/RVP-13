import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import { fetchCategories, fetchProducts } from "../api.js";
import usePageTitle, { clipMeta } from "../hooks/usePageTitle.js";

const SLUG_TO_TYPE = {
  nuts: "nut",
  bolts: "bolt",
  screws: "screw",
  rivets: "rivet",
  washers: "washer"
};

export default function Category() {
  const { slug } = useParams();
  const type = SLUG_TO_TYPE[slug];
  const [category, setCategory] = useState(null);
  const [list, setList] = useState([]);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  usePageTitle(
    category ? `${category.title} — Каталог — БазМет` : "Каталог — БазМет",
    category
      ? clipMeta(
          category.description,
          `${category.title}: раздел каталога метизов ООО «БазМет» по ГОСТ и ОСТ.`
        )
      : "Раздел каталога метизов ООО «БазМет»."
  );

  useEffect(() => {
    if (!type) {
      setReady(true);
      return undefined;
    }
    let cancelled = false;
    Promise.all([fetchCategories(), fetchProducts({ type })])
      .then(([categories, data]) => {
        if (cancelled) return;
        setCategory(categories.find((item) => item.id === type) || null);
        setList(data.items || []);
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
  }, [type]);

  if (ready && !type) return <Navigate to="/catalog" replace />;
  if (error) return <p className="search-status">Ошибка API: {error}</p>;
  if (!category) return <p className="search-status">Загрузка…</p>;

  return (
    <>
      <h1>{category.title}</h1>
      <div className="grid">
        {list.map((item) => (
          <ProductCard key={item.id} item={item} heading="h2" showSpecs />
        ))}
      </div>
    </>
  );
}
