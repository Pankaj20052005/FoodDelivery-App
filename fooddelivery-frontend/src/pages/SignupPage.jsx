import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post("/api/auth/register", {
        name,
        email,
        password,
      });

      alert(response.data);

      if (response.data === "User registered successfully") {
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
      alert("Signup failed");
    }
  };

  return (
    <div className="min-h-[calc(100vh-76px)] flex items-center justify-center bg-cream px-6 py-12 selection:bg-mango selection:text-ink">
      <div className="neo-card bg-white p-8 md:p-10 max-w-md w-full relative hover:rotate-1 transition-transform">
        
        {/* Floating Accent Badge */}
        <div className="absolute -top-6 -left-4 bg-chili border-3 border-ink px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider rotate-[-4deg] text-white shadow-[2px_2px_0px_0px_#19140f]">
          Join BiteDash 🍕
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-display uppercase tracking-tight text-ink">
              Sign Up 📝
            </h1>
            <p className="font-semibold text-sm text-ink/60">
              Create a free account and start ordering
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-ink mb-1.5 uppercase">
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                required
                className="w-full border-3 border-ink px-4 py-3 rounded-xl font-bold bg-cream focus:outline-none focus:bg-white"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

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
            className="w-full neo-btn neo-btn-mango py-3.5 text-lg font-bold mt-2"
          >
            Create Account 🚀
          </button>

          <p className="text-center font-bold text-sm text-ink/75 pt-2">
            Already have an account?{" "}
            <Link to="/login" className="text-chili underline hover:text-chili/80">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;