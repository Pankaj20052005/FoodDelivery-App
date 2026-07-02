import { useState } from "react";
import API from "../api/axios";
import { Link, useNavigate } from "react-router-dom";


function LoginPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const response = await API.post("/api/auth/login", {
        email,
        password,
      });

      console.log("Login response:", response.data);

      const token =
        response.data.token || response.data.jwt;

      console.log("Token:", token);

      if (token) {

        localStorage.setItem("token", token);

        localStorage.setItem(
          "userId",
          response.data.userId
        );

        alert("Login successful");

        window.location.href = "/";

      }else {

        alert(response.data.message || "Login failed");

      }

    } catch (error) {

      console.log(error);

      alert("Login failed");
    }
  };

  return (
    <div className="min-h-[calc(100vh-76px)] flex items-center justify-center bg-cream px-6 py-12 selection:bg-mango selection:text-ink">
      <div className="neo-card bg-white p-8 md:p-10 max-w-md w-full relative hover:-rotate-1 transition-transform">
        
        {/* Floating Accent Badge */}
        <div className="absolute -top-6 -right-4 bg-mango border-3 border-ink px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider rotate-[4deg] shadow-[2px_2px_0px_0px_#19140f]">
          Welcome Back! 👋
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-display uppercase tracking-tight text-ink">
              Login 🔐
            </h1>
            <p className="font-semibold text-sm text-ink/60">
              Enter your credentials to access BiteDash
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-ink mb-1.5 uppercase">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                required
                className="w-full border-3 border-ink px-4 py-3 rounded-xl font-bold bg-cream focus:outline-none focus:bg-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-ink mb-1.5 uppercase">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                required
                className="w-full border-3 border-ink px-4 py-3 rounded-xl font-bold bg-cream focus:outline-none focus:bg-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full neo-btn neo-btn-grape py-3.5 text-lg font-bold mt-2"
          >
            Login to Account 🚀
          </button>

          <p className="text-center font-bold text-sm text-ink/75 pt-2">
            New to BiteDash?{" "}
            <Link to="/signup" className="text-chili underline hover:text-chili/80">
              Create an Account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;