
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
    <div className="container py-8">
      <h2 className="text-2xl font-semibold mb-4">Your Orders</h2>
      {err && <div className="text-red-600">{err}</div>}
      {orders.length === 0 && <div className="card">No orders found</div>}

      <div className="space-y-4">
        {orders.map(o => (
          <div key={o._id} className="card">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Order ID</div>
                <div className="font-medium">{o._id}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Status</div>
                <div className="font-medium capitalize">{o.status}</div>
              </div>
            </div>

            <div className="mt-3">
              <div className="text-sm text-gray-600">Placed at</div>
              <div className="text-sm">{new Date(o.placedAt).toLocaleString()}</div>
            </div>

            <div className="mt-3">
              <div className="text-sm text-gray-600">Items</div>
              <ul className="mt-2 space-y-1">
                {o.items.map(it => (
                  <li key={it.productId?._id || it.productId} className="flex items-center justify-between">
                    <div className="text-sm">{it.productId?.name || "Deleted product"}</div>
                    <div className="text-sm">Qty: <span className="font-medium">{it.quantity}</span></div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
