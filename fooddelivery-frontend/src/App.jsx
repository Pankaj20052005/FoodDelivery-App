import { Routes, Route } from "react-router-dom";
import FoodList from "./FoodList";
import Navbar from "./Navbar";
import CartPage from "./CartPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import CheckoutPage from "./CheckoutPage";
import SignupPage from "./pages/SignupPage";
import TrackingPage from "./TrackingPage";
import LandingPage from "./pages/LandingPage";
import OrdersPage from "./pages/OrdersPage";


function App() {
  return (
    <div>
      <Navbar />

      <Routes>

        <Route path="/" element={<FoodList />} />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />

        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />

        <Route path="/signup" element={<SignupPage />} />

        <Route
          path="/tracking/:orderId"
          element={
            <ProtectedRoute>
              <TrackingPage />
            </ProtectedRoute>
          }
        />

        <Route path="/landing" element={<LandingPage />} />

        <Route
           path="/orders"
             element={<ProtectedRoute><OrdersPage /></ProtectedRoute>}
        />
      </Routes>
    </div>
  );
}

export default App;