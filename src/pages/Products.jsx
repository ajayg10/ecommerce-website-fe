// src/pages/Products.jsx
import React, { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/all_products");
      setProducts(res.products || []);
    } catch (e) {
      setErr(e.body?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addToCart = async (productId) => {
    try {
      await api.post("/add_to_cart", { productId, quantity: 1 });
      alert("Added to cart");
    } catch (e) {
      alert(e.body?.message || e.message);
    }
  };

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Products</h2>
      </div>

      {loading && <div className="text-gray-500">Loading...</div>}
      {err && <div className="text-red-600">{err}</div>}

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map(p => (
          <div key={p._id} className="card flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-medium">{p.name}</h3>
              <p className="text-sm text-gray-600 mt-1">Category: {p.category || "—"}</p>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-lg font-semibold">₹{p.price}</div>
              <button onClick={() => addToCart(p._id)} className="btn-primary">Add</button>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && !loading && <p className="text-gray-600 mt-6">No products yet.</p>}
    </div>
  );
}
