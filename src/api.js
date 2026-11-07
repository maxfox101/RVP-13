/**
 * Каталог, услуги и заявки — Express + PostgreSQL (работы № 7–8).
 * В Docker и локально один и тот же /api (Vite proxy или Nginx).
 * Strapi (работа № 9) для продакшен-сборки не используется.
 */
import { productRouteId } from "./utils/catalogHelpers.js";

const API_BASE = "";

function asWebpPath(value) {
  if (!value || typeof value !== "string") return value;
  if (/^https?:/i.test(value)) return value;
  return value.replace(/\.jpe?g(\?.*)?$/i, ".webp$1");
}

function mapProduct(row) {
  if (!row) return null;
  const id = productRouteId({ sku: row.id, documentId: row.documentId });
  return {
    ...row,
    id,
    img: asWebpPath(row.img),
    detailImg: asWebpPath(row.detailImg || row.img),
    materials: row.materials || [],
    coatings: row.coatings || [],
    specs: row.specs || [],
    fields: row.fields || []
  };
}

function mapCategory(row) {
  return {
    ...row,
    img: asWebpPath(row.img)
  };
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      (data && (data.error?.message || data.error)) || `Ошибка API: ${response.status}`;
    throw new Error(typeof message === "string" ? message : `Ошибка API: ${response.status}`);
  }

  return data;
}

export async function fetchCategories() {
  const rows = await request("/api/categories");
  return (rows || []).map(mapCategory);
}

export async function fetchServices() {
  return request("/api/services");
}

export async function fetchFilters() {
  return request("/api/filters");
}

export async function fetchProducts(params = {}) {
  const query = new URLSearchParams();
  for (const key of ["q", "type", "standard", "material", "coating"]) {
    if (params[key]) query.set(key, params[key]);
  }
  const suffix = query.toString() ? `?${query}` : "";
  const json = await request(`/api/products${suffix}`);
  const items = (json.items || []).map(mapProduct);
  return { count: items.length, items };
}

export async function fetchProduct(id) {
  const row = await request(`/api/products/${encodeURIComponent(id)}`);
  return mapProduct(row);
}

export function createOrder(payload) {
  return request("/api/orders", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function productPath(item) {
  return "/product/" + item.id;
}
