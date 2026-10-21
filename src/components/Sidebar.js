import { useLang } from "../LanguageContext";

function Sidebar({ activePage, user, onNavigate, onLogout }) {
  const { t, lang, setLang } = useLang();
  const role = user?.role || "guest";

  // Pages per role
  const farmerPages = [
    { id: "dashboard", label: t("dashboard") },
    { id: "recommend", label: t("recommendation") },
    { id: "pest", label: t("pestAdvisory") },
    { id: "market", label: "🛒 " + t("marketplace") },
    { id: "profile", label: t("profile") },
    { id: "history", label: t("history") },
    { id: "crops", label: t("crops") },
    { id: "about", label: t("about") },
  ];

  const buyerPages = [
    { id: "market", label: "🛒 " + t("marketplace") },
    { id: "about", label: t("about") },
  ];

  const adminPages = [
    { id: "dashboard", label: t("dashboard") },
    { id: "market", label: "🛒 " + t("marketplace") },
    { id: "admin", label: "⚙️ " + t("admin") },
    { id: "crops", label: t("crops") },
    { id: "about", label: t("about") },
  ];

  const guestPages = [
    { id: "market", label: "🛒 " + t("marketplace") },
    { id: "about", label: t("about") },
  ];

  const pages = role === "farmer" ? farmerPages
    : role === "buyer" ? buyerPages
    : role === "admin" ? adminPages
    : guestPages;

  const roleLabel = role === "farmer" ? "🌾 Farmer"
    : role === "buyer" ? "🛒 Buyer"
    : role === "admin" ? "🛠 Admin"
    : "";

  return (
    <aside className="static-sidebar">
      <div className="brand-block" onClick={() => onNavigate("home")} style={{ cursor: "pointer" }} title="Go to Home">
        <span>SA</span>
        <div>
          <strong>Smart Agriculture</strong>
          <small>Advisory System</small>
        </div>
      </div>

      {/* Language switcher */}
      <div className="sidebar-lang">
        <button className={lang === "en" ? "lang-btn active" : "lang-btn"} onClick={() => setLang("en")}>EN</button>
        <button className={lang === "am" ? "lang-btn active" : "lang-btn"} onClick={() => setLang("am")}>አማ</button>
        <button className={lang === "om" ? "lang-btn active" : "lang-btn"} onClick={() => setLang("om")}>OM</button>
      </div>

      {/* User info */}
      {user && (
        <div className="sidebar-user">
          <span className="sidebar-user-name">{user.name}</span>
          <span className="sidebar-user-role">{roleLabel}</span>
        </div>
      )}

      <nav className="side-nav">
        <button className={activePage === "home" ? "active" : ""} onClick={() => onNavigate("home")}>🏠 Home</button>

        {pages.map(page => (
          <button key={page.id} className={activePage === page.id ? "active" : ""} onClick={() => onNavigate(page.id)}>
            {page.label}
          </button>
        ))}

        {user ? (
          <button className="sidebar-logout" onClick={onLogout}>{t("logout")}</button>
        ) : (
          <>
            <button className={activePage === "login" ? "active" : ""} onClick={() => onNavigate("login")}>{t("login")}</button>
            <button className={activePage === "register" ? "active" : ""} onClick={() => onNavigate("register")}>{t("register")}</button>
          </>
        )}
      </nav>
    </aside>
  );
}

export default Sidebar;
