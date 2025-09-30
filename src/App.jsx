import React, { useState, useEffect } from "react";
import CrackerList from "./components/CrackerList";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import CartPage from "./components/CartPage";
import BuyNowPage from "./components/BuyNowPage";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Header() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  // check admin login
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    setIsAdmin(!!token);
  }, []);

  // update cart count
  useEffect(() => {
    function updateCart() {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartCount(cart.length); // count items, not quantity
    }
    updateCart();
    window.addEventListener("storage", updateCart);
    return () => window.removeEventListener("storage", updateCart);
  }, []);

  function handleLogout() {
    localStorage.removeItem("admin_token");
    setIsAdmin(false);
    navigate("/");
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo + Title */}
        <Link to="/" className="flex items-center space-x-3">
          <img
            src="/logo.jpg"
            alt="Logo"
            className="h-12 w-12 rounded-full object-cover shadow-md"
          />
          <span className="text-2xl font-extrabold tracking-wide text-rose-600">
            Kavi Thuraiyur Crackers
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center space-x-6">
          {!isAdmin ? (
            <>
              {/* Cart Icon */}
              <Link to="/cart" className="relative group">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 text-gray-700 group-hover:text-rose-600 transition"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m13-9l2 9m-5-9V6a2 2 0 10-4 0v7m-4 0h8"
                  />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-rose-600 text-white text-xs font-semibold rounded-full px-2 py-0.5 shadow">
                    {cartCount}
                  </span>
                )}
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-rose-600 text-white text-sm font-medium rounded-lg shadow hover:bg-rose-700 transition"
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
        <Header />

        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<CrackerList />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/buy-now" element={<BuyNowPage />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </main>

        <footer className="text-center py-8 text-sm text-gray-500">
          © {new Date().getFullYear()} Kavi Thuraiyur Crackers
        </footer>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored" // options: light, dark, colored
      />
    </BrowserRouter>
  );
}
