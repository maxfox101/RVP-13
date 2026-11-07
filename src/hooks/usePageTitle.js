import { useEffect } from "react";

function upsertDescription(content) {
  let tag = document.querySelector('meta[name="description"]');
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", "description");
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

/** Обрезает описание до длины, которую обычно показывает поисковая выдача. */
export function clipMeta(text, fallback) {
  const clean = String(text || "").replace(/\s+/g, " ").trim();
  const source = clean.length >= 50 ? clean : fallback;
  if (source.length <= 180) return source;
  return `${source.slice(0, 177).trim()}…`;
}

export default function usePageTitle(title, description) {
  useEffect(() => {
    document.title = title;
    if (description) upsertDescription(description);
  }, [title, description]);
}
