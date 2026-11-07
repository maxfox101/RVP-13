import usePageTitle from "../hooks/usePageTitle.js";

export default function Home() {
  usePageTitle(
    "БазМет — производитель метизов",
    "ООО «БазМет» производит авиационный крепёж по ГОСТ и ОСТ: гайки, болты, винты, заклёпки и шайбы. Каталог изделий и заявка на изготовление."
  );
  return (
    <article className="hero">
      <img
        src="/images/hero-metal.webp"
        alt="Крупный план металлических деталей"
        width="1024"
        height="271"
        fetchpriority="high"
        decoding="async"
      />
      <h1>ООО «БазМет» — надёжный производитель с многолетней историей.</h1>
      <p>Качество. Точность. Стабильность</p>
    </article>
  );
}
