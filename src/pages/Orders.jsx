
import React, { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [err, setErr] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/view_orders");
      setOrders(res.orders || []);
    } catch (e) {
      setErr(e.body?.message || e.message);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Your Orders</h2>
          <p className="text-slate-500 mt-1 font-medium">Manage and track your recent purchases</p>
        </div>
        <div className="text-sm font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg border border-indigo-100">
          {orders.length} Total Orders
        </div>
      </div>

      {err && (
        <div className="mb-6 flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-xl border border-red-100 text-sm font-medium animate-shake">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {err}
        </div>
      )}

      {orders.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
          <div className="mx-auto h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-900">No orders found</h3>
          <p className="text-slate-500">Looks like you haven't made a purchase yet.</p>
        </div>
      )}

      <div className="space-y-6">
        {orders.map((o) => (
          <div 
            key={o._id} 
            className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md hover:border-slate-300 transition-all duration-200"
          >
            {/* Order Top Bar */}
            <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <div className="flex gap-8">
                <div>
                  <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Order ID</div>
                  <div className="text-sm font-mono text-slate-600">#{o._id.slice(-8).toUpperCase()}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Date Placed</div>
                  <div className="text-sm font-semibold text-slate-700">
                    {new Date(o.placedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tighter border ${
                  o.status === 'delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                  o.status === 'processing' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                  'bg-slate-100 text-slate-600 border-slate-200'
                }`}>
                  {o.status}
                </span>
              </div>
            </div>

            {/* Order Items */}
            <div className="p-6">
              <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-4">Items Summary</div>
              <ul className="divide-y divide-slate-50">
                {o.items.map((it) => (
                  <li key={it.productId?._id || it.productId} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-800">{it.productId?.name || "Deleted product"}</div>
                        <div className="text-xs text-slate-500 font-medium">Unit Price: ₹{it.productId?.price || 0}</div>
                      </div>
                    </div>
                    <div className="text-sm font-bold text-slate-900 bg-slate-50 px-3 py-1 rounded-md border border-slate-100">
                      Qty: {it.quantity}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Footer / Total */}
            <div className="px-6 py-4 bg-slate-50/30 border-t border-slate-100 flex justify-end">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-500">Total Paid:</span>
                <span className="text-lg font-black text-slate-900">
                  ₹{o.items.reduce((acc, it) => acc + (it.productId?.price || 0) * it.quantity, 0)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
