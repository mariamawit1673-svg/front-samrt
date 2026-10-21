import { useCallback, useEffect, useState } from "react";
import { API_BASE } from "../constants";

const API = API_BASE;

const CROPS = ["Maize", "Tomato", "Beans", "Rice", "Wheat", "Potato", "Cabbage", "Mango"];

const RISK_STYLES = {
  High:   { badge: "risk-badge risk-high",   alert: "pest-alert pest-alert-high" },
  Medium: { badge: "risk-badge risk-medium", alert: "pest-alert pest-alert-medium" },
  Low:    { badge: "risk-badge risk-low",    alert: "pest-alert pest-alert-low" },
};

const STATUS_STYLE = {
  open:     "adv-badge adv-pending",
  treated:  "adv-badge adv-completed",
  resolved: "risk-badge risk-low",
};

// â”€â”€ 1. Symptom Checker â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function SymptomChecker({ user }) {
  const [crop, setCrop] = useState(CROPS[0]);
  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function handleDiagnose(e) {
    e.preventDefault();
    if (!symptoms.trim()) return;
    setLoading(true);
    setResult(null);
    setSaved(false);
    setError("");
    try {
      const res = await fetch(`${API}/pests/diagnose`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ crop, symptoms }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setError("Could not connect to backend. Make sure the server is running.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    try {
      await fetch(`${API}/pests/reports`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          crop,
          symptoms,
          pestName: result?.problem || "Unknown",
          treatment: result?.advice || "",
          userId: user?.id || null,
          status: "open",
        }),
      });
      setSaved(true);
    } catch { /* silent */ }
  }

  return (
    <div className="pest-checker">
      <form className="pest-checker-form" onSubmit={handleDiagnose}>
        <label>
          Crop Name (type any crop)          <input type="text" value={crop} onChange={(e) => setCrop(e.target.value)} placeholder="e.g. Banana, Sugarcane, Onion..." list="crop-list" required />          <datalist id="crop-list">{CROPS.map((c) => <option key={c} value={c} />)}</datalist>
        </label>
        <label>
          Describe Symptoms
          <textarea
            placeholder="e.g. yellowing leaves, holes in leaves, white powder on stems..."
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            rows={4}
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Diagnosing..." : "Identify Pest"}
        </button>
      </form>

      {error && <p className="notice error">{error}</p>}

      {!loading && result === null && symptoms.length > 0 && !error && (
        <div className="pest-empty"><p>No matching pest found. Try describing symptoms in more detail.</p></div>
      )}

      {result && (
        <div className="pest-result">
          <div className="pest-result-header">
            <div>
              <span className="pest-crop-label">{result.crop}</span>
              <h3>{result.problem}</h3>
            </div>
            <span className={RISK_STYLES[result.riskLevel]?.badge || "risk-badge risk-low"}>
              {result.riskLevel} Risk
            </span>
          </div>
          <div className="pest-result-grid">
            <div className="pest-result-block">
              <strong>Symptoms</strong>
              <p>{result.symptoms}</p>
            </div>
            <div className="pest-result-block">
              <strong>General Advice</strong>
              <p>{result.advice}</p>
            </div>
            <div className="pest-result-block pest-organic">
              <strong>Organic Treatment</strong>
              <p>{result.organicTreatment || "No organic option listed."}</p>
            </div>
            <div className="pest-result-block pest-chemical">
              <strong>Chemical Treatment</strong>
              <p>{result.chemicalTreatment || "No chemical option listed."}</p>
            </div>
            <div className="pest-result-block pest-prevention" style={{ gridColumn: "1 / -1" }}>
              <strong>Prevention Tips</strong>
              <p>{result.prevention || "No prevention tips listed."}</p>
            </div>
          </div>
          {!saved
            ? <button className="secondary-button" onClick={handleSave}>Save to My Reports</button>
            : <p className="notice success">Saved to your reports.</p>
          }
        </div>
      )}
    </div>
  );
}

// â”€â”€ 2. Pest Library â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function PestLibrary() {
  const [pests, setPests] = useState([]);
  const [search, setSearch] = useState("");
  const [cropFilter, setCropFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [riskInfo, setRiskInfo] = useState(null);
  const [detail, setDetail] = useState(null);

  const fetchPests = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (cropFilter !== "all") params.set("crop", cropFilter);
      const res = await fetch(`${API}/pests?${params}`);
      const data = await res.json();
      setPests(Array.isArray(data) ? data : []);
    } catch { setPests([]); }
    finally { setLoading(false); }
  }, [search, cropFilter]);

  useEffect(() => {
    const t = setTimeout(fetchPests, 300);
    return () => clearTimeout(t);
  }, [fetchPests]);

  useEffect(() => {
    if (!cropFilter || cropFilter === "all") { setRiskInfo(null); return; }
    fetch(`${API}/pests/risk/${encodeURIComponent(cropFilter)}`)
      .then((r) => r.json()).then(setRiskInfo).catch(() => setRiskInfo(null));
  }, [cropFilter]);

  return (
    <div>
      {riskInfo && (
        <div className={RISK_STYLES[riskInfo.riskLevel]?.alert || "pest-alert pest-alert-low"}>
          <div className="pest-alert-row">
            <strong>
              {riskInfo.riskLevel === "High" ? "Warning:" : riskInfo.riskLevel === "Medium" ? "Notice:" : "Info:"}
              &nbsp;{riskInfo.riskLevel} pest risk for {riskInfo.crop}
            </strong>
            <div className="pest-alert-stats">
              <span>{riskInfo.temperature}C</span>
              <span>{riskInfo.humidity}% humidity</span>
              <span className={RISK_STYLES[riskInfo.riskLevel]?.badge}>{riskInfo.riskLevel}</span>
            </div>
          </div>
        </div>
      )}

      <div className="pest-controls">
        <input type="search" placeholder="Search pests..." value={search}
          onChange={(e) => setSearch(e.target.value)} />
        <select value={cropFilter} onChange={(e) => setCropFilter(e.target.value)}>
          <option value="all">All Crops</option>
          {CROPS.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {loading && <p className="pest-loading">Loading...</p>}
      {!loading && pests.length === 0 && (
        <div className="pest-empty"><p>No pests found.</p></div>
      )}
      {!loading && pests.length > 0 && (
        <div className="pest-grid">
          {pests.map((pest) => (
            <article className="pest-card" key={pest._id}>
              <div className="pest-card-img-placeholder">information</div>
              <div className="pest-card-body">
                <div className="pest-card-top">
                  <span className="pest-crop-label">{pest.crop}</span>
                  <span className={RISK_STYLES[pest.riskLevel]?.badge || "risk-badge risk-low"}>
                    {pest.riskLevel}
                  </span>
                </div>
                <h3 className="pest-card-title">{pest.problem}</h3>
                <p className="pest-card-text">{pest.symptoms}</p>
                <div className="pest-card-actions">
                  <button className="secondary-button" onClick={() => setDetail(pest)}>View Details</button>
                  <button onClick={() => setDetail(pest)}>Get Treatment</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {detail && (
        <div className="pest-modal-overlay" onClick={() => setDetail(null)}>
          <div className="pest-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pest-modal-header">
              <div>
                <span className="pest-crop-label">{detail.crop}</span>
                <h3>{detail.problem}</h3>
              </div>
              <span className={RISK_STYLES[detail.riskLevel]?.badge || "risk-badge risk-low"}>
                {detail.riskLevel} Risk
              </span>
            </div>
            <p><strong>Symptoms:</strong> {detail.symptoms}</p>
            <p><strong>General Advice:</strong> {detail.advice}</p>
            {detail.organicTreatment && <p><strong>Organic:</strong> {detail.organicTreatment}</p>}
            {detail.chemicalTreatment && <p><strong>Chemical:</strong> {detail.chemicalTreatment}</p>}
            {detail.prevention && <p><strong>Prevention:</strong> {detail.prevention}</p>}
            <button onClick={() => setDetail(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

// â”€â”€ 3. My Reports â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function MyReports({ user }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const params = user?.id ? `?userId=${user.id}` : "";
      const res = await fetch(`${API}/pests/reports${params}`);
      const data = await res.json();
      setReports(Array.isArray(data) ? data : []);
    } catch { setReports([]); }
    finally { setLoading(false); }
  }, [user]);

  useEffect(() => { fetchReports(); }, [fetchReports]);

  async function updateStatus(id, status) {
    try {
      await fetch(`${API}/pests/reports/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchReports();
    } catch { /* silent */ }
  }

  return (
    <div>
      {loading && <p className="pest-loading">Loading reports...</p>}
      {!loading && reports.length === 0 && (
        <div className="pest-empty">
          <p>No pest reports yet. Use the Symptom Checker tab to diagnose and save a report.</p>
        </div>
      )}
      {!loading && reports.length > 0 && (
        <div className="adv-table-wrap">
          <table className="adv-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Crop</th>
                <th>Pest Identified</th>
                <th>Symptoms</th>
                <th>Status</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r._id}>
                  <td className="adv-date">{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td><strong>{r.crop}</strong></td>
                  <td>{r.pestName || "â€”"}</td>
                  <td className="adv-advice-cell">{r.symptoms}</td>
                  <td>
                    <span className={STATUS_STYLE[r.status] || "adv-badge adv-pending"}>{r.status}</span>
                  </td>
                  <td>
                    <select className="adv-status-select" value={r.status}
                      onChange={(e) => updateStatus(r._id, e.target.value)}>
                      <option value="open">Open</option>
                      <option value="treated">Treated</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// â”€â”€ Main Page (defined LAST so sub-components are in scope) â”€â”€
const TABS = ["Symptom Checker", "Pest Library", "My Reports"];

function PestAdvisoryPage({ user }) {
  const [tab, setTab] = useState(0);

  return (
    <section className="panel">
      <p className="eyebrow">Plant Health</p>
      <h2>Pest Advisory</h2>
      <p className="page-intro">
        Identify pests from symptoms, browse the pest library, and track your past reports.
      </p>
      <div className="pest-tabs">
        {TABS.map((t, i) => (
          <button key={t} className={tab === i ? "pest-tab active" : "pest-tab"} onClick={() => setTab(i)}>
            {t}
          </button>
        ))}
      </div>
      {tab === 0 && <SymptomChecker user={user} />}
      {tab === 1 && <PestLibrary />}
      {tab === 2 && <MyReports user={user} />}
    </section>
  );
}

export default PestAdvisoryPage;


