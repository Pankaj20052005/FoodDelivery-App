import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      API.get(`/api/orders/user/${userId}`)
        .then((res) => {
          setOrders(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching orders:", err);
          setLoading(false);
        });
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-76px)] bg-cream px-6 py-12 flex flex-col items-center justify-center">
        <div className="neo-card bg-white p-12 text-center">
          <span className="text-5xl block mb-4 animate-spin">🔄</span>
          <h3 className="text-2xl font-display uppercase mb-2">Loading Orders...</h3>
          <p className="font-semibold text-ink/60">Fetching your order history.</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-[calc(100vh-76px)] bg-cream px-6 py-12 flex flex-col items-center justify-center">
        <div className="neo-card bg-white p-10 text-center max-w-md w-full relative">
          <span className="text-6xl block mb-4">🍱</span>
          <h2 className="text-3xl font-display uppercase mb-3">No Orders Yet</h2>
          <p className="font-semibold text-ink/65 mb-6">Looks like you haven't placed any orders with BiteDash yet!</p>
          <Link to="/">
            <button className="neo-btn neo-btn-chili px-6 py-3.5 text-md font-bold">
              Order Food Now 🍕
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream px-6 py-12 selection:bg-mango selection:text-ink">
      <div className="max-w-4xl mx-auto space-y-10">

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-display uppercase tracking-tight text-ink">
            My Orders 🍱
          </h1>
          <p className="font-semibold text-ink/60">
            View your past orders and track active deliveries.
          </p>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map((order) => {
            const isFinished = order.status === "DELIVERED";
            return (
              <div
                key={order.orderId}
                className="neo-card bg-white p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-[8px_8px_0px_0px_rgba(25,20,15,1)] transition-all duration-200"
              >
                <div className="space-y-3 w-full md:w-auto">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-lg font-display text-ink">
                      Order #{order.orderId}
                    </span>
                    <span className={`border-2 border-ink px-2.5 py-0.5 rounded font-bold text-xs uppercase shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] ${
                      isFinished ? "bg-basil text-white" : "bg-mango text-ink"
                    }`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="text-sm font-bold text-ink/65 space-y-1">
                    <p>📅 Date: {new Date(order.placedAt).toLocaleDateString()} at {new Date(order.placedAt).toLocaleTimeString()}</p>
                    <p>📍 Address: {order.deliveryAddress}</p>
                    <p className="text-chili text-base">Total Amount: ₹ {order.totalAmount}</p>
                  </div>
                </div>

                <div className="w-full md:w-auto text-right">
                  <Link to={`/tracking/${order.orderId}`}>
                    <button className="neo-btn neo-btn-white w-full md:w-auto px-6 py-3 text-sm font-bold">
                      {isFinished ? "View Details 📄" : "Track Delivery 🚚"}
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

export default OrdersPage;