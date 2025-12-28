import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";

function requireAuth() {
  return !!localStorage.getItem("token");
}

function Protected({ children }) {
  if (!requireAuth()) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <>
      <Navbar />
      <div  className="min-h-screen bg-slate-50 text-slate-800">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/products" element={<Products />} />
          <Route path="/add-product" element={
            <Protected><AddProduct /></Protected>
          } />
          <Route path="/cart" element={
            <Protected><Cart /></Protected>
          } />
          <Route path="/orders" element={
            <Protected><Orders /></Protected>
          } />
        </Routes>
      </div>
    </>
  );
}