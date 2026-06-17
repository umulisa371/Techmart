import { useState, useEffect } from "react";

export default function AdminPage({ C, F }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("adminToken"));
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("adminToken"));
  const [loading, setLoading] = useState(false);
  const [dashLoading, setDashLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [page, setPage] = useState("admin");

const login = async () => {
  setLoading(true);

  try {
    const res = await fetch(
  "https://techmart-hngi.onrender.com/api/admin/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    console.log("STATUS:", res.status);

    const result = await res.json();

    console.log("RESULT:", result);

    if (result.success) {
      localStorage.setItem("adminToken", result.token);

      console.log(
        "TOKEN AFTER SAVE:",
        localStorage.getItem("adminToken")
      );

      setToken(result.token);
      setLoggedIn(true);
    } else {
      alert(result.message);
    }
  } catch (err) {
    console.log(err);
    alert(err.message);
  }

  setLoading(false);
};

const loadDashboard = async () => {
  setDashLoading(true);
  try {
    console.log(
      "SENDING TOKEN:",
      localStorage.getItem("adminToken")
    );

    const res = await fetch(
      "https://techmart-hngi.onrender.com/api/admin/dashboard",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            "adminToken"
          )}`,
        },
      }
    );

    const result = await res.json();

    if (res.ok) {
      setData(result);
    } else {
      setError(result.message || "Failed to load dashboard");
    }
  } catch (err) {
    setError("Cannot connect to server: " + err.message);
  } finally {
    setDashLoading(false);
  }
};

useEffect(() => {
  if (loggedIn) loadDashboard();
}, [loggedIn]);

  const logout = () => {
    localStorage.removeItem("adminToken");
    setToken(null);
    setLoggedIn(false);
  
    setData(null);
  };



const deleteProduct = async (id) => {
  await fetch(`https://techmart-hngi.onrender.com/api/admin/products/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`
    },
  });

  loadDashboard();
};
  // LOGIN SCREEN
  if (!loggedIn) {
    return (
      <div style={{ maxWidth: 400, margin: "80px auto", padding: 40, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16 }}>
        <h2 style={{ color: C.text, fontFamily: F.display, marginBottom: 24 }}>🔐 Admin Login</h2>
        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 12px", color: C.text, fontSize: 14, marginBottom: 12, outline: "none", fontFamily: F.body }}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === "Enter" && login()}
          style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 12px", color: C.text, fontSize: 14, marginBottom: 16, outline: "none", fontFamily: F.body }}
        />
        <button
          onClick={login}
          disabled={loading}
          style={{ width: "100%", background: C.accent, color: "#fff", border: "none", borderRadius: 8, padding: "11px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: F.body }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    );
  }

  // LOADING
  if (dashLoading) {
  return (
    <div style={{ padding: 60, textAlign: "center" }}>
      Loading dashboard...
    </div>
  );
}

  // ERROR
  if (error) {
    return (
      <div style={{ padding: 60, textAlign: "center" }}>
        <p style={{ color: C.red, marginBottom: 16 }}>{error}</p>
        <button onClick={() => loadDashboard(token)} style={{ background: C.accent, color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", cursor: "pointer" }}>Retry</button>
      </div>
    );
  }

  if (!data) return null;

  const { analytics, users, orders, products } = data;
  console.log("ORDERS FROM BACKEND:", orders);
  console.log("FIRST ORDER:", orders[0]);

  function StatCard({ icon, title, value }) {
    return (
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
        <div style={{ fontSize: 28 }}>{icon}</div>
        <div style={{ color: C.textMuted, marginTop: 8, fontSize: 12 }}>{title}</div>
        <div style={{ color: C.text, fontSize: 22, fontWeight: 800, fontFamily: F.mono }}>{value}</div>
      </div>
    );
  }
  console.log(
 "UPDATING WITH",
 localStorage.getItem("adminToken")
);
const updateOrder = async (id, status) => {
  try {
    const res = await fetch(`https://techmart-hngi.onrender.com/api/admin/orders/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
      body: JSON.stringify({ status }),
    });

    const result = await res.json();

    if (!res.ok) {
      alert(result.message || "Failed to update order");
      return;
    }

    loadDashboard();
  } catch (err) {
    console.log(err);
    alert("Failed to update order");
  }
};
const editProduct = async (p) => {
  const name = prompt("Name", p.name);
  const price = prompt("Price", p.price);
  const stock = prompt("Stock", p.stock);

  if (!name) return;

  try {
    const res = await fetch(
      `https://techmart-hngi.onrender.com/api/admin/products/${p.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify({
          name,
          price: Number(price),
          stock: Number(stock),
        }),
      }
    );

    const result = await res.json();

    if (!res.ok) {
      alert(result.message || "Failed to update product");
      return;
    }

    loadDashboard(); // refresh UI
  } catch (err) {
    console.log(err);
    alert("Update failed");
  }
};


  return (
    <div style={{ padding: "32px 0" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <h1 style={{ color: C.text, fontFamily: F.display, fontSize: 24, fontWeight: 800 }}>🛡️ Admin Dashboard</h1>
        <button onClick={logout} style={{ background: "transparent", color: C.red, border: `1px solid ${C.red}`, borderRadius: 8, padding: "7px 16px", cursor: "pointer", fontSize: 13, fontFamily: F.body }}>Logout</button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16, marginBottom: 36 }}>
        <StatCard icon="👥" title="Total Users"    value={analytics.users} />
        <StatCard icon="📦" title="Total Orders"   value={analytics.orders} />
        <StatCard icon="🛍️" title="Total Products" value={analytics.products} />
        <StatCard icon="💰" title="Revenue (RWF)"  value={analytics.revenue.toLocaleString()} />
      </div>

      {/* Users */}
      <h2 style={{ color: C.text, fontFamily: F.display, fontSize: 18, marginBottom: 14 }}>👥 Users</h2>
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", marginBottom: 32 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, fontFamily: F.body }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {["Name","Email","Joined"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: C.textMuted, fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                <td style={{ padding: "11px 16px", color: C.text }}>{u.name}</td>
                <td style={{ padding: "11px 16px", color: C.textSec }}>{u.email}</td>
                <td style={{ padding: "11px 16px", color: C.textMuted }}>{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Orders */}
      <h2 style={{ color: C.text, fontFamily: F.display, fontSize: 18, marginBottom: 14 }}>📦 Orders</h2>
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", marginBottom: 32 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, fontFamily: F.body }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {["Order ID","User","Total","Status","Date"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: C.textMuted, fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                <td style={{ padding: "11px 16px", color: C.textMuted, fontFamily: F.mono, fontSize: 11 }}>{o.orderNumber}</td>
                <td style={{ padding: "11px 16px", color: C.text }}>{o.user?.name || "—"}</td>
                <td style={{ padding: "11px 16px", color: C.accent, fontFamily: F.mono }}>{o.total?.toLocaleString()} $</td>
                <td style={{ padding: "11px 16px" }}>
                  <select
  value={o.status}
  onChange={(e) => updateOrder(o.id, e.target.value)}
>
  <option>pending</option>
  <option>processing</option>
  <option>delivered</option>
  <option>cancelled</option>
</select>
                </td>
                <td style={{ padding: "11px 16px", color: C.textMuted }}>{new Date(o.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Products */}
      <div style={{ marginBottom: 12 }}>
  
<button
  onClick={() => setPage("add-product")}
  style={{
    padding: "10px 16px",
    background: C.accent,
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer"
  }}
>
  + Add Product
</button>

  
</div>
      <h2 style={{ color: C.text, fontFamily: F.display, fontSize: 18, marginBottom: 14 }}>🛍️ Products</h2>
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", marginBottom: 32 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, fontFamily: F.body }}>
         <thead>
  <tr style={{ borderBottom: `1px solid ${C.border}` }}>
    <th>Name</th>
    <th>Price</th>
    <th>Stock</th>
    <th>Added</th>
    
    <th>Description</th>
    <th>Actions</th>
  </tr>
</thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                <td style={{ padding: "11px 16px", color: C.text }}>{p.name}</td>
                <td style={{ padding: "11px 16px", color: C.accent, fontFamily: F.mono }}>{p.price?.toLocaleString()} $</td>
                <td style={{ padding: "11px 16px", color: C.textSec }}>{p.stock ?? "—"}</td>
                <td style={{ padding: "11px 16px", color: C.textMuted }}>{new Date(p.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: "11px 16px", color: C.textSec, fontSize: 12 }}>{p.description || "—"}</td>
     <td style={{ padding: "11px 16px" }}>

  <button onClick={() => setSelectedProduct(p)}>
    View
  </button>

  <button onClick={() => editProduct(p)}>
    Edit
  </button>

  <button onClick={() => deleteProduct(p.id)}>
    Delete
  </button>

</td>
              </tr>

              
            ))}
          </tbody>
        </table>
        {selectedProduct && (
  <div style={{ padding: 16, border: "1px solid gray", marginTop: 20 }}>
    <h3>Product Details</h3>

    <p><b>Name:</b> {selectedProduct.name}</p>
    <p><b>Price:</b> {selectedProduct.price}</p>
    <p><b>Stock:</b> {selectedProduct.stock}</p>
    <p><b>ID:</b> {selectedProduct.id}</p>
    <p><b>Description:</b> {selectedProduct.description}</p>

    <button onClick={() => setSelectedProduct(null)}>
      Close
    </button>
  </div>
)}
      </div>

    </div>
  );
}