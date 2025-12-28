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
    <div className="min-h-[90vh] flex flex-col justify-center py-12 px-6 lg:px-8 bg-slate-50/50">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Join Blaze Commerce and start shopping or selling today.
          </p>
        </div>

        <div className="mt-8 bg-white py-10 px-8 shadow-xl shadow-slate-200/60 rounded-3xl border border-slate-100">
          <form onSubmit={submit} className="space-y-5">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Name Field */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                  Full Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  required
                  placeholder="John Doe"
                  className="block w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/30 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                />
              </div>

              {/* Role Selection */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                  I want to...
                </label>
                <select
                  name="role"
                  value={form.role}
                  onChange={onChange}
                  className="block w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/30 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="buyer">Buy Products</option>
                  <option value="seller">Sell Products</option>
                </select>
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                required
                placeholder="john@example.com"
                className="block w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/30 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                Password
              </label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={onChange}
                required
                placeholder="min. 8 characters"
                className="block w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/30 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              />
            </div>

            {error && (
              <div className="p-4 bg-red-50 rounded-xl border border-red-100 flex items-center gap-3 text-red-600 text-sm font-medium animate-in fade-in slide-in-from-top-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <div className="pt-2 space-y-4">
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-[0.98] transition-all"
              >
                Create Account
              </button>

              <button
                type="button"
                onClick={() => navigate('/login')}
                className="w-full text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors py-2"
              >
                Already have an account? <span className="text-indigo-600 underline underline-offset-4">Log in</span>
              </button>
            </div>
          </form>
        </div>
        
        <p className="mt-8 text-center text-xs text-slate-400">
          By registering, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
