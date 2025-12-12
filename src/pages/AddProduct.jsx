
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
    <div className="container py-8">
      <div className="max-w-lg mx-auto card">
        <h2 className="text-xl font-semibold mb-4">Add Product</h2>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input name="name" value={form.name} onChange={onChange} required className="mt-1 block w-full rounded-md border-gray-200 p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input name="price" type="number" value={form.price} onChange={onChange} required className="mt-1 block w-full rounded-md border-gray-200 p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <input name="category" value={form.category} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-200 p-2" />
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-primary" disabled={loading}>{loading ? "Adding..." : "Add Product"}</button>
            <button type="reset" onClick={() => setForm({ name: "", price: "", category: "" })} className="btn-ghost">Reset</button>
          </div>
          {err && <p className="text-red-600">{err}</p>}
        </form>
      </div>
    </div>
  );
}
