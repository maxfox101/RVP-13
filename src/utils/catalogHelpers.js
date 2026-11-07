/**
 * Вспомогательные функции каталога (работа № 11 — unit-тесты).
 */

/**
 * Id для URL карточки товара (/product/:id).
 * Предпочитаем documentId; битый sku с % не используем как основной путь.
 * @param {{ documentId?: string, sku?: string }} row
 * @returns {string}
 */
export function productRouteId(row) {
  const doc = (row && row.documentId) || "";
  const sku = String((row && row.sku) || "");
  if (doc) return doc;
  if (sku && !sku.includes("%") && /^[a-z0-9][a-z0-9\-_]*$/i.test(sku)) {
    return sku;
  }
  return sku || "unknown";
}

/**
 * Фильтр списка изделий по параметрам каталога (как на клиенте).
 * @param {Array<{ title?: string, type?: string, standard?: string, materials?: string[] }>} items
 * @param {{ q?: string, type?: string, standard?: string, material?: string }} params
 * @returns {Array}
 */
export function filterProducts(items, params = {}) {
  const q = (params.q || "").toLowerCase().replace(/ё/g, "е").trim();
  const type = params.type || "";
  const standard = params.standard || "";
  const material = params.material || "";

  return (items || []).filter((item) => {
    if (q) {
      const hay = String(item.title || "")
        .toLowerCase()
        .replace(/ё/g, "е");
      if (!hay.includes(q)) return false;
    }
    if (type && item.type !== type) return false;
    if (standard && item.standard !== standard) return false;
    if (material && !(item.materials || []).includes(material)) return false;
    return true;
  });
}
