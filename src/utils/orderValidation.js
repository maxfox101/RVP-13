/**
 * Проверки формы заявки БазМет (работа № 11 — unit-тесты).
 * Вынесено из Order.jsx, чтобы можно было тестировать без React.
 */

/** Оставляет только цифры из строки телефона. */
export function digits(value) {
  return (value || "").replace(/\D/g, "");
}

/**
 * Маска телефона РФ: +7 (___) ___ - __ - __
 * @param {string} value
 * @returns {string}
 */
export function formatPhone(value) {
  let d = digits(value);
  if (!d) return "";
  if (d.charAt(0) === "8") d = "7" + d.slice(1);
  if (d.charAt(0) !== "7") d = "7" + d;
  d = d.slice(0, 11);
  let out = "+7";
  if (d.length > 1) out += " (" + d.slice(1, 4);
  if (d.length >= 4) out += ") " + d.slice(4, 7);
  if (d.length >= 7) out += " - " + d.slice(7, 9);
  if (d.length >= 9) out += " - " + d.slice(9, 11);
  return out;
}

/**
 * Сообщение об ошибке для поля формы (пустая строка = поле ок).
 * @param {"name"|"phone"|"email"} field
 * @param {string} value
 * @returns {string}
 */
export function errorFor(field, value) {
  const text = (value || "").trim();
  if (field === "name") {
    if (!text) return "Заполните имя.";
    if (!/^[а-яёa-z\s-]{2,}$/i.test(text)) return "Введите имя (не меньше 2 букв).";
    return "";
  }
  if (field === "phone") {
    if (!text || digits(text).length <= 1) return "Заполните телефон.";
    if (digits(text).length !== 11) return "Введите номер полностью: +7 (___) ___ - __ - __";
    return "";
  }
  if (field === "email") {
    if (!text) return "Заполните e-mail.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(text)) {
      return "Введите корректный e-mail, например example@mail.ru";
    }
    return "";
  }
  return "";
}
