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
    <div className="max-w-7xl mx-auto py-12 px-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Featured Products</h2>
          <p className="text-slate-500 mt-1 font-medium">Discover our handpicked collection of premium goods.</p>
        </div>
        <div className="text-sm font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded">
          {products.length} Items
        </div>
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-slate-500 font-medium">Updating catalog...</span>
        </div>
      )}
      
      {err && (
        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl flex items-center gap-3 mb-8">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">{err}</span>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((p) => (
          <div 
            key={p._id} 
            className="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 flex flex-col"
          >
            {/* Decorative Image Placeholder */}
            <div className="aspect-[4/3] bg-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-200 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>

            <div className="p-6 flex flex-col flex-grow">
              <div className="mb-4">
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded">
                  {p.category || "General"}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                  {p.name}
                </h3>
              </div>

              <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-50">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400 font-medium">Price</span>
                  <span className="text-xl font-black text-slate-900">₹{p.price}</span>
                </div>
                
                <button 
                  onClick={() => addToCart(p._id)} 
                  className="bg-slate-900 text-white p-3 rounded-xl hover:bg-indigo-600 active:scale-90 transition-all shadow-lg shadow-slate-200"
                  aria-label="Add to cart"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {products.length === 0 && !loading && (
        <div className="text-center py-24 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <p className="text-lg font-semibold text-slate-900">No products found</p>
          <p className="text-slate-500 mt-1">Check back later for new arrivals.</p>
        </div>
      )}
    </div>
  );
}
