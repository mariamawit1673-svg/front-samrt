import { useEffect, useState } from "react";
import SelectField from "../components/SelectField";
import { API_BASE, rainfallOptions, temperatureOptions, waterOptions } from "../constants";

const API = API_BASE;

function AdminPage({ isAdmin, crops, cropForm, onCropFormChange, onAddCrop, onDeleteCrop }) {
  const [tab, setTab] = useState(0);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ users: 0, products: 0, orders: 0, crops: 0, recommendations: 0 });
  const [loading, setLoading] = useState(false);
  const [flash, setFlash] = useState("");

  useEffect(() => {
    if (!isAdmin) return;
    loadAll();
  }, [isAdmin]);

  async function loadAll() {
    setLoading(true);
    try {
      const [u, p, o, h] = await Promise.all([
        fetch(API + "/auth/users").then(r => r.json()).catch(() => []),
        fetch(API + "/market").then(r => r.json()).catch(() => []),
        fetch(API + "/market/orders").then(r => r.json()).catch(() => []),
        fetch(API + "/history").then(r => r.json()).catch(() => []),
      ]);
      setUsers(Array.isArray(u) ? u : []);
      setProducts(Array.isArray(p) ? p : []);
      setOrders(Array.isArray(o) ? o : []);
      setHistory(Array.isArray(h) ? h : []);
      setStats({
        users: Array.isArray(u) ? u.length : 0,
        products: Array.isArray(p) ? p.length : 0,
        orders: Array.isArray(o) ? o.length : 0,
        crops: crops.length,
        recommendations: Array.isArray(h) ? h.length : 0,
      });
    } catch (e) { /* silent */ }
    setLoading(false);
  }

  async function deleteProduct(id) {
    if (!window.confirm("Remove this product?")) return;
    await fetch(API + "/market/" + id, { method: "DELETE" });
    setFlash("Product removed.");
    loadAll();
  }

  async function deleteUser(id) {
    if (!window.confirm("Delete this user? This cannot be undone.")) return;
    try {
      await fetch(API + "/auth/users/" + id, { method: "DELETE" });
      setFlash("User deleted.");
      loadAll();
    } catch { setFlash("Failed to delete user."); }
  }

  async function changeUserRole(id, role) {
    try {
      await fetch(API + "/auth/users/" + id + "/role", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role })
      });
      setFlash("User role updated to " + role + ".");
      loadAll();
    } catch { setFlash("Failed to update role."); }
  }

  if (!isAdmin) {
    return (
      <section className="panel">
        <h2>Admin Panel</h2>
        <p style={{ color: "#e53935" }}>Access denied. Admin login required.</p>
      </section>
    );
  }

  // Analytics
  const cropFreq = history.flatMap(h => h.recommendedCrops || []).reduce((acc, c) => { acc[c] = (acc[c] || 0) + 1; return acc; }, {});
  const topCrops = Object.entries(cropFreq).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const roleCount = { farmer: 0, buyer: 0, admin: 0 };
  users.forEach(u => { if (roleCount[u.role] !== undefined) roleCount[u.role]++; });
  const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
  const topProducts = [...products].sort((a, b) => (b.totalOrders || 0) - (a.totalOrders || 0)).slice(0, 5);

  const TABS = ["Overview", "Users", "Crops", "Products", "Orders", "Recommendations", "Analytics"];

  return (
    <section className="panel admin-page">
      <p className="eyebrow">System Control</p>
      <h2>Admin Dashboard</h2>

      {flash && (
        <div style={{ padding: "10px 16px", borderRadius: "8px", marginBottom: "14px", background: "#d1fae5", color: "#065f46", display: "flex", justifyContent: "space-between" }}>
          <span>{flash}</span>
          <button onClick={() => setFlash("")} style={{ background: "none", border: "none", cursor: "pointer" }}>x</button>
        </div>
      )}

      <div className="kpi-grid" style={{ marginBottom: "20px" }}>
        <article><span>{stats.users}</span><p>Total Users</p></article>
        <article><span>{stats.crops}</span><p>Crop Records</p></article>
        <article><span>{stats.products}</span><p>Market Products</p></article>
        <article><span>{stats.orders}</span><p>Total Orders</p></article>
        <article><span>{stats.recommendations}</span><p>Recommendations</p></article>
      </div>

      <div className="pest-tabs" style={{ marginBottom: "18px", flexWrap: "wrap" }}>
        {TABS.map((label, i) => (
          <button key={i} className={tab === i ? "pest-tab active" : "pest-tab"} onClick={() => setTab(i)}>
            {label}
          </button>
        ))}
      </div>

      {loading && <p className="pest-loading">Loading...</p>}

      {/* OVERVIEW */}
      {tab === 0 && (
        <div className="admin-overview">
          <div className="panel insight-card">
            <h3>System Summary</h3>
            <p><strong>{stats.users}</strong> registered users</p>
            <p><strong>{stats.crops}</strong> crop records</p>
            <p><strong>{stats.products}</strong> marketplace products</p>
            <p><strong>{stats.orders}</strong> orders placed</p>
            <p><strong>{stats.recommendations}</strong> recommendations generated</p>
            <p>Multi-language: English, Amharic, Afaan Oromo</p>
          </div>
          <div className="panel insight-card">
            <h3>Role Distribution</h3>
            {["farmer", "buyer", "admin"].map(role => (
              <div key={role} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #eee" }}>
                <span>{role === "farmer" ? "Farmers" : role === "buyer" ? "Buyers" : "Admins"}</span>
                <strong>{roleCount[role]}</strong>
              </div>
            ))}
          </div>
          <div className="panel insight-card">
            <h3>Recent Activity</h3>
            {recentOrders.map(o => (
              <div key={o._id} style={{ padding: "6px 0", borderBottom: "1px solid #eee", fontSize: "13px" }}>
                <strong>{o.productName}</strong> — {o.buyerName} — ETB {o.totalPrice}
                <br /><small>{new Date(o.createdAt).toLocaleDateString()}</small>
              </div>
            ))}
            {recentOrders.length === 0 && <p style={{ color: "#888" }}>No recent orders.</p>}
          </div>
        </div>
      )}

      {/* USERS */}
      {tab === 1 && (
        <div>
          <h3>Registered Users ({users.length})</h3>
          {users.length === 0 && <p className="pest-empty">No users found.</p>}
          {users.length > 0 && (
            <div className="adv-table-wrap">
              <table className="adv-table">
                <thead>
                  <tr><th>Name</th><th>Contact</th><th>Role</th><th>Joined</th><th>Change Role</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id}>
                      <td><strong>{u.name}</strong></td>
                      <td>{u.email || u.phone || "-"}</td>
                      <td>
                        <span className={"adv-badge " + (u.role === "admin" ? "risk-badge risk-high" : u.role === "buyer" ? "risk-badge risk-medium" : "adv-completed")}>
                          {u.role}
                        </span>
                      </td>
                      <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "-"}</td>
                      <td>
                        <select value={u.role} onChange={e => changeUserRole(u._id, e.target.value)}
                          style={{ padding: "4px 8px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "13px" }}>
                          <option value="farmer">Farmer</option>
                          <option value="buyer">Buyer</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td>
                        <button className="market-delete-btn" onClick={() => deleteUser(u._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* CROPS */}
      {tab === 2 && (
        <div>
          <h3>Crop Knowledge Base ({crops.length} crops)</h3>
          <form onSubmit={onAddCrop} className="form-grid" style={{ marginBottom: "20px" }}>
            <label>Crop name<input value={cropForm.name} onChange={e => onCropFormChange({ ...cropForm, name: e.target.value })} required /></label>
            <label>Soil types<input value={cropForm.soilTypes} onChange={e => onCropFormChange({ ...cropForm, soilTypes: e.target.value })} placeholder="loam, clay" /></label>
            <label>Seasons<input value={cropForm.seasons} onChange={e => onCropFormChange({ ...cropForm, seasons: e.target.value })} placeholder="rainy, dry" /></label>
            <SelectField label="Rainfall" value={cropForm.rainfall} onChange={v => onCropFormChange({ ...cropForm, rainfall: v })} options={rainfallOptions} />
            <SelectField label="Temperature" value={cropForm.temperature} onChange={v => onCropFormChange({ ...cropForm, temperature: v })} options={temperatureOptions} />
            <SelectField label="Water requirement" value={cropForm.waterRequirement} onChange={v => onCropFormChange({ ...cropForm, waterRequirement: v })} options={waterOptions} />
            <label>Harvest period<input value={cropForm.harvestPeriod} onChange={e => onCropFormChange({ ...cropForm, harvestPeriod: e.target.value })} /></label>
            <label>Description<textarea value={cropForm.description} onChange={e => onCropFormChange({ ...cropForm, description: e.target.value })} /></label>
            <label>Fertilizer advice<textarea value={cropForm.fertilizerAdvice} onChange={e => onCropFormChange({ ...cropForm, fertilizerAdvice: e.target.value })} /></label>
            <label>Pest advice<textarea value={cropForm.pestAdvice} onChange={e => onCropFormChange({ ...cropForm, pestAdvice: e.target.value })} /></label>
            <button type="submit" className="mp-btn-primary">+ Add Crop</button>
          </form>
          <div className="list-grid">
            {crops.map(crop => (
              <article className="record" key={crop._id}>
                <strong>{crop.name}</strong>
                <p>{crop.soilTypes} soil | {crop.seasons} season</p>
                <p style={{ fontSize: "12px", color: "#666" }}>{crop.description}</p>
                <button className="market-delete-btn" onClick={() => onDeleteCrop(crop._id)}>Delete</button>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* PRODUCTS */}
      {tab === 3 && (
        <div>
          <h3>Marketplace Products ({products.length})</h3>
          <p style={{ fontSize: "13px", color: "#666", marginBottom: "12px" }}>Review and moderate all product listings. Remove fake or inappropriate listings.</p>
          {products.length === 0 && <p className="pest-empty">No products listed.</p>}
          {products.length > 0 && (
            <div className="adv-table-wrap">
              <table className="adv-table">
                <thead>
                  <tr><th>Product</th><th>Price</th><th>Farmer</th><th>Location</th><th>Orders</th><th>Rating</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p._id}>
                      <td><strong>{p.name}</strong><br /><small>{p.category}</small></td>
                      <td>ETB {p.price}/{p.unit}</td>
                      <td>{p.farmerName}<br /><small>{p.phone}</small></td>
                      <td>{p.location || "-"}</td>
                      <td>{p.totalOrders || 0}</td>
                      <td>{p.avgRating > 0 ? p.avgRating.toFixed(1) + "/5" : "-"}</td>
                      <td><button className="market-delete-btn" onClick={() => deleteProduct(p._id)}>Remove</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ORDERS */}
      {tab === 4 && (
        <div>
          <h3>All Orders ({orders.length})</h3>
          {orders.length === 0 && <p className="pest-empty">No orders yet.</p>}
          {orders.length > 0 && (
            <div className="adv-table-wrap">
              <table className="adv-table">
                <thead>
                  <tr><th>Date</th><th>Product</th><th>Buyer</th><th>Farmer</th><th>Qty</th><th>Total</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o._id}>
                      <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                      <td><strong>{o.productName}</strong></td>
                      <td>{o.buyerName}<br /><small>{o.buyerPhone}</small></td>
                      <td>{o.farmerName}<br /><small>{o.farmerPhone}</small></td>
                      <td>{o.quantity} {o.unit}</td>
                      <td>ETB {o.totalPrice}</td>
                      <td>
                        <span className={"adv-badge " + (o.status === "delivered" ? "adv-completed" : o.status === "cancelled" ? "risk-badge risk-high" : "adv-pending")}>
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* RECOMMENDATIONS */}
      {tab === 5 && (
        <div>
          <h3>Recommendation History ({history.length})</h3>
          <p style={{ fontSize: "13px", color: "#666", marginBottom: "12px" }}>Monitor all crop recommendations generated by the system.</p>
          {history.length === 0 && <p className="pest-empty">No recommendations yet.</p>}
          {history.length > 0 && (
            <div className="adv-table-wrap">
              <table className="adv-table">
                <thead>
                  <tr><th>Date</th><th>Recommended Crops</th><th>Soil</th><th>Season</th><th>Location</th></tr>
                </thead>
                <tbody>
                  {history.slice(0, 50).map(h => (
                    <tr key={h._id}>
                      <td>{new Date(h.createdAt).toLocaleDateString()}</td>
                      <td><strong>{(h.recommendedCrops || []).join(", ")}</strong></td>
                      <td>{h.soilType || "-"}</td>
                      <td>{h.season || "-"}</td>
                      <td>{h.location || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ANALYTICS */}
      {tab === 6 && (
        <div>
          <h3>Analytics and Reports</h3>
          <div className="admin-overview" style={{ marginBottom: "24px" }}>
            <div className="panel insight-card">
              <h3>Top Recommended Crops</h3>
              {topCrops.length === 0 && <p style={{ color: "#888" }}>No data yet.</p>}
              {topCrops.map(([crop, count]) => (
                <div key={crop} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #eee" }}>
                  <span>{crop}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "80px", height: "8px", background: "#e5e7eb", borderRadius: "4px" }}>
                      <div style={{ width: Math.min((count / (topCrops[0]?.[1] || 1)) * 100, 100) + "%", height: "100%", background: "#2e7d32", borderRadius: "4px" }} />
                    </div>
                    <strong style={{ minWidth: "24px", textAlign: "right" }}>{count}</strong>
                  </div>
                </div>
              ))}
            </div>

            <div className="panel insight-card">
              <h3>Top Selling Products</h3>
              {topProducts.length === 0 && <p style={{ color: "#888" }}>No data yet.</p>}
              {topProducts.map(p => (
                <div key={p._id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #eee", fontSize: "13px" }}>
                  <div>
                    <strong>{p.name}</strong>
                    <br /><small>{p.farmerName}</small>
                  </div>
                  <span style={{ color: "#2e7d32", fontWeight: 700 }}>{p.totalOrders || 0} orders</span>
                </div>
              ))}
            </div>

            <div className="panel insight-card">
              <h3>Marketplace Summary</h3>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #eee" }}>
                <span>Total Revenue (ETB)</span>
                <strong>{orders.reduce((s, o) => s + (o.totalPrice || 0), 0).toLocaleString()}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #eee" }}>
                <span>Avg Order Value</span>
                <strong>ETB {orders.length > 0 ? Math.round(orders.reduce((s, o) => s + (o.totalPrice || 0), 0) / orders.length) : 0}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #eee" }}>
                <span>Active Listings</span>
                <strong>{products.length}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}>
                <span>Recommendations Generated</span>
                <strong>{history.length}</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default AdminPage;
