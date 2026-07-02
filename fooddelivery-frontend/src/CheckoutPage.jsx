import { useContext, useState, useEffect } from "react";
import { CartContext } from "./context/CartContext";
import { useNavigate, Link } from "react-router-dom";
import API from "./api/axios";

function CheckoutPage() {
  const { cartItems, setCartItems } = useContext(CartContext);
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Dynamically load Razorpay SDK Script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePaymentAndCheckout = async () => {
    if (!address || !phone) return;
    setIsProcessing(true);

    try {
      // Step 1: Request backend to create a Razorpay Order
      const orderIntentResponse = await API.post("/api/payments/create-order", {
        amount: totalPrice,
      });

      const { razorpayOrderId, amount, currency, keyId } = orderIntentResponse.data;

      // Step 2: Configure Razorpay Checkout Modal options
      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: "BiteDash App",
        description: "Payment for order food cart items",
        order_id: razorpayOrderId,
        handler: async function (response) {
          // Callback triggers on payment success
          try {
            // Step 3: Send order information along with payment signature verification info
            const placeOrderResponse = await API.post("/api/orders/place", {
              userId: Number(localStorage.getItem("userId")),
              deliveryAddress: address,
              splitUpiIds: [],
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            });

            console.log("Order verified and placed:", placeOrderResponse.data);
            alert("Payment Verified & Order Placed Successfully! 🎉");
            setCartItems([]);

            // Redirect to tracking page
            if (placeOrderResponse.data && placeOrderResponse.data.orderId) {
              navigate(`/tracking/${placeOrderResponse.data.orderId}`);
            } else {
              navigate("/");
            }
          } catch (err) {
            console.error("Order placement failed after payment:", err);
            alert("Verification failed. Please contact support with payment ID: " + response.razorpay_payment_id);
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: "BiteDash Customer",
          contact: phone,
        },
        theme: {
          color: "#6f4fe0", // Custom Grape Purple to match your styling
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            console.log("Payment window closed by user");
          },
        },
      };

      // Step 3: Open Razorpay modal overlay
      const rzpInstance = new window.Razorpay(options);
      rzpInstance.open();

    } catch (error) {
      console.error("Failed to initialize payment process:", error);
      alert("Payment initialization error. Check your connection.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-76px)] bg-cream px-6 py-12 selection:bg-mango selection:text-ink">
      <div className="max-w-xl mx-auto space-y-8">

        <div className="space-y-1">
          <h1 className="text-4xl font-display uppercase tracking-tight text-ink">
            Checkout 💳
          </h1>
          <p className="font-semibold text-ink/60">
            Secure Payment through Razorpay
          </p>
        </div>

        <div className="neo-card bg-white p-6 md:p-8 space-y-6">

          <div className="border-3 border-ink rounded-xl p-4 bg-cream/30 space-y-3">
            <h3 className="text-lg font-display uppercase border-b-2 border-ink pb-2 text-ink">
              Order Summary
            </h3>

            <div className="space-y-2.5 max-h-40 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-sm font-bold">
                  <span className="text-ink/80">
                    {item.name} <span className="text-xs text-ink/50">x{item.quantity}</span>
                  </span>
                  <span className="text-ink">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center border-t-2 border-ink pt-3 font-display text-lg text-chili">
              <span>Grand Total</span>
              <span>₹{totalPrice}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-ink mb-1.5 uppercase">
                Delivery Address
              </label>
              <input
                type="text"
                placeholder="Flat No, Street Name, Landmark..."
                required
                className="w-full border-3 border-ink px-4 py-3 rounded-xl font-bold bg-cream focus:outline-none focus:bg-white"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                disabled={isProcessing}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-ink mb-1.5 uppercase">
                Phone Number
              </label>
              <input
                type="text"
                placeholder="10-digit mobile number"
                required
                className="w-full border-3 border-ink px-4 py-3 rounded-xl font-bold bg-cream focus:outline-none focus:bg-white"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isProcessing}
              />
            </div>
          </div>

          <button
            onClick={handlePaymentAndCheckout}
            disabled={!address || !phone || isProcessing}
            className="w-full neo-btn neo-btn-basil py-3.5 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? "Processing Payment..." : "Pay & Place Order 🚀"}
          </button>

        </div>

      </div>
    </div>
  );
}

export default CheckoutPage;