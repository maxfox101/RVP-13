/**
 * Id товара для URL React (/product/:id).
 * documentId надёжнее sku; percent-encoded sku (%d0%…) ломают ссылки.
 *
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
