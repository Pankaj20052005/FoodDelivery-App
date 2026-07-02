import { useContext } from "react";
import { CartContext } from "./context/CartContext";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {

  const { cartItems } = useContext(CartContext);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleLogout = () => {

    localStorage.removeItem("token");

    alert("Logged out successfully");

    navigate("/login");
  };

  return (
    <nav className="bg-white border-b-4 border-ink px-8 py-4 flex justify-between items-center sticky top-0 z-50">

      <Link to="/landing">
        <div className="flex items-center gap-2 cursor-pointer hover:-rotate-1 transition-transform">
          <span className="text-3xl">🍔</span>
          <h1 className="text-2xl font-display uppercase tracking-tight text-ink">
            Bite<span className="text-chili">Dash</span>
          </h1>
        </div>
      </Link>

      <div className="flex items-center gap-6">

        <Link to="/">
          <span className="font-bold text-ink hover:text-chili transition-colors hidden sm:inline-block">
            Explore Menu
          </span>
        </Link>

        <Link to="/orders">
           <span className="font-bold text-ink hover:text-chili transition-colors hidden sm:inline-block">
               My Orders
           </span>
        </Link>

        <Link to="/cart">
          <div className="neo-btn neo-btn-white px-4 py-2 text-sm flex items-center gap-2">
            <span>🛒</span>
            <span className="font-bold">Cart ({cartItems.length})</span>
          </div>
        </Link>

        {token ? (
          <button
            onClick={handleLogout}
            className="neo-btn neo-btn-chili px-4 py-2 text-sm"
          >
            Logout
          </button>
        ) : (
          <Link to="/login">
            <button className="neo-btn neo-btn-grape px-4 py-2 text-sm">
              Login
            </button>
          </Link>
        )}

      </div>

    </nav>
  );
}

export default Navbar;