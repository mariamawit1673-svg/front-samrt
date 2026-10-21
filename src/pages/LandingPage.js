import { useLang } from "../LanguageContext";

function LandingPage({ onEnterApp }) {
  const { lang, t, setLang } = useLang();

  return (
    <main className="landing-page">
      <section className="landing-hero">
        <nav className="landing-nav">
          <strong>{t("appName")}</strong>
          <div className="landing-nav-actions">
            <div className="lang-switcher">
              <button className={lang === "en" ? "lang-btn active" : "lang-btn"} onClick={() => setLang("en")}>EN</button>
              <button className={lang === "am" ? "lang-btn active" : "lang-btn"} onClick={() => setLang("am")}>አማ</button>
              <button className={lang === "om" ? "lang-btn active" : "lang-btn"} onClick={() => setLang("om")}>OM</button>
            </div>
            <button onClick={() => onEnterApp("login")}>{t("login")}</button>
            <button onClick={() => onEnterApp("register")}>{t("register")}</button>
          </div>
        </nav>

        <div className="hero-content">
          <p className="eyebrow">{t("eyebrow")}</p>
          <h1>{t("heroTitle")}</h1>
          <p className="hero-copy">{t("heroCopy")}</p>
          <div className="hero-metrics">
            <div><strong>8+</strong><span>{t("cropRecords")}</span></div>
            <div><strong>5</strong><span>{t("decisionFactors")}</span></div>
          </div>
          <div className="hero-actions">
            <button onClick={() => onEnterApp("login")}>{t("getStarted")}</button>
          </div>
        </div>
      </section>

      <section className="landing-overview" id="overview">
        <div>
          <span>01</span>
          <h2>{t("farmerProfiles")}</h2>
          <p>{t("farmerProfilesDesc")}</p>
          <button onClick={() => onEnterApp("login")}>{t("openDashboard")}</button>
        </div>
        <div>
          <span>02</span>
          <h2>{t("cropRec")}</h2>
          <p>{t("cropRecDesc")}</p>
          <button onClick={() => onEnterApp("login")}>{t("openRec")}</button>
        </div>
        <div>
          <span>03</span>
          <h2>{t("adminKB")}</h2>
          <p>{t("adminKBDesc")}</p>
          <button onClick={() => onEnterApp("login")}>{t("openPest")}</button>
        </div>
      </section>

      <section className="landing-impact">
        <h2>{t("whyTitle")}</h2>
        <p>{t("whyDesc")}</p>
      </section>

      <section className="landing-roles">
        <h2>{t("whoTitle")}</h2>
        <ul>
          <li>✅ {t("role1")}</li>
          <li>✅ {t("role2")}</li>
          <li>✅ {t("role3")}</li>
        </ul>
      </section>

      <section className="landing-features">
        <h2>{t("featuresTitle")}</h2>
        <ul>
          <li>✔ {t("f1")}</li>
          <li>✔ {t("f2")}</li>
          <li>✔ {t("f3")}</li>
          <li>✔ {t("f4")}</li>
        </ul>
      </section>

      <footer className="landing-footer">
        <p>{t("footer")}</p>
        <p>{t("dev")}</p>
      </footer>
    </main>
  );
}

export default LandingPage;
