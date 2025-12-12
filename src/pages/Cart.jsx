
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
    <div className="container py-8">
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
        <div className="space-y-3">
          {cart.items.map(it => (
            <div key={it._id || it.productId._id} className="flex items-center justify-between">
              <div>
                <div className="font-medium">{it.productId?.name || "Deleted product"}</div>
                <div className="text-sm text-gray-600">Qty: {it.quantity}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">₹{it.productId?.price || 0}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="text-lg">Total: <span className="font-semibold">₹{totalPrice}</span></div>
          <button onClick={placeOrder} className="btn-primary" disabled={placing}>{placing ? "Placing..." : "Place Order"}</button>
        </div>
        {err && <p className="text-red-600 mt-3">{err}</p>}
      </div>
    </div>
  );
}
