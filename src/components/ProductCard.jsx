import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function ProductCard({ item }) {
  function handleAddToCart() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const existing = cart.find((p) => p._id === item._id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
     toast.success(`${item.name} added to cart 🛒`, {
    position: "top-right",
    autoClose: 2000,
  });
  }
const navigate = useNavigate();

  function handleBuyNow() {
  navigate("/buy-now", { state: { product: item } });
}

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <img
        src={`https://kavi-backend-64wb.onrender.com/uploads/${item.imageUrl}`}
        alt={item.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold text-lg">{item.name}</h3>
        <p className="text-sm text-gray-500">{item.title}</p>
        <div className="mt-2 flex items-center justify-between">
          <div className="text-xl font-bold">₹{item.price}</div>
        </div>

        {/* Buttons Row */}
        <div className="mt-3 flex space-x-2">
          <button
            onClick={handleAddToCart}
            className="flex-1 px-3 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded text-sm"
          >
            Add to Cart
          </button>
          <button
            onClick={handleBuyNow}
            className="flex-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded text-sm"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
