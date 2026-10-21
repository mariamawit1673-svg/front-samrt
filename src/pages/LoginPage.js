import { useState } from "react";
import { useLang } from "../LanguageContext";

function LoginPage({ authForm, onAuthFormChange, onSubmit, onNavigate }) {
  const { t } = useLang();
  const [showPw, setShowPw] = useState(false);
  const [usePhone, setUsePhone] = useState(true); // phone is default

  return (
    <div className="auth-wrapper">
      <div className="auth-left">
        <div className="auth-brand">
          <span className="auth-brand-icon">🌾</span>
          <div><strong>Smart Agriculture</strong><small>Advisory System</small></div>
        </div>
        <h2 className="auth-left-title">Welcome Back!</h2>
        <p className="auth-left-desc">Login with your phone number or email to access your dashboard.</p>
        <div className="auth-features">
          <div className="auth-feature-item">🌱 <span>AI crop recommendations</span></div>
          <div className="auth-feature-item">🌦 <span>Live weather advice</span></div>
          <div className="auth-feature-item">🐛 <span>Pest detection</span></div>
          <div className="auth-feature-item">🛒 <span>Marketplace</span></div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-header">
            <h3>🔑 {t("login")}</h3>
            <p>{t("noAccount")} <button type="button" className="auth-switch-btn" onClick={() => onNavigate("register")}>{t("register")}</button></p>
          </div>

          <div className="auth-toggle">
            <button type="button" className={usePhone ? "auth-toggle-btn active" : "auth-toggle-btn"} onClick={() => { setUsePhone(true); onAuthFormChange({ ...authForm, email: "" }); }}>📱 Phone</button>
            <button type="button" className={!usePhone ? "auth-toggle-btn active" : "auth-toggle-btn"} onClick={() => { setUsePhone(false); onAuthFormChange({ ...authForm, phone: "" }); }}>✉️ Email</button>
          </div>

          <form onSubmit={onSubmit} className="auth-form">
            {usePhone ? (
              <div className="auth-field">
                <label>Phone Number *</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">📱</span>
                  <input type="tel" placeholder="+251 9XX XXX XXXX" value={authForm.phone || ""} onChange={e => onAuthFormChange({ ...authForm, phone: e.target.value, email: "" })} required />
                </div>
              </div>
            ) : (
              <div className="auth-field">
                <label>{t("email")} *</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">✉️</span>
                  <input type="email" placeholder="you@example.com" value={authForm.email} onChange={e => onAuthFormChange({ ...authForm, email: e.target.value, phone: "" })} required />
                </div>
              </div>
            )}

            <div className="auth-field">
              <label>{t("password")} *</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">🔒</span>
                <input type={showPw ? "text" : "password"} placeholder="••••••••" value={authForm.password} onChange={e => onAuthFormChange({ ...authForm, password: e.target.value })} required />
                <button type="button" className="auth-eye-btn" onClick={() => setShowPw(!showPw)} tabIndex={-1}>{showPw ? "🙈" : "👁"}</button>
              </div>
            </div>

            <button type="submit" className="auth-submit-btn">🔑 {t("loginBtn")}</button>
          </form>

          <p className="auth-back"><button type="button" className="auth-switch-btn" onClick={() => onNavigate("home")}>← Back to Home</button></p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
