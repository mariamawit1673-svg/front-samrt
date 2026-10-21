import { useState } from "react";
import { useLang } from "../LanguageContext";

const ROLES = [
  { value: "farmer", icon: "🌾", label: "Farmer", desc: "Advisory + sell products" },
  { value: "buyer", icon: "🛒", label: "Buyer", desc: "Browse & buy products" },
];

function RegisterPage({ authForm, onAuthFormChange, onSubmit, onNavigate }) {
  const { t } = useLang();
  const [showPw, setShowPw] = useState(false);

  return (
    <div className="auth-wrapper">
      <div className="auth-left auth-left-register">
        <div className="auth-brand">
          <span className="auth-brand-icon">🌾</span>
          <div><strong>Smart Agriculture</strong><small>Advisory System</small></div>
        </div>
        <h2 className="auth-left-title">Join Us Today!</h2>
        <p className="auth-left-desc">Create your account using your phone number. Email is optional.</p>
        <div className="auth-features">
          <div className="auth-feature-item">🌾 <span>Farmer — advisory + marketplace</span></div>
          <div className="auth-feature-item">🛒 <span>Buyer — browse & buy products</span></div>
          <div className="auth-feature-item">📱 <span>Phone number is enough</span></div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-header">
            <h3>🚀 {t("register")}</h3>
            <p>{t("hasAccount")} <button type="button" className="auth-switch-btn" onClick={() => onNavigate("login")}>{t("login")}</button></p>
          </div>

          <form onSubmit={onSubmit} className="auth-form">
            {/* Role selector */}
            <div className="auth-field">
              <label>Select Your Role *</label>
              <div className="role-selector">
                {ROLES.map(r => (
                  <div key={r.value} className={`role-card ${authForm.role === r.value ? "active" : ""}`} onClick={() => onAuthFormChange({ ...authForm, role: r.value })}>
                    <span className="role-icon">{r.icon}</span>
                    <strong>{r.label}</strong>
                    <small>{r.desc}</small>
                  </div>
                ))}
              </div>
            </div>

            <div className="auth-field">
              <label>{t("name")} *</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">👤</span>
                <input type="text" placeholder="e.g. Mariamawit Bogale" value={authForm.name} onChange={e => onAuthFormChange({ ...authForm, name: e.target.value })} required />
              </div>
            </div>

            <div className="auth-field">
              <label>📱 Phone Number *</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">📱</span>
                <input type="tel" placeholder="+251 9XX XXX XXXX" value={authForm.phone || ""} onChange={e => onAuthFormChange({ ...authForm, phone: e.target.value })} required />
              </div>
            </div>

            <div className="auth-field">
              <label>✉️ Email <span style={{ color: "#888", fontSize: "12px" }}>(optional)</span></label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">✉️</span>
                <input type="email" placeholder="you@example.com (optional)" value={authForm.email} onChange={e => onAuthFormChange({ ...authForm, email: e.target.value })} />
              </div>
            </div>

            <div className="auth-field">
              <label>{t("password")} *</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">🔒</span>
                <input type={showPw ? "text" : "password"} placeholder="••••••••" value={authForm.password} onChange={e => onAuthFormChange({ ...authForm, password: e.target.value })} required />
                <button type="button" className="auth-eye-btn" onClick={() => setShowPw(!showPw)} tabIndex={-1}>{showPw ? "🙈" : "👁"}</button>
              </div>
            </div>

            <button type="submit" className="auth-submit-btn">✅ {t("registerBtn")}</button>
          </form>

          <p className="auth-back"><button type="button" className="auth-switch-btn" onClick={() => onNavigate("home")}>← Back to Home</button></p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
