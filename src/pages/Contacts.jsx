import usePageTitle from "../hooks/usePageTitle.js";

export default function Contacts() {
  usePageTitle(
    "Контакты — БазМет",
    "Контакты ООО «БазМет»: телефон +7 (900) 900-90-90, почта info@bazmet.ru и адрес завода в Ростовской области."
  );
  return (
    <>
      <h1>Контакты</h1>
      <section className="contacts-card" aria-label="Контактные данные">
        <ul className="contacts-list">
          <li>
            <span className="contact-icon" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </span>
            <div className="contact-text">
              <h2>Телефон</h2>
              <p><a href="tel:+79009009090">+7 (900) 900 - 90 - 90</a></p>
            </div>
          </li>
          <li>
            <span className="contact-icon" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="5.5" width="18" height="13" rx="2.2" />
                <path d="M4 7.2 12 13l8-5.8" />
              </svg>
            </span>
            <div className="contact-text">
              <h2>E-mail</h2>
              <p><a href="mailto:info@bazmet.ru">info@bazmet.ru</a></p>
            </div>
          </li>
          <li>
            <span className="contact-icon" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21s-7-5.6-7-11a7 7 0 1 1 14 0c0 5.4-7 11-7 11z" />
                <circle cx="12" cy="10" r="2.4" />
              </svg>
            </span>
            <div className="contact-text">
              <h2>Адрес</h2>
              <p>Ростовская область, ул. Пушкино, дом Клатушкина 67.</p>
            </div>
          </li>
          <li>
            <span className="contact-icon" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 11.5c0 4.1-3.6 7.5-8 7.5-1.1 0-2.1-.2-3.1-.5L4 20l1.3-3.4C4.5 15.4 4 13.5 4 11.5 4 7.4 7.6 4 12 4s8 3.4 8 7.5z" />
              </svg>
            </span>
            <div className="contact-text">
              <h2>MAX</h2>
              <p>@BazMet</p>
            </div>
          </li>
        </ul>
      </section>
    </>
  );
}
