// src/pages/Register.jsx
import React, { useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "buyer" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await api.post("/register", form);
      alert("Registered. Please login.");
      navigate("/login");
    } catch (err) {
      setError(err.body?.message || err.message);
    }
  };

  return (
    <div className="container py-8">
      <div className="max-w-md mx-auto card">
        <h2 className="text-xl font-semibold mb-4">Create an account</h2>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input name="name" value={form.name} onChange={onChange} required className="mt-1 block w-full rounded-md border-gray-200 p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input name="email" type="email" value={form.email} onChange={onChange} required className="mt-1 block w-full rounded-md border-gray-200 p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input name="password" type="password" value={form.password} onChange={onChange} required className="mt-1 block w-full rounded-md border-gray-200 p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select name="role" value={form.role} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-200 p-2">
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button type="submit" className="btn-primary">Register</button>
            <button type="button" onClick={() => navigate('/login')} className="btn-ghost">Already have account</button>
          </div>
          {error && <p className="text-red-600">{error}</p>}
        </form>
      </div>
    </div>
  );
}
