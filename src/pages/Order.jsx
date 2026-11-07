import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { createOrder } from "../api.js";
import usePageTitle from "../hooks/usePageTitle.js";
import { errorFor, formatPhone } from "../utils/orderValidation.js";

export default function Order() {
  usePageTitle(
    "Оставить заявку — БазМет",
    "Заявка на изготовление метизов ООО «БазМет». Укажите имя, телефон и e-mail — менеджер свяжется с вами."
  );
  const [params] = useSearchParams();
  const preset = params.get("service") || params.get("product") || "";
  const [form, setForm] = useState({
    service: preset,
    name: "",
    phone: "",
    email: "",
    description: ""
  });
  const [errors, setErrors] = useState({ name: "", phone: "", email: "" });
  const [successName, setSuccessName] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [sending, setSending] = useState(false);

  const invalid = useMemo(
    () => ({
      name: Boolean(errors.name),
      phone: Boolean(errors.phone),
      email: Boolean(errors.email)
    }),
    [errors]
  );

  function change(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  }

  function check(field) {
    const message = errorFor(field, form[field]);
    setErrors((current) => ({ ...current, [field]: message }));
    return !message;
  }

  async function onSubmit(event) {
    event.preventDefault();
    const nameOk = check("name");
    const phoneOk = check("phone");
    const emailOk = check("email");
    if (!nameOk || !phoneOk || !emailOk) return;

    setSending(true);
    setSubmitError("");
    try {
      await createOrder({
        service: form.service,
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        description: form.description.trim()
      });
      setSuccessName(form.name.trim());
    } catch (err) {
      setSubmitError(err.message || "Не удалось отправить заявку на сервер.");
    } finally {
      setSending(false);
    }
  }

  if (successName) {
    return (
      <>
        <h1>Оставить заявку</h1>
        <div className="order-success">
          <h2>Заявка принята</h2>
          <p>
            Спасибо, {successName}! Мы свяжемся с вами по указанному телефону и e-mail.
          </p>
          <p>
            <Link to="/catalog" className="btn">
              Вернуться в каталог
            </Link>
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <h1>Оставить заявку</h1>
      <form onSubmit={onSubmit} noValidate>
        <label htmlFor="service">Услуга / изделие</label>
        <input
          type="text"
          id="service"
          name="service"
          placeholder="Например: Лазерная гравировка"
          value={form.service}
          onChange={(event) => change("service", event.target.value)}
        />

        <label htmlFor="name">Ваше имя *</label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Введите имя"
          autoComplete="name"
          className={invalid.name ? "is-invalid" : undefined}
          aria-invalid={invalid.name || undefined}
          aria-describedby="name-error"
          value={form.name}
          onChange={(event) => change("name", event.target.value)}
          onBlur={() => check("name")}
        />
        <p id="name-error" className="field-error" role={errors.name ? "alert" : undefined}>
          {errors.name}
        </p>

        <label htmlFor="phone">Номер телефона *</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          placeholder="+7 (___) ___ - __ - __"
          autoComplete="tel"
          className={invalid.phone ? "is-invalid" : undefined}
          aria-invalid={invalid.phone || undefined}
          aria-describedby="phone-error"
          value={form.phone}
          onChange={(event) => change("phone", formatPhone(event.target.value))}
          onBlur={() => check("phone")}
        />
        <p id="phone-error" className="field-error" role={errors.phone ? "alert" : undefined}>
          {errors.phone}
        </p>

        <label htmlFor="email">E-mail *</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="example@mail.ru"
          autoComplete="email"
          className={invalid.email ? "is-invalid" : undefined}
          aria-invalid={invalid.email || undefined}
          aria-describedby="email-error"
          value={form.email}
          onChange={(event) => change("email", event.target.value)}
          onBlur={() => check("email")}
        />
        <p id="email-error" className="field-error" role={errors.email ? "alert" : undefined}>
          {errors.email}
        </p>

        <label htmlFor="description">Описание / Спецификация заявки</label>
        <textarea
          id="description"
          name="description"
          rows="5"
          placeholder="Укажите количество, размеры и дополнительные требования"
          value={form.description}
          onChange={(event) => change("description", event.target.value)}
        />

        {submitError ? (
          <p className="field-error" role="alert">
            {submitError}
          </p>
        ) : null}
        <button type="submit" className="submit-order" disabled={sending}>
          {sending ? "Отправка…" : "Отправить заявку"}
        </button>
      </form>
    </>
  );
}
