import { Link } from "react-router-dom";
import { useState } from "react";

function LandingPage() {
  const [tiltStyle, setTiltStyle] = useState({});

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    
    const degX = -(y / (box.height / 2)) * 12;
    const degY = (x / (box.width / 2)) * 12;
    
    setTiltStyle({
      transform: `perspective(1000px) rotateX(${degX}deg) rotateY(${degY}deg) scale3d(1.03, 1.03, 1.03)`,
      transition: "transform 0.1s ease-out",
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
      transition: "transform 0.3s ease-out",
    });
  };

  return (
    <div className="min-h-[calc(100vh-76px)] bg-cream selection:bg-mango selection:text-ink">
      
      {/* Hero Section */}
      <header className="max-w-7xl mx-auto px-6 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Heading & Text */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-block bg-mango border-3 border-ink px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider rotate-[-1.5deg] shadow-[2px_2px_0px_0px_#19140f] animate-pulse">
            ⚡️ FASTEST DELIVERY IN TOWN ⚡️
          </div>
          
          <h1 className="text-5xl md:text-7.5xl font-display uppercase leading-none tracking-tight text-ink">
            CRAVE IT.<br />
            CLICK IT.<br />
            <span className="text-chili inline-block relative">
              GET IT.
              <span className="absolute left-0 bottom-1 w-full h-3 bg-mango -z-10 transform -rotate-1"></span>
            </span>
          </h1>
          
          <p className="text-lg md:text-xl font-medium text-ink/80 max-w-xl leading-relaxed">
            Order your favorite meals from top-rated kitchens and watch them slide straight to your doorstep. Hot, fresh, and double the flavor.
          </p>
          
          <div className="flex flex-wrap gap-4 pt-4">
            <Link to="/">
              <button className="neo-btn neo-btn-chili text-lg px-8 py-4 font-bold">
                Order Now 🍕
              </button>
            </Link>
            
            <Link to="/login">
              <button className="neo-btn neo-btn-white text-lg px-8 py-4 font-bold">
                Login 🔐
              </button>
            </Link>
          </div>

          <div className="flex items-center gap-6 pt-6 text-sm font-bold">
            <div className="flex items-center gap-1.5">
              <span className="text-lg">⭐</span>
              <span>4.9/5 Rating</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-ink/40"></div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg">🚀</span>
              <span>20 Min Average Delivery</span>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Interactive Card */}
        <div className="lg:col-span-5 flex justify-center">
          <div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={tiltStyle}
            className="neo-card bg-mango w-full max-w-[420px] aspect-square flex items-center justify-center p-8 cursor-pointer relative overflow-hidden select-none group"
          >
            {/* Visual background details */}
            <div className="absolute inset-4 border-2 border-dashed border-ink/20 rounded-lg pointer-events-none"></div>
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-[#fff3d4] rounded-full filter blur-2xl opacity-60 pointer-events-none group-hover:scale-110 transition-transform duration-500"></div>
            
            {/* Floating emojis inside the card space */}
            <span className="absolute top-10 left-10 text-3xl animate-bounce select-none pointer-events-none" style={{ animationDuration: "2.5s" }}>🍟</span>
            <span className="absolute bottom-12 right-10 text-3xl animate-bounce select-none pointer-events-none" style={{ animationDuration: "3s", animationDelay: "0.5s" }}>🥤</span>
            <span className="absolute top-1/4 right-8 text-3xl animate-bounce select-none pointer-events-none" style={{ animationDuration: "3.5s", animationDelay: "1s" }}>🌮</span>

            {/* Main 3D Minimalist Food Asset */}
            <div className="w-4/5 h-4/5 flex items-center justify-center relative z-10">
              <img
                src="/minimal_food_3d.png"
                alt="3D Burger"
                className="w-full h-full object-contain animate-float drop-shadow-[0_15px_30px_rgba(25,20,15,0.25)] pointer-events-none group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>

      </header>

      {/* Marquee Banner */}
      <section className="bg-ink py-4 text-white overflow-hidden whitespace-nowrap border-y-4 border-ink relative flex z-20">
        <div className="flex animate-marquee text-xl md:text-2xl font-display uppercase tracking-widest gap-8">
          <span>🔥 FRESHLY PREPARED • DELIVERED PIPING HOT • 100% SATISFACTION GUARANTEED • ORDER NOW 🔥</span>
          <span>🔥 FRESHLY PREPARED • DELIVERED PIPING HOT • 100% SATISFACTION GUARANTEED • ORDER NOW 🔥</span>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-display uppercase tracking-tight text-ink mb-4">
            Why BiteDash?
          </h2>
          <p className="font-semibold text-ink/70">
            We aren't just another food app. We make ordering food an adventure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <div className="neo-card bg-[#fff5f5] p-8 hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(25,20,15,1)] transition-all duration-200">
            <div className="w-16 h-16 rounded-xl bg-chili border-3 border-ink flex items-center justify-center text-3xl shadow-[3px_3px_0px_0px_rgba(25,20,15,1)] mb-6">
              🚀
            </div>
            <h3 className="text-2xl font-display uppercase mb-3 text-ink">Super Fast</h3>
            <p className="font-medium text-ink/80 leading-relaxed">
              Our riders fly like lasers. Get your food hot and fresh at your door in under 20 minutes flat.
            </p>
          </div>

          {/* Card 2 */}
          <div className="neo-card bg-[#fffdf0] p-8 hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(25,20,15,1)] transition-all duration-200">
            <div className="w-16 h-16 rounded-xl bg-mango border-3 border-ink flex items-center justify-center text-3xl shadow-[3px_3px_0px_0px_rgba(25,20,15,1)] mb-6">
              🍳
            </div>
            <h3 className="text-2xl font-display uppercase mb-3 text-ink">Top Kitchens</h3>
            <p className="font-medium text-ink/80 leading-relaxed">
              Curated local favorites and five-star cuisines. Only high-grade foods enter our delivery containers.
            </p>
          </div>

          {/* Card 3 */}
          <div className="neo-card bg-[#f6f3ff] p-8 hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(25,20,15,1)] transition-all duration-200">
            <div className="w-16 h-16 rounded-xl bg-grape border-3 border-ink flex items-center justify-center text-3xl shadow-[3px_3px_0px_0px_rgba(25,20,15,1)] mb-6">
              💸
            </div>
            <h3 className="text-2xl font-display uppercase mb-3 text-ink">Zero Minimum</h3>
            <p className="font-medium text-ink/80 leading-relaxed">
              Craving just a single boba or fries? Order exactly what you want with no annoying delivery minimums.
            </p>
          </div>

        </div>
      </section>
      
    </div>
  );
}

export default LandingPage;