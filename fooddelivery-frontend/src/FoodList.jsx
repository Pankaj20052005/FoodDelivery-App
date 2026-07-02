import { useEffect, useState } from "react";
import API from "./api/axios";
import { useContext } from "react";
import { CartContext } from "./context/CartContext";

function FoodList() {
  const [foods, setFoods] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    API.get("/api/food")
      .then((res) => {
        setFoods(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const categories = ["All", ...new Set(foods.map((food) => food.category).filter(Boolean))];

  const filteredFoods = foods.filter((food) => {
    const matchesSearch =
      food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      food.restaurantName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || food.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-cream px-6 py-12">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Title */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-display uppercase tracking-tight text-ink">
            Crafted <span className="text-chili">Delights</span> 🍕
          </h1>
          <p className="font-semibold text-ink/70">
            Fresh ingredients, curated recipes, delivered to your door.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col md:flex-row gap-6 justify-between items-center bg-white border-4 border-ink p-6 rounded-2xl shadow-[4px_4px_0px_0px_#19140f]">
          <div className="w-full md:w-1/3 relative">
            <input
              type="text"
              placeholder="Search dishes or restaurants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border-3 border-ink px-4 py-3 rounded-xl font-bold bg-cream focus:outline-none focus:bg-white"
            />
            <span className="absolute right-4 top-3.5 text-xl">🔍</span>
          </div>

          <div className="flex flex-wrap gap-2.5 w-full md:w-auto justify-start md:justify-end">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`neo-btn text-sm px-4 py-2 font-bold ${
                  selectedCategory === category
                    ? "bg-grape text-white"
                    : "bg-white text-ink"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Food Grid */}
        {filteredFoods.length === 0 ? (
          <div className="neo-card bg-white p-12 text-center">
            <span className="text-5xl block mb-4">🤷‍♂️</span>
            <h3 className="text-2xl font-display uppercase mb-2">No Foods Found</h3>
            <p className="font-semibold text-ink/60">Try searching for something else or changing the filter!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFoods.map((food) => (
              <div
                key={food.id}
                className="neo-card bg-white hover:-translate-y-2 hover:shadow-[10px_10px_0px_0px_rgba(25,20,15,1)] transition-all duration-200 flex flex-col overflow-hidden"
              >
                {/* Image Wrap */}
                <div className="relative border-b-4 border-ink h-48 w-full bg-cream">
                  <img
                    src={food.imageUrl || "https://images.unsplash.com/photo-1504674900247-0877df9cc836"}
                    alt={food.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-mango border-2 border-ink px-2.5 py-1 rounded font-bold text-xs uppercase shadow-[2px_2px_0px_0px_rgba(25,20,15,1)]">
                    {food.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h2 className="text-2xl font-display uppercase leading-tight text-ink">
                        {food.name}
                      </h2>
                    </div>
                    <p className="font-bold text-sm text-ink/60">
                      🧑‍🍳 {food.restaurantName}
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-2xl font-display text-chili">
                      ₹ {food.price}
                    </span>
                    <button
                      onClick={() => addToCart(food)}
                      className="neo-btn neo-btn-white px-4 py-2.5 text-sm font-bold"
                    >
                      Add To Cart 🛒
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default FoodList;