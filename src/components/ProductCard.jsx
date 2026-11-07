import { Link } from "react-router-dom";
import { productPath } from "../api.js";

export default function ProductCard({ item, heading = "h3", showSpecs = false, eager = false, priority = false }) {
  const TitleTag = heading;
  return (
    <article className="card">
      <TitleTag>
        <Link to={productPath(item)}>{item.title}</Link>
      </TitleTag>
      <img
        src={item.img}
        alt={item.title}
        width="800"
        height="600"
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        fetchpriority={priority ? "high" : undefined}
      />
      {showSpecs
        ? (item.specs || []).map((line) => <p key={line}>{line}</p>)
        : null}
    </article>
  );
}
