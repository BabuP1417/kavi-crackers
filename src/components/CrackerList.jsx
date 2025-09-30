import React, { useState, useEffect } from "react";
import API from "../api";
import ProductCard from "./ProductCard";

export default function CrackerList() {
  const [titleFilter, setTitleFilter] = useState("");
  const [items, setItems] = useState([]);
  const [titles, setTitles] = useState([]);

  useEffect(() => {
    fetchTitles();
    fetchItems();
  }, []);

  async function fetchTitles() {
    // fetch all and reduce titles (simple approach)
    const res = await API.get("/crackers");
    const list = res.data || [];
    const uniq = [...new Set(list.map((i) => i.title))];
    setTitles(uniq);
  }

  async function fetchItems(selectedTitle) {
    const q = selectedTitle
      ? `?title=${encodeURIComponent(selectedTitle)}`
      : "";
    const res = await API.get(`/crackers${q}`);
    setItems(res.data || []);
  }

  function onSelect(title) {
    setTitleFilter(title);
    fetchItems(title);
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Shop Crackers</h2>

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          className={`px-3 py-1 rounded ${
            !titleFilter ? "bg-rose-600 text-white" : "bg-white border"
          }`}
          onClick={() => onSelect("")}
        >
          All
        </button>
        {titles.map((t) => (
          <button
            key={t}
            className={`px-3 py-1 rounded ${
              titleFilter === t ? "bg-rose-600 text-white" : "bg-white border"
            }`}
            onClick={() => onSelect(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.length ? (
          items.map((it) => <ProductCard key={it._id} item={it} />)
        ) : (
          <div className="text-gray-500">No crackers found.</div>
        )}
      </div>
    </div>
  );
}
