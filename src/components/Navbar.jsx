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
    <nav className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-md border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Left side: Branding & Main Nav */}
        <div className="flex items-center gap-10">
          <Link
            to="/"
            className="text-xl font-bold tracking-tight text-slate-900 hover:opacity-80 transition-opacity"
          >
            Blaze <span className="text-indigo-600">Commerce</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link 
              className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors" 
              to="/products"
            >
              Products
            </Link>

            {token && (
              <div className="flex items-center gap-6 border-l border-slate-200 pl-6">
                <Link className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors" to="/cart">
                  Cart
                </Link>
                <Link className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors" to="/orders">
                  Orders
                </Link>
              </div>
            )}

            {user?.role === "seller" && (
              <Link
                to="/add-product"
                className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full hover:bg-indigo-100 transition-all border border-indigo-100"
              >
                + Add Product
              </Link>
            )}
          </div>
        </div>

        {/* Right side: User Actions */}
        <div className="flex items-center gap-3">
          {!token ? (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-sm font-medium text-slate-600 px-4 py-2 hover:text-slate-900 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-indigo-600 text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-200 active:scale-95"
              >
                Register
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4 bg-slate-50 p-1 pr-4 rounded-full border border-slate-100">
              <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-slate-700 font-medium">
                {user?.name}
              </span>
              <button
                onClick={logout}
                className="ml-2 text-xs font-bold text-slate-400 hover:text-red-500 uppercase tracking-wider transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}
