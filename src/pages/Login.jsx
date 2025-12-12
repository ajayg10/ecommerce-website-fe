// src/pages/Login.jsx
import React, { useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await api.post("/login", form);
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      navigate("/products");
    } catch (err) {
      setError(err.body?.message || err.message);
    }
  };

  return (
    <div className="container py-8">
      <div className="max-w-md mx-auto card">
        <h2 className="text-xl font-semibold mb-4">Login</h2>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input name="email" type="email" value={form.email} onChange={onChange} required className="mt-1 block w-full rounded-md border-gray-200 p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input name="password" type="password" value={form.password} onChange={onChange} required className="mt-1 block w-full rounded-md border-gray-200 p-2" />
          </div>
          <div className="flex items-center gap-2">
            <button type="submit" className="btn-primary">Login</button>
            <button type="button" onClick={() => navigate('/register')} className="btn-ghost">Create account</button>
          </div>
          {error && <p className="text-red-600">{error}</p>}
        </form>
      </div>
    </div>
  );
}
