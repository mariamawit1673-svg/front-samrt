import { useState } from "react";
import { useLang } from "../LanguageContext";

// ── LOGIN PAGE ───────────────────────────────────────────────
function LoginPage({ authForm, onAuthFormChange, onSubmit, onNavigate }) {
  const { t } = useLang();
  const [showPw, setShowPw] = useState(false);

  return (
    <div className="auth-wrapper">
      {/* Left branding */}
      <div className="auth-left">
        <div className="auth-brand">
          <span className="auth-brand-icon">🌾</span>
          <div>
            <strong>Smart Agriculture</strong>
            <small>Advisory System</small>
          </div>
        </div>
        <h2 className="auth-left-title">Welcome Back!</h2>
        <p className="auth-left-desc">
          Login to access your farm profile, crop recommendations, pest advisory, and history.
        </p>
        <div className="auth-features">
          <div className="auth-feature-item">🌱 <span>AI crop recommendations</span></div>
          <div className="auth-feature-item">🌦 <span>Live weather farming advice</span></div>
          <div className="auth-feature-item">🐛 <span>Pest detection & treatment</span></div>
          <div className="auth-feature-item">📊 <span>History & profile tracking</span></div>
        </div>
      </div>

      {/* Right form */}
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-header">
            <h3>🔑 {t("login")}</h3>
            <p>{t("noAccount")} <button type="button" className="auth-switch-btn" onClick={() => onNavigate("register")}>{t("register")}</button></p>
          </div>

          <form onSubmit={onSubmit} className="auth-form">
            <div className="auth-field">
              <label>{t("email")}</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">✉️</span>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={authForm.email}
                  onChange={(e) => onAuthFormChange({ ...authForm, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label>{t("password")}</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">🔒</span>
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  value={authForm.password}
                  onChange={(e) => onAuthFormChange({ ...authForm, password: e.target.value })}
                  required
                />
                <button type="button" className="auth-eye-btn" onClick={() => setShowPw(!showPw)} tabIndex={-1}>
                  {showPw ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-submit-btn">
              🔑 {t("loginBtn")}
            </button>
          </form>

          <p className="auth-back">
            <button type="button" className="auth-switch-btn" onClick={() => onNavigate("home")}>← Back to Home</button>
          </p>
        </div>
      </div>
    </div>
  );
}

// ── REGISTER PAGE ────────────────────────────────────────────
function RegisterPage({ authForm, onAuthFormChange, onSubmit, onNavigate }) {
  const { t } = useLang();
  const [showPw, setShowPw] = useState(false);

  return (
    <div className="auth-wrapper">
      {/* Left branding */}
      <div className="auth-left auth-left-register">
        <div className="auth-brand">
          <span className="auth-brand-icon">🌾</span>
          <div>
            <strong>Smart Agriculture</strong>
            <small>Advisory System</small>
          </div>
        </div>
        <h2 className="auth-left-title">Join Us Today!</h2>
        <p className="auth-left-desc">
          Create your account and start getting smart crop recommendations tailored to your farm.
        </p>
        <div className="auth-features">
          <div className="auth-feature-item">✅ <span>Free to use</span></div>
          <div className="auth-feature-item">🌍 <span>Works for any location</span></div>
          <div className="auth-feature-item">📱 <span>Easy to use interface</span></div>
          <div className="auth-feature-item">🔒 <span>Your data is secure</span></div>
        </div>
      </div>

      {/* Right form */}
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-header">
            <h3>🚀 {t("register")}</h3>
            <p>{t("hasAccount")} <button type="button" className="auth-switch-btn" onClick={() => onNavigate("login")}>{t("login")}</button></p>
          </div>

          <form onSubmit={onSubmit} className="auth-form">
            <div className="auth-field">
              <label>{t("name")}</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">👤</span>
                <input
                  type="text"
                  placeholder="e.g. Mariamawit Bogale"
                  value={authForm.name}
                  onChange={(e) => onAuthFormChange({ ...authForm, name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label>{t("role")}</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">🎭</span>
                <select
                  value={authForm.role}
                  onChange={(e) => onAuthFormChange({ ...authForm, role: e.target.value })}
                >
                  <option value="farmer">🌾 {t("farmer")}</option>
                  <option value="admin">⚙️ Admin</option>
                </select>
              </div>
            </div>

            <div className="auth-field">
              <label>{t("email")}</label>
              <div className="auth-input-wrap">
                <span className="auth-