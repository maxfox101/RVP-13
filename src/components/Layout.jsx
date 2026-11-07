import { Suspense } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import Lightbox from "./Lightbox.jsx";

const LINKS = [
  { to: "/", label: "Главная", end: true },
  { to: "/catalog", label: "Каталог" },
  { to: "/services", label: "Услуги" },
  { to: "/about", label: "О компании" },
  { to: "/contacts", label: "Контакты" }
];

export default function Layout() {
  const location = useLocation();

  return (
    <>
      <header>
        <nav>
          <ul>
            {LINKS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) => {
                    const catalogOpen =
                      item.to === "/catalog" &&
                      (location.pathname.startsWith("/catalog") ||
                        location.pathname.startsWith("/product"));
                    return isActive || catalogOpen ? "active" : undefined;
                  }}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <Lightbox>
        <main>
          <Suspense fallback={<p className="search-status">Загрузка страницы…</p>}>
            <Outlet />
          </Suspense>
        </main>
      </Lightbox>
      <footer>
        <p>&copy; 2026 ООО «БазМет»</p>
      </footer>
    </>
  );
}
