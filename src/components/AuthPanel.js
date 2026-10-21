function AuthPanel({ authMode, authForm, onAuthFormChange, onSubmit }) {
  return (
    <div className="panel">
      <h2>{authMode === "login" ? "Login" : "Register"}</h2>
      <form onSubmit={onSubmit} className="stack">
        {authMode === "register" && (
          <>
            <label>
              Full name
              <input value={authForm.name} onChange={(event) => onAuthFormChange({ ...authForm, name: event.target.value })} required />
            </label>
            <label>
              Role
              <select value={authForm.role} onChange={(event) => onAuthFormChange({ ...authForm, role: event.target.value })}>
                <option value="farmer">Farmer</option>
                <option value="admin">Admin</option>
              </select>
            </label>
          </>
        )}
        <label>
          Email
          <input type="email" value={authForm.email} onChange={(event) => onAuthFormChange({ ...authForm, email: event.target.value })} required />
        </label>
        <label>
          Password
          <input type="password" value={authForm.password} onChange={(event) => onAuthFormChange({ ...authForm, password: event.target.value })} required />
        </label>
        <button type="submit">{authMode === "login" ? "Login" : "Create Account"}</button>
      </form>
    </div>
  );
}

export default AuthPanel;
