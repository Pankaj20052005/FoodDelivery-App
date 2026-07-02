import { useContext } from "react";
import { CartContext } from "./context/CartContext";
import { Link } from "react-router-dom";

function CartPage() {

  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useContext(CartContext);

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[calc(100vh-76px)] bg-cream px-6 py-12 flex flex-col items-center justify-center selection:bg-mango selection:text-ink">
        <div className="neo-card bg-white p-10 text-center max-w-md w-full relative">
          <div className="absolute -top-6 -right-4 bg-mango border-3 border-ink px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider rotate-[3deg] shadow-[2px_2px_0px_0px_#19140f]">
            Empty! 
          </div>
          <span className="text-6xl block mb-4 animate-bounce">🛒</span>
          <h2 className="text-3xl font-display uppercase mb-3">Your Cart is Empty</h2>
          <p className="font-semibold text-ink/65 mb-6">Looks like you haven't added any delicacies to your plate yet.</p>
          <Link to="/">
            <button className="neo-btn neo-btn-chili px-6 py-3.5 text-md font-bold">
              Explore Menu 🍕
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
            Your Cart 🛒
          </h1>
          <p className="font-semibold text-ink/60">
            Review your order before proceeding to checkout.
          </p>
        </div>

        {/* Cart Item List */}
        <div className="space-y-6">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="neo-card bg-white p-5 flex flex-col sm:flex-row items-center justify-between gap-6 hover:shadow-[8px_8px_0px_0px_rgba(25,20,15,1)] transition-all duration-200"
            >
              <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
                <img
                  src={item.imageUrl || "https://images.unsplash.com/photo-1504674900247-0877df9cc836"}
                  alt={item.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl border-3 border-ink bg-cream"
                />

                <div className="text-center sm:text-left space-y-2">
                  <span className="inline-block bg-[#fff5f5] text-chili border-2 border-ink px-2.5 py-0.5 rounded font-bold text-xs uppercase shadow-[1px_1px_0px_0px_rgba(25,20,15,1)]">
                    {item.category}
                  </span>
                  
                  <h2 className="text-2xl font-display uppercase leading-none text-ink">
                    {item.name}
                  </h2>

                  <div className="flex items-center justify-center sm:justify-start gap-4">
                    <span className="text-xl font-display text-chili">
                      ₹ {item.price}
                    </span>
                    <span className="text-xs font-bold text-ink/40">|</span>
                    <span className="text-sm font-bold text-ink/60">
                      Subtotal: ₹ {item.price * item.quantity}
                    </span>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-6 justify-between w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0 border-ink/10">
                
                {/* Quantity Toggles */}
                <div className="flex items-center gap-3 bg-cream border-3 border-ink px-2.5 py-1.5 rounded-xl shadow-[2px_2px_0px_0px_#19140f]">
                  <button
                    onClick={() => decreaseQuantity(item.cartItemId, item.quantity)}
                    className="w-8 h-8 rounded-lg bg-white border-2 border-ink font-bold flex items-center justify-center hover:bg-chili hover:text-white transition-colors cursor-pointer text-sm"
                  >
                    -
                  </button>

                  <span className="text-lg font-display px-2 min-w-8 text-center text-ink">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => increaseQuantity(item.cartItemId, item.quantity)}
                    className="w-8 h-8 rounded-lg bg-white border-2 border-ink font-bold flex items-center justify-center hover:bg-basil hover:text-white transition-colors cursor-pointer text-sm"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(item.cartItemId)}
                  className="neo-btn neo-btn-chili px-4 py-2 text-xs font-bold"
                >
                  Remove ❌
                </button>

              </div>
            </div>
          ))}
        </div>

        {/* Order Summary & Checkout Box */}
        <div className="neo-card bg-mango p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-[8px_8px_0px_0px_rgba(25,20,15,1)]">
          <div className="text-center md:text-left space-y-1">
            <span className="text-sm font-bold text-ink/70 uppercase tracking-wide">
              Grand Total
            </span>
            <div className="text-3xl md:text-4.5xl font-display text-ink leading-none">
              ₹ {totalPrice}
            </div>
          </div>

          <Link to="/checkout" className="w-full md:w-auto">
            <button className="w-full neo-btn neo-btn-white text-lg px-8 py-4 font-bold flex items-center justify-center gap-2">
              Proceed to Checkout 🚀
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}

export default CartPage;