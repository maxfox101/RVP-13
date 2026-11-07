import { describe, expect, it } from "vitest";
import { filterProducts, productRouteId } from "./catalogHelpers.js";

const SAMPLE = [
  {
    id: "1",
    title: "Гайка ГОСТ 5915-70",
    type: "nut",
    standard: "gost",
    materials: ["steel"]
  },
  {
    id: "2",
    title: "Болт ОСТ 1 31115-80",
    type: "bolt",
    standard: "ost",
    materials: ["30hgsa"]
  },
  {
    id: "3",
    title: "Винт нормаль 3157А",
    type: "screw",
    standard: "normal",
    materials: ["steel"]
  }
];

describe("productRouteId — ссылка на карточку (требование R2)", () => {
  // TC-08 (R2). Если у товара есть documentId, в ссылку карточки идёт именно он, а не sku.
  it("TC-08 (R2): берёт documentId, если он есть", () => {
    expect(productRouteId({ documentId: "abc123", sku: "nut-gost-5915" })).toBe("abc123");
  });

  // TC-17 (R2). Когда documentId нет, для адреса берётся латинский артикул.
  it("TC-17 (R2): берёт латинский sku, если documentId нет", () => {
    expect(productRouteId({ sku: "nut-gost-5915" })).toBe("nut-gost-5915");
  });

  // TC-18 (R2). Битый sku с символами % не должен вытеснять нормальный documentId из URL.
  it("TC-18 (R2): не предпочитает битый sku с % как единственный id при наличии documentId", () => {
    expect(
      productRouteId({ documentId: "doc1", sku: "%d0%b3%d0%b0%d0%b9%d0%ba%d0%b0" })
    ).toBe("doc1");
  });
});

describe("filterProducts — поиск и фильтры (требования R1, R6)", () => {
  // TC-19 (R1). Без параметров поиска и фильтров возвращаются все три изделия каталога.
  it("TC-19 (R1): без параметров возвращает все изделия", () => {
    expect(filterProducts(SAMPLE, {})).toHaveLength(3);
  });

  // TC-07 (R6). Фильтр type=nut оставляет только гайку.
  it("TC-07 (R6): фильтр по типу nut", () => {
    const list = filterProducts(SAMPLE, { type: "nut" });
    expect(list).toHaveLength(1);
    expect(list[0].title).toMatch(/Гайка/);
  });

  // TC-20 (R6). Фильтр standard=ost оставляет только изделие по ОСТ.
  it("TC-20 (R6): фильтр по стандарту ost", () => {
    expect(filterProducts(SAMPLE, { standard: "ost" })).toHaveLength(1);
  });

  // TC-06 (R1). Поиск по подстроке «гайка» находит одну запись в названии.
  it("TC-06 (R1): поиск по подстроке в названии", () => {
    const list = filterProducts(SAMPLE, { q: "гайка" });
    expect(list).toHaveLength(1);
  });

  // TC-21 (R6). Тип и материал применяются вместе: винт из стали остаётся,
  // винт из латуни в этой выборке не находится.
  it("TC-21 (R6): сочетание фильтров сужает выдачу", () => {
    expect(filterProducts(SAMPLE, { type: "screw", material: "steel" })).toHaveLength(1);
    expect(filterProducts(SAMPLE, { type: "screw", material: "brass" })).toHaveLength(0);
  });
});
