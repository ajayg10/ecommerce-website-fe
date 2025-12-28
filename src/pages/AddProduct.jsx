
import React, { useState } from "react";
import { api } from "../services/api";

export default function AddProduct() {
  const [form, setForm] = useState({ name: "", price: "", category: "" });
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const payload = { name: form.name, price: Number(form.price), category: form.category };
      await api.post("/add_products", payload);
      alert("Product added");
      setForm({ name: "", price: "", category: "" });
    } catch (e) {
      setErr(e.body?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/50">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-slate-900 px-8 py-6">
          <h2 className="text-2xl font-bold text-white tracking-tight">Add New Product</h2>
          <p className="text-slate-400 text-sm mt-1">Fill in the details to list a new item.</p>
        </div>

        {/* Form Section */}
        <form onSubmit={submit} className="p-8 space-y-5">
          {/* Name Input */}
          <div className="group">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 group-focus-within:text-indigo-600 transition-colors">
              Product Name
            </label>
            <input 
              name="name" 
              value={form.name} 
              onChange={onChange} 
              required 
              placeholder="e.g. Wireless Headphones"
              className="block w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Price Input */}
            <div className="group">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 group-focus-within:text-indigo-600 transition-colors">
                Price ($)
              </label>
              <input 
                name="price" 
                type="number" 
                value={form.price} 
                onChange={onChange} 
                required 
                placeholder="0.00"
                className="block w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" 
              />
            </div>

            {/* Category Input */}
            <div className="group">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 group-focus-within:text-indigo-600 transition-colors">
                Category
              </label>
              <input 
                name="category" 
                value={form.category} 
                onChange={onChange} 
                placeholder="Electronics"
                className="block w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" 
              />
            </div>
          </div>

          {/* Error Message */}
          {err && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {err}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4">
            <button 
              type="submit"
              disabled={loading} 
              className="flex-1 bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 transition-all shadow-lg shadow-indigo-200"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Processing...
                </span>
              ) : "List Product"}
            </button>
            <button 
              type="button" 
              onClick={() => setForm({ name: "", price: "", category: "" })} 
              className="px-6 py-3 text-sm font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
