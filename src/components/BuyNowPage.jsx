// BuyNowPage.jsx (replace handleSubmit with this)
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function BuyNowPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { product } = location.state || {};

  const [form, setForm] = useState({ name: "", mobile: "", address: "", city: "", state: "" });
  const [msg, setMsg] = useState("");

  if (!product) return <div>Product not found.</div>;

  const WHATSAPP_NUMBER = "916380362354"; // <- put your number here

  function handleChange(e) {
    const { name, value } = e.target;
    if (name === "name") {
      setForm(prev => ({ ...prev, name: value.replace(/[^A-Za-z\s]/g, "") }));
    } else if (name === "mobile") {
      setForm(prev => ({ ...prev, mobile: value.replace(/\D/g, "").slice(0, 10) }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    // Build message text
    const textLines = [
      `*New Order*`,
      ``,
      `*Product:* ${product.name}`,
      `*Price:* ₹${product.price}`,
      `*Title:* ${product.title || "-"}`,
      ``,
      `*Customer Details:*`,
      `Name: ${form.name || "-"}`,
      `Mobile: ${form.mobile || "-"}`,
      `Address: ${form.address || "-"}`,
      `City: ${form.city || "-"}`,
      `State: ${form.state || "-"}`,
      ``,
      `-- Sent from Kavi Crackers`
    ];

    const message = encodeURIComponent(textLines.join("\n"));

    // wa.me link: open in new tab/window
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

    // open WhatsApp (web/app). The user needs to press send.
    window.open(url, "_blank");

    // Optionally show confirmation, clear form, and redirect
    setMsg("WhatsApp window opened. Press Send to complete order.");
    setForm({ name: "", mobile: "", address: "", city: "", state: "" });

    // optional: navigate("/") after short delay
    setTimeout(() => navigate("/"), 1500);
  }

  return (
    /* same JSX as before but using handleChange and handleSubmit */
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow space-y-4">
      <h2 className="text-xl font-bold">Buy Now (WhatsApp)</h2>

      {/* product block */}
      <div className="border p-2 rounded flex items-center gap-4">
        <img 
        // src={`https://kavi-backend-64wb.onrender.com${product.imageUrl}`}
        src={product.imageUrl} 
        alt={product.name} 
        className="w-20 h-20 object-cover rounded" />
        <div>
          <h3 className="font-semibold">{product.name}</h3>
          <p className="text-rose-600 font-bold">₹{product.price}</p>
        </div>
      </div>

      <form className="space-y-3" onSubmit={handleSubmit}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" required className="w-full p-2 border rounded" />
        <input name="mobile" value={form.mobile} onChange={handleChange} placeholder="Mobile Number" required className="w-full p-2 border rounded" />
        <input name="address" value={form.address} onChange={handleChange} placeholder="Address" required className="w-full p-2 border rounded" />
        <input name="city" value={form.city} onChange={handleChange} placeholder="City" required className="w-full p-2 border rounded" />
        <input name="state" value={form.state} onChange={handleChange} placeholder="State" required className="w-full p-2 border rounded" />
        <button type="submit" className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">Send to WhatsApp</button>
      </form>

      {msg && <div className="text-sm text-rose-600">{msg}</div>}
    </div>
  );
}
