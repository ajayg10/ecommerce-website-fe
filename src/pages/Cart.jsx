
import React, { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [err, setErr] = useState(null);
  const [placing, setPlacing] = useState(false);

  const fetchCart = async () => {
    try {
      const res = await api.get("/view_cart");
      setCart(res.cart);
      setTotalPrice(res.totalPrice || 0);
    } catch (e) {
      setErr(e.body?.message || e.message);
    }
  };

  useEffect(() => { fetchCart(); }, []);

  const placeOrder = async () => {
    const address = prompt("Enter shipping address (optional)");
    setPlacing(true);
    try {
      await api.post("/place_order", { address });
      alert("Order placed.");
      fetchCart();
    } catch (e) {
      alert(e.body?.message || e.message);
    } finally {
      setPlacing(false);
    }
  };

  if (!cart) return <div className="container py-8">Loading cart...</div>;
  if (!cart.items.length) return <div className="container py-8 card">Your cart is empty</div>;

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="border-b border-slate-100 bg-slate-50/50 px-8 py-5">
          <h2 className="text-2xl font-bold text-slate-900">Your Shopping Cart</h2>
          <p className="text-sm text-slate-500 mt-1">{cart.items.length} items ready for checkout</p>
        </div>

        {/* Cart Items */}
        <div className="divide-y divide-slate-100 px-8">
          {cart.items.map((it) => (
            <div 
              key={it._id || it.productId._id} 
              className="py-6 flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                {/* Decorative placeholder for product image */}
                <div className="h-16 w-16 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>

                <div>
                  <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">
                    {it.productId?.name || "Deleted product"}
                  </div>
                  <div className="mt-1 flex items-center gap-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2 py-0.5 bg-slate-100 rounded">
                      Qty: {it.quantity}
                    </span>
                    <span className="text-sm text-slate-400">
                      × ₹{it.productId?.price || 0}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-lg font-bold text-slate-900">
                  ₹{(it.productId?.price || 0) * it.quantity}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer / Summary */}
        <div className="bg-slate-50 p-8 border-t border-slate-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="text-sm text-slate-500 font-medium">Order Total</div>
              <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                ₹{totalPrice}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={placeOrder} 
                disabled={placing} 
                className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold px-10 py-4 rounded-xl hover:bg-indigo-700 active:scale-95 disabled:opacity-70 disabled:active:scale-100 transition-all shadow-lg shadow-indigo-200"
              >
                {placing ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Confirm Order"
                )}
              </button>
              
              {err && (
                <p className="text-xs font-semibold text-red-500 flex items-center gap-1 justify-center md:justify-end">
                   <span>⚠️</span> {err}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
