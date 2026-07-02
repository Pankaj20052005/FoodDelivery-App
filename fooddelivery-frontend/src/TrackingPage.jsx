import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "./api/axios";

function TrackingPage() {
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [liveUpdate, setLiveUpdate] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    API.get(`/api/orders/${orderId}`)
      .then((res) => setOrder(res.data))
      .catch((err) => console.log(err));

        // Dynamically construct WebSocket URL (translates http->ws and https->wss)
        const getWsUrl = () => {
          const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
          const wsBase = apiUrl.replace(/^http/, "ws");
          return `${wsBase}/ws/tracking/${orderId}`;
        };

        const socket = new WebSocket(getWsUrl());

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Live tracking:", data);
      setLiveUpdate(data);
    };

    socket.onerror = (error) => {
      console.log("WebSocket error:", error);
    };

    return () => {
      socket.close();
    };
  }, [orderId]);

  // Simulate Rider Movement & Status updates via API triggers
  const startSimulation = async () => {
    if (isSimulating) return;
    setIsSimulating(true);

    const steps = [
      { status: "PREPARING", lat: 12.9716, lng: 77.5946 },
      { status: "OUT_FOR_DELIVERY", lat: 12.9730, lng: 77.5960 },
      { status: "OUT_FOR_DELIVERY", lat: 12.9750, lng: 77.5975 },
      { status: "OUT_FOR_DELIVERY", lat: 12.9775, lng: 77.5990 },
      { status: "DELIVERED", lat: 12.9800, lng: 77.6000 },
    ];

    let i = 0;
    const interval = setInterval(async () => {
      if (i >= steps.length) {
        clearInterval(interval);
        setIsSimulating(false);
        return;
      }

      const step = steps[i];
      try {
        await API.put(`/api/orders/${orderId}/tracking`, {
          lat: step.lat,
          lng: step.lng,
          status: step.status,
        });
        i++;
      } catch (err) {
        console.error("Simulation error:", err);
        clearInterval(interval);
        setIsSimulating(false);
      }
    }, 3000); // Trigger updates every 3 seconds
  };

  const status = liveUpdate?.status || order?.status || "PLACED";
  const stages = ["PLACED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED"];
  const currentIndex = stages.indexOf(status.toUpperCase()) !== -1 ? stages.indexOf(status.toUpperCase()) : 0;

  return (
    <div className="min-h-[calc(100vh-76px)] bg-cream px-6 py-12 selection:bg-mango selection:text-ink">
      <div className="max-w-xl mx-auto space-y-8">

        {/* Title */}
        <div className="space-y-1">
          <h1 className="text-4xl font-display uppercase tracking-tight text-ink">
            Live Tracking 🚚
          </h1>
          <p className="font-semibold text-ink/60">
            Real-time updates on your delicious delivery
          </p>
        </div>

        {order ? (
          <div className="neo-card bg-white p-6 md:p-8 space-y-6 hover:rotate-0.5 transition-transform relative">

            {/* Simulation Controller overlay */}
            <div className="flex justify-between items-center bg-cream border-2 border-ink p-3 rounded-xl">
              <span className="font-bold text-xs uppercase text-ink/60">
                {isSimulating ? "⚡ Simulating movement..." : "Simulator Tool"}
              </span>
              <button
                onClick={startSimulation}
                disabled={isSimulating || status === "DELIVERED"}
                className="neo-btn neo-btn-mango px-3 py-1.5 text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === "DELIVERED" ? "Completed" : "Start Simulation 🛵"}
              </button>
            </div>

            <div className="flex justify-between items-center border-b-3 border-ink pb-4">
              <h2 className="text-2xl font-display uppercase text-ink">
                Order #{order.orderId}
              </h2>
              <span className="bg-mango border-2 border-ink px-3 py-1 font-bold text-xs uppercase shadow-[2px_2px_0px_0px_rgba(25,20,15,1)]">
                {status}
              </span>
            </div>

            {/* Visual Timeline Tracker */}
            <div className="space-y-4 pt-2">
              <h3 className="font-bold text-sm uppercase text-ink/50 tracking-wider">
                Delivery Progress
              </h3>
              <div className="flex flex-col gap-4">
                {[
                  { label: "Order Placed 📝", statusName: "PLACED" },
                  { label: "Preparing Food 🍳", statusName: "PREPARING" },
                  { label: "Out for Delivery 🛵", statusName: "OUT_FOR_DELIVERY" },
                  { label: "Delivered 🎉", statusName: "DELIVERED" }
                ].map((stage, idx) => {
                  const isDone = idx <= currentIndex;
                  const isCurrent = idx === currentIndex;
                  return (
                    <div key={idx} className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full border-3 border-ink flex items-center justify-center font-bold text-sm shadow-[2px_2px_0px_0px_rgba(25,20,15,1)] ${
                        isDone ? "bg-basil text-white" : "bg-white text-ink/30"
                      } ${isCurrent ? "animate-pulse ring-4 ring-mango/30" : ""}`}>
                        {isDone ? "✓" : idx + 1}
                      </div>
                      <span className={`font-bold text-lg ${
                        isDone ? "text-ink" : "text-ink/30"
                      } ${isCurrent ? "text-chili underline decoration-mango decoration-3" : ""}`}>
                        {stage.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Details Box */}
            <div className="border-3 border-ink rounded-xl p-4 bg-cream/30 space-y-2.5 text-sm font-bold">
              <div className="flex justify-between">
                <span className="text-ink/60">Delivery Address:</span>
                <span className="text-ink text-right">{order.deliveryAddress}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink/60">Amount Paid:</span>
                <span className="text-chili text-lg">₹ {order.totalAmount}</span>
              </div>
              <div className="flex justify-between border-t-2 border-dashed border-ink/10 pt-2.5 text-xs text-ink/40">
                <span>Rider Coordinates:</span>
                <span>
                  {liveUpdate?.lat !== undefined ? liveUpdate.lat : (order.deliveryLat || "N/A")}, {liveUpdate?.lng !== undefined ? liveUpdate.lng : (order.deliveryLng || "N/A")}
                </span>
              </div>
            </div>

          </div>
        ) : (
          <div className="neo-card bg-white p-12 text-center">
            <span className="text-5xl block mb-4 animate-spin">🔄</span>
            <h3 className="text-2xl font-display uppercase mb-2">Loading Order...</h3>
            <p className="font-semibold text-ink/60">Fetching tracking information from the server.</p>
          </div>
        )}

      </div>
    </div>
  );
}

export default TrackingPage;