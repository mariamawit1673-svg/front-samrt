import { useEffect, useState} from "react";
import { API_BASE } from "../constants";

var API = API_BASE;

function MarketplacePage(props) {
  var user = props.user;
  var s1 = useState("browse"); var tab = s1[0]; var setTab = s1[1];
  var s2 = useState([]); var products = s2[0]; var setProducts = s2[1];
  var s3 = useState([]); var mine = s3[0]; var setMine = s3[1];
  var s4 = useState([]); var orders = s4[0]; var setOrders = s4[1];
  var s5 = useState({}); var prices = s5[0]; var setPrices = s5[1];
  var s6 = useState(false); var loading = s6[0]; var setLoading = s6[1];
  var s7 = useState(""); var search = s7[0]; var setSearch = s7[1];
  var s8 = useState("all"); var cat = s8[0]; var setCat = s8[1];
  var s9 = useState(false); var showForm = s9[0]; var setShowForm = s9[1];
  var s10 = useState({name:"",price:"",quantity:"",unit:"kg",category:"Grain",description:"",imageUrl:"",farmerName:(user&&user.name)||"",phone:"",location:""});
  var form = s10[0]; var setForm = s10[1];
  var s11 = useState(null); var suggest = s11[0]; var setSuggest = s11[1];
  var s12 = useState(""); var flash = s12[0]; var setFlash = s12[1];
  var s13 = useState(null); var modal = s13[0]; var setModal = s13[1];
  var CATS = ["all","Grain","Vegetable","Fruit","Legume","Root Crop","Cash Crop","Other"];
  var UNITS = ["kg","quintal","ton","piece","liter","bundle"];
var loadProducts = function() {
  setLoading(true);

  var q = new URLSearchParams();

  if (search) q.set("search", search);
  if (cat !== "all") q.set("category", cat);

  fetch(API + "/market?" + q.toString())
    .then(function(r) { return r.json(); })
    .then(function(d) {
      setProducts(Array.isArray(d) ? d : []);
    })
    .catch(function() {
      setProducts([]);
    })
    .finally(function() {
      setLoading(false);
    });
};

var loadMine = function() {
  if (!user || !user.id) return;

  fetch(API + "/market?userId=" + user.id)
    .then(function(r) { return r.json(); })
    .then(function(d) {
      setMine(Array.isArray(d) ? d : []);
    })
    .catch(function() {});
};

var loadOrders = function() {
  if (!user || !user.id) return;

  fetch(API + "/market/orders?userId=" + user.id)
    .then(function(r) { return r.json(); })
    .then(function(d) {
      setOrders(Array.isArray(d) ? d : []);
    })
    .catch(function() {});
};

//var loadPrices = function() {
 // fetch(API + "/market/prices")
 //   .then(function(r) { return r.json(); })
 //   .then(function(d) {
 //     setPrices(d || {});
 //   })
 //   .catch(function() {});
//};

useEffect(function () {
  setLoading(true);

  var q = new URLSearchParams();
  if (search) q.set("search", search);
  if (cat !== "all") q.set("category", cat);

  fetch(API + "/market?" + q.toString())
    .then(function (r) { return r.json(); })
    .then(function (d) {
      setProducts(Array.isArray(d) ? d : []);
    })
    .catch(function () {
      setProducts([]);
    })
    .finally(function () {
      setLoading(false);
    });

  fetch(API + "/market/prices")
    .then(function (r) { return r.json(); })
    .then(function (d) {
      setPrices(d || {});
    })
    .catch(function () {});
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [search, cat]);

useEffect(function () {
  if (!user || !user.id) return;
  if (tab !== "listings") return;

  fetch(API + "/market?userId=" + user.id)
    .then(function (r) { return r.json(); })
    .then(function (d) {
      setMine(Array.isArray(d) ? d : []);
    })
    .catch(function () {});
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [tab, user]);

useEffect(function () {
  if (!user || !user.id) return;
  if (tab !== "orders") return;

  fetch(API + "/market/orders?userId=" + user.id)
    .then(function (r) { return r.json(); })
    .then(function (d) {
      setOrders(Array.isArray(d) ? d : []);
    })
    .catch(function () {});
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [tab, user]);

function setF(key, val) { setForm(function(f) { return Object.assign({}, f, {[key]: val}); }); }

  function getSuggest(name) {
    if (!name) { setSuggest(null); return; }
    fetch(API + "/market/suggest-price?name=" + encodeURIComponent(name) + "&season=rainy")
      .then(function(r) { return r.json(); })
      .then(function(d) { setSuggest(d && d.suggested ? d : null); })
      .catch(function() { setSuggest(null); });
  }

  function submitListing(e) {
    e.preventDefault();
    var body = Object.assign({}, form, { userId: (user && user.id) || null, price: Number(form.price) });
    fetch(API + "/market", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      .then(function(r) { return r.json(); })
      .then(function(d) {
        if (d.success) {
          setFlash("Product listed!");
          setShowForm(false);
          setForm({name:"",price:"",quantity:"",unit:"kg",category:"Grain",description:"",imageUrl:"",farmerName:(user&&user.name)||"",phone:"",location:""});
          setSuggest(null); loadProducts(); loadMine();
        } else { setFlash("Error: " + (d.error || "Failed")); }
      }).catch(function() { setFlash("Server error."); });
  }

  function deleteListing(id) {
    if (!window.confirm("Remove?")) return;
    fetch(API + "/market/" + id, { method: "DELETE" }).then(function() { loadMine(); loadProducts(); });
  }

  function submitOrder(e) {
    e.preventDefault();
    var d = modal.data;
    var body = {
      productId: d.product._id, productName: d.product.name,
      farmerName: d.product.farmerName, farmerPhone: d.product.phone,
      buyerName: d.buyerName, buyerPhone: d.buyerPhone, buyerLocation: d.buyerLocation,
      quantity: Number(d.qty), unit: d.product.unit,
      totalPrice: Number(d.qty) * d.product.price,
      userId: (user && user.id) || null
    };
    fetch(API + "/market/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (data.success) { setFlash("Order placed!"); setModal(null); loadOrders(); }
        else { setFlash("Error: " + (data.error || "Failed")); }
      }).catch(function() { setFlash("Server error."); });
  }

  function submitReview(e) {
    e.preventDefault();
    var d = modal.data;
    fetch(API + "/market/" + d.productId + "/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ buyerName: d.buyerName, rating: Number(d.rating), comment: d.comment })
    }).then(function() { setModal(null); loadProducts(); setFlash("Review submitted!"); });
  }

  function upd(patch) {
    setModal(function(m) { return { type: m.type, data: Object.assign({}, m.data, patch) }; });
  }

  return (
    <section className="panel mp-page">
      <div className="mp-header">
        <div>
          <p className="eyebrow">Agricultural Marketplace</p>
          <h2>Marketplace</h2>
          <p style={{color:"#666",fontSize:"14px"}}>Buy and sell farm products directly.</p>
        </div>
        {user && (
          <button className="mp-btn-primary" onClick={function() { setShowForm(function(v) { return !v; }); }}>
            {showForm ? "Cancel" : "+ List Product"}
          </button>
        )}
      </div>

      {flash && (
        <div style={{padding:"10px 16px",borderRadius:"8px",marginBottom:"14px",background:"#d1fae5",color:"#065f46",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span>{flash}</span>
          <button onClick={function() { setFlash(""); }} style={{background:"none",border:"none",cursor:"pointer"}}>x</button>
        </div>
      )}

      <div className="mp-tabs">
        <button className={"mp-tab" + (tab === "browse" ? " active" : "")} onClick={function() { setTab("browse"); }}>Browse</button>
        <button className={"mp-tab" + (tab === "listings" ? " active" : "")} onClick={function() { setTab("listings"); }}>My Listings</button>
        <button className={"mp-tab" + (tab === "orders" ? " active" : "")} onClick={function() { setTab("orders"); }}>My Orders</button>
        <button className={"mp-tab" + (tab === "prices" ? " active" : "")} onClick={function() { setTab("prices"); }}>Market Prices</button>
      </div>

      {showForm && (
        <div className="mp-form-card">
          <h3>List Your Product</h3>
          <form onSubmit={submitListing} className="mp-form">
            <div className="mp-form-row">
              <label>Product Name *
                <input value={form.name} required placeholder="e.g. Maize, Tomato"
                  onChange={function(e) { setF("name", e.target.value); getSuggest(e.target.value); }} />
              </label>
              <label>Category
                <select value={form.category} onChange={function(e) { setF("category", e.target.value); }}>
                  {CATS.filter(function(c) { return c !== "all"; }).map(function(c) { return <option key={c}>{c}</option>; })}
                </select>
              </label>
            </div>
            {suggest && (
              <div className="mp-price-hint">Suggested: ETB {suggest.suggested}/kg (ETB {suggest.low}-{suggest.high})</div>
            )}
            <div className="mp-form-row">
              <label>Price (ETB) *
                <input type="number" min="1" value={form.price} required
                  onChange={function(e) { setF("price", e.target.value); }} />
              </label>
              <label>Quantity *
                <input value={form.quantity} required
                  onChange={function(e) { setF("quantity", e.target.value); }} />
              </label>
              <label>Unit
                <select value={form.unit} onChange={function(e) { setF("unit", e.target.value); }}>
                  {UNITS.map(function(u) { return <option key={u}>{u}</option>; })}
                </select>
              </label>
            </div>
            <div className="mp-form-row">
              <label>Your Name *
                <input value={form.farmerName} required
                  onChange={function(e) { setF("farmerName", e.target.value); }} />
              </label>
              <label>Phone *
                <input value={form.phone} required placeholder="+251 9XX XXX XXXX"
                  onChange={function(e) { setF("phone", e.target.value); }} />
              </label>
              <label>Location
                <input value={form.location} placeholder="e.g. Addis Ababa"
                  onChange={function(e) { setF("location", e.target.value); }} />
              </label>
            </div>
            <div className="mp-form-row">
              <label>Description
                <input value={form.description} placeholder="Optional"
                  onChange={function(e) { setF("description", e.target.value); }} />
              </label>
              <label>Image URL
                <input value={form.imageUrl} placeholder="https://..."
                  onChange={function(e) { setF("imageUrl", e.target.value); }} />
              </label>
            </div>
            <button type="submit" className="mp-btn-primary">List Product</button>
          </form>
        </div>
      )}

      {tab === "browse" && (
        <div>
          <div className="mp-filters">
            <div className="mp-search-row">
              <input className="mp-search" placeholder="Search products, farmers..."
                value={search}
                onChange={function(e) { setSearch(e.target.value); }}
                onKeyDown={function(e) { if (e.key === "Enter") loadProducts(); }} />
              <button className="mp-btn-secondary" onClick={loadProducts}>Search</button>
            </div>
            <div className="mp-cats">
              {CATS.map(function(c) {
                return (
                  <button key={c} className={"mp-cat" + (cat === c ? " active" : "")}
                    onClick={function() { setCat(c); }}>
                    {c === "all" ? "All" : c}
                  </button>
                );
              })}
            </div>
          </div>
          {loading && <p className="mp-loading">Loading...</p>}
          {!loading && products.length === 0 && (
            <div className="mp-empty"><p>No products found.</p></div>
          )}
          {!loading && products.length > 0 && (
            <div className="mp-grid">
              {products.map(function(p) {
                return (
                  <article className="mp-card" key={p._id}>
                    <div className="mp-card-img">
                      {p.imageUrl
                        ? <img src={p.imageUrl} alt={p.name} onError={function(e) { e.target.style.display = "none"; }} />
                        : <span className="mp-card-emoji">&#127807;</span>
                      }
                      <span className="mp-card-badge">{p.category}</span>
                    </div>
                    <div className="mp-card-body">
                      <h3 className="mp-card-name">{p.name}</h3>
                      <div className="mp-card-price">
                        <strong>ETB {p.price}</strong>
                        <span> / {p.quantity} {p.unit}</span>
                      </div>
                      {p.description && <p className="mp-card-desc">{p.description}</p>}
                      <div className="mp-card-meta">
                        <span>{p.farmerName}</span>
                        {p.location && <span>{p.location}</span>}
                      </div>
                      <div className="mp-card-actions">
                        <button className="mp-btn-contact"
                          onClick={function() { setModal({ type: "contact", data: p }); }}>
                          Contact
                        </button>
                        <button className="mp-btn-order"
                          onClick={function() { setModal({ type: "order", data: { product: p, buyerName: (user && user.name) || "", buyerPhone: "", buyerLocation: "", qty: 1 } }); }}>
                          Order
                        </button>
                        <button className="mp-btn-review"
                          onClick={function() { setModal({ type: "review", data: { productId: p._id, buyerName: (user && user.name) || "", rating: 5, comment: "" } }); }}>
                          Rate
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}

      {tab === "listings" && (
        <div>
          {!user && <div className="mp-empty"><p>Login to manage listings.</p></div>}
          {user && mine.length === 0 && (
            <div className="mp-empty">
              <p>No active listings.</p>
              <button className="mp-btn-primary" onClick={function() { setShowForm(true); }}>+ List a Product</button>
            </div>
          )}
          {user && mine.length > 0 && (
            <div className="mp-grid">
              {mine.map(function(p) {
                return (
                  <article className="mp-card" key={p._id}>
                    <div className="mp-card-img">
                      <span className="mp-card-emoji">&#127807;</span>
                      <span className="mp-card-badge">{p.category}</span>
                    </div>
                    <div className="mp-card-body">
                      <h3 className="mp-card-name">{p.name}</h3>
                      <div className="mp-card-price">
                        <strong>ETB {p.price}</strong>
                        <span> / {p.quantity} {p.unit}</span>
                      </div>
                      <div className="mp-card-meta">
                        <span>{p.totalOrders || 0} orders</span>
                        <span>{p.location || ""}</span>
                      </div>
                      <div className="mp-card-actions">
                        <button className="mp-btn-contact"
                          onClick={function() { setModal({ type: "contact", data: p }); }}>
                          Contact
                        </button>
                        <button className="mp-btn-delete"
                          onClick={function() { deleteListing(p._id); }}>
                          Remove
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}

      {tab === "orders" && (
        <div>
          {!user && <div className="mp-empty"><p>Login to view orders.</p></div>}
          {user && orders.length === 0 && <div className="mp-empty"><p>No orders yet.</p></div>}
          {user && orders.length > 0 && (
            <div className="mp-table-wrap">
              <table className="mp-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Total</th>
                    <th>Farmer</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(function(o) {
                    return (
                      <tr key={o._id}>
                        <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                        <td><strong>{o.productName}</strong></td>
                        <td>{o.quantity} {o.unit}</td>
                        <td>ETB {o.totalPrice}</td>
                        <td>{o.farmerName}<br /><small>{o.farmerPhone}</small></td>
                        <td>
                          <span className={"mp-status mp-status-" + (o.status || "pending")}>
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === "prices" && (
        <div>
          <p style={{color:"#666",fontSize:"13px",marginBottom:"16px"}}>Reference prices in Ethiopia (ETB/kg)</p>
          <div className="mp-prices-grid">
            {Object.keys(prices).map(function(crop) {
              var p = prices[crop];
              return (
                <div className="mp-price-card" key={crop}>
                  <div className="mp-price-name">{crop}</div>
                  <div className="mp-price-row">
                    <span className="mp-price-low">ETB {p.low}</span>
                    <span className="mp-price-avg">ETB {p.avg}</span>
                    <span className="mp-price-high">ETB {p.high}</span>
                  </div>
                  <div className="mp-price-labels">
                    <span>Low</span>
                    <span>Avg</span>
                    <span>High</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {modal !== null && (
        <div className="mp-overlay" onClick={function() { setModal(null); }}>
          <div className="mp-modal" onClick={function(e) { e.stopPropagation(); }}>

            {modal.type === "contact" && (
              <div>
                <h3>Contact Farmer</h3>
                <div className="mp-modal-info">
                  <p><strong>Product:</strong> {modal.data.name}</p>
                  <p><strong>Price:</strong> ETB {modal.data.price} / {modal.data.quantity} {modal.data.unit}</p>
                  <p><strong>Farmer:</strong> {modal.data.farmerName}</p>
                  <p><strong>Phone:</strong>
                    <a href={"tel:" + modal.data.phone} style={{color:"#2e7d32",fontWeight:700}}>
                      {modal.data.phone}
                    </a>
                  </p>
                  {modal.data.location && <p><strong>Location:</strong> {modal.data.location}</p>}
                </div>
                <div className="mp-modal-actions">
                  <a href={"tel:" + modal.data.phone} className="mp-btn-contact"
                    style={{textDecoration:"none",padding:"10px 16px",borderRadius:"8px",display:"inline-block"}}>
                    Call
                  </a>
                  <a href={"https://wa.me/" + modal.data.phone.replace(/\D/g, "")}
                    target="_blank" rel="noreferrer" className="mp-btn-order"
                    style={{textDecoration:"none",padding:"10px 16px",borderRadius:"8px",display:"inline-block"}}>
                    WhatsApp
                  </a>
                </div>
                <button className="mp-modal-close" onClick={function() { setModal(null); }}>Close</button>
              </div>
            )}

            {modal.type === "order" && (
              <div>
                <h3>Place Order</h3>
                <p style={{color:"#666",fontSize:"14px",marginBottom:"12px"}}>
                  {modal.data.product.name} - ETB {modal.data.product.price}/{modal.data.product.unit}
                </p>
                <form onSubmit={submitOrder} className="mp-modal-form">
                  <label>Your Name *
                    <input value={modal.data.buyerName} required
                      onChange={function(e) { upd({ buyerName: e.target.value }); }} />
                  </label>
                  <label>Your Phone *
                    <input value={modal.data.buyerPhone} required placeholder="+251..."
                      onChange={function(e) { upd({ buyerPhone: e.target.value }); }} />
                  </label>
                  <label>Your Location
                    <input value={modal.data.buyerLocation}
                      onChange={function(e) { upd({ buyerLocation: e.target.value }); }} />
                  </label>
                  <label>Quantity *
                    <input type="number" min="1" value={modal.data.qty} required
                      onChange={function(e) { upd({ qty: e.target.value }); }} />
                  </label>
                  <div className="mp-price-hint">
                    Total: <strong>ETB {(Number(modal.data.qty) || 0) * modal.data.product.price}</strong>
                  </div>
                  <button type="submit" className="mp-btn-primary">Confirm Order</button>
                </form>
                <button className="mp-modal-close" onClick={function() { setModal(null); }}>Cancel</button>
              </div>
            )}

            {modal.type === "review" && (
              <div>
                <h3>Rate this Product</h3>
                <form onSubmit={submitReview} className="mp-modal-form">
                  <label>Your Name
                    <input value={modal.data.buyerName}
                      onChange={function(e) { upd({ buyerName: e.target.value }); }} />
                  </label>
                  <label>Rating *
                    <select value={modal.data.rating}
                      onChange={function(e) { upd({ rating: e.target.value }); }}>
                      <option value="5">5 - Excellent</option>
                      <option value="4">4 - Good</option>
                      <option value="3">3 - Average</option>
                      <option value="2">2 - Poor</option>
                      <option value="1">1 - Very Poor</option>
                    </select>
                  </label>
                  <label>Comment
                    <input value={modal.data.comment} placeholder="Optional..."
                      onChange={function(e) { upd({ comment: e.target.value }); }} />
                  </label>
                  <button type="submit" className="mp-btn-primary">Submit Review</button>
                </form>
                <button className="mp-modal-close" onClick={function() { setModal(null); }}>Cancel</button>
              </div>
            )}

          </div>
        </div>
      )}
    </section>
  );
}

export default MarketplacePage;
