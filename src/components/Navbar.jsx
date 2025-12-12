import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userJson = localStorage.getItem("user");
  const user = userJson ? JSON.parse(userJson) : null;

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav style={{ padding: 12, borderBottom: "1px solid #ddd", display: "flex", gap: 12, alignItems: "center" }}>
      <Link to="/">Home</Link>
      <Link to="/products">Products</Link>
      {token && <Link to="/cart">Cart</Link>}
      {token && <Link to="/orders">Orders</Link>}
      {user?.role === "seller" && <Link to="/add-product">Add Product</Link>}
      <div style={{ marginLeft: "auto" }}>
        {!token && <>
          <Link to="/login" style={{ marginRight: 8 }}>Login</Link>
          <Link to="/register">Register</Link>
        </>}
        {token && <>
          <span style={{ marginRight: 8 }}>Hi, {user?.name}</span>
          <button onClick={logout}>Logout</button>
        </>}
      </div>
    </nav>
  );
}