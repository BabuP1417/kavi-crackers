// src/components/CartPage.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    address: "",
    city: "",
    state: "",
  });
  const [msg, setMsg] = useState("");
  const [checkout, setCheckout] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(stored);
  }, []);

  function updateCart(newCart) {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("storage"));
  }

  function increaseQty(id) {
    const newCart = cart.map((item) =>
      item._id === id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
    );
    updateCart(newCart);
  }

  function decreaseQty(id) {
    const newCart = cart
      .map((item) =>
        item._id === id
          ? { ...item, quantity: Math.max(1, (item.quantity || 1) - 1) }
          : item
      )
      .filter((item) => item.quantity > 0);
    updateCart(newCart);
  }

  function removeItem(id) {
    const newCart = cart.filter((item) => item._id !== id);
    updateCart(newCart);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const total = cart.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  function handleCheckout(e) {
    e.preventDefault();
    if (cart.length === 0) {
      setMsg("Cart is empty!");
      return;
    }

    const WHATSAPP_NUMBER = "917010699418"; // replace with your WhatsApp number

    // Build product list
    let productLines = "";
    cart.forEach((p, idx) => {
      const qty = p.quantity || 1;
      const itemTotal = p.price * qty;
      productLines += `${idx + 1}. ${p.name} - ₹${p.price} x ${qty} = ₹${itemTotal}\n`;
    });

    // Build full message
    const textLines = [
      `*New Cart Order*`,
      ``,
      productLines,
      `*Total:* ₹${total}`,
      ``,
      `*Customer Info:*`,
      `Name: ${form.name}`,
      `Mobile: ${form.mobile}`,
      `Address: ${form.address}, ${form.city}, ${form.state}`,
      ``,
      `-- Sent from Kavi Crackers`,
    ];

    const message = encodeURIComponent(textLines.join("\n"));
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

    window.open(url, "_blank");

    setMsg("WhatsApp opened. Please press Send to complete order.");
    setForm({ name: "", mobile: "", address: "", city: "", state: "" });
    setCart([]);
    localStorage.removeItem("cart");
    setCheckout(false);

    setTimeout(() => {
      navigate("/");
    }, 1500);
  }

  if (cart.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-700">
          🛒 Your Cart is Empty
        </h2>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-6 space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 border-b pb-3">
        Shopping Cart
      </h2>

      {/* Cart Items */}
      {cart.map((item) => (
        <div
          key={item._id}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b py-4"
        >
          {/* Image + Info */}
          <div className="flex gap-4 items-center flex-1">
            <img
              src={`https://kavi-backend-64wb.onrender.com${item.imageUrl}`}
              alt={item.name}
              className="w-20 h-20 object-cover rounded-lg shadow"
            />
            <div>
              <h3 className="font-semibold text-lg">{item.name}</h3>
              <p className="text-sm text-gray-500">{item.title}</p>
              <p className="text-rose-600 font-bold mt-1">₹{item.price}</p>
            </div>
          </div>

          {/* Qty + Total + Remove */}
          <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
            <div className="flex items-center border rounded-lg shadow-sm">
              <button
                onClick={() => decreaseQty(item._id)}
                className="px-3 py-1 text-gray-600 hover:bg-gray-100"
              >
                -
              </button>
              <span className="px-4">{item.quantity || 1}</span>
              <button
                onClick={() => increaseQty(item._id)}
                className="px-3 py-1 text-gray-600 hover:bg-gray-100"
              >
                +
              </button>
            </div>
            <div className="font-semibold text-gray-700 min-w-[70px] text-center">
              ₹{item.price * (item.quantity || 1)}
            </div>
            <button
              onClick={() => removeItem(item._id)}
              className="text-red-500 hover:text-red-700 text-xl"
              title="Remove"
            >
              ✕
            </button>
          </div>
        </div>
      ))}

      {/* Total */}
      <div className="flex justify-between items-center text-xl font-bold bg-gray-50 p-4 rounded-lg">
        <span>Total:</span>
        <span className="text-rose-600">₹{total}</span>
      </div>

      {/* Checkout */}
      {!checkout ? (
        <div className="flex justify-end">
          <button
            onClick={() => setCheckout(true)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg shadow hover:bg-green-700 transition text-lg"
          >
            Proceed to Checkout
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleCheckout}
          className="space-y-4 bg-gray-50 p-6 rounded-lg shadow-inner"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Customer Details
          </h3>
          <input
            name="name"
            value={form.name}
            onChange={(e) => {
              const value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
              setForm({ ...form, name: value });
            }}
            placeholder="Full Name"
            required
            className="w-full p-3 border rounded-lg"
          />

          <input
            name="mobile"
            value={form.mobile}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 10);
              setForm({ ...form, mobile: value });
            }}
            placeholder="Mobile Number"
            required
            className="w-full p-3 border rounded-lg"
            maxLength={10}
          />

          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Address"
            required
            className="w-full p-3 border rounded-lg"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="City"
              required
              className="w-full p-3 border rounded-lg"
            />
            <input
              name="state"
              value={form.state}
              onChange={handleChange}
              placeholder="State"
              required
              className="w-full p-3 border rounded-lg"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg shadow hover:bg-green-700 text-lg"
          >
            Send Order via WhatsApp
          </button>
        </form>
      )}

      {msg && (
        <div className="text-sm text-green-600 font-medium text-center">
          {msg}
        </div>
      )}
    </div>
  );
}
