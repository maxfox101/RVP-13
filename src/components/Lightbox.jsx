import { useEffect, useState } from "react";

export default function Lightbox({ children }) {
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    if (!photo) return undefined;
    function onKey(event) {
      if (event.key === "Escape") setPhoto(null);
    }
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [photo]);

  function onClick(event) {
    const img = event.target.closest("main img");
    if (!img || img.closest(".category-carousel")) return;
    event.preventDefault();
    setPhoto({ src: img.src, alt: img.alt });
  }

  return (
    <>
      <div onClick={onClick}>{children}</div>
      <div
        className={photo ? "lightbox is-open" : "lightbox"}
        onClick={(event) => {
          if (event.target === event.currentTarget) setPhoto(null);
        }}
      >
        <button type="button" className="lightbox-close" aria-label="Закрыть" onClick={() => setPhoto(null)}>
          &times;
        </button>
        {photo ? <img src={photo.src} alt={photo.alt} /> : null}
      </div>
    </>
  );
}
