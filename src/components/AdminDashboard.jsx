import React, { useState, useEffect } from "react";
import API, { setAuthToken } from "../api";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [msg, setMsg] = useState(null);
  const [crackers, setCrackers] = useState([]);
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const t = localStorage.getItem("admin_token");
    if (!t) navigate("/admin");
    else setAuthToken(t);

    fetchCrackers();
  }, []);

  async function fetchCrackers() {
    const res = await API.get("/crackers");
    setCrackers(res.data);
  }

  async function save(e) {
    e.preventDefault();
    setMsg(null);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("name", name);
      formData.append("price", price);
      if (image) formData.append("image", image);

      if (editId) {
        await API.put(`/crackers/${editId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMsg("Updated successfully");
      } else {
        await API.post("/crackers", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMsg("Added successfully");
      }

      resetForm();
      fetchCrackers();
    } catch (err) {
      setMsg(err.response?.data?.message || "Error");
    }
  }

  function edit(c) {
    setTitle(c.title);
    setName(c.name);
    setPrice(c.price);
    setImage(null);
    setEditId(c._id);

    // Scroll to the top where the form is
    const formEl = document.getElementById("cracker-form");
    if (formEl) {
      formEl.scrollIntoView({ behavior: "smooth" });
    }
  }

  function resetForm() {
    setTitle("");
    setName("");
    setPrice("");
    setImage(null);
    setEditId(null);
  }

  function logout() {
    localStorage.removeItem("admin_token");
    setAuthToken(null);
    navigate("/");
  }

  async function remove(id) {
    if (!window.confirm("Are you sure you want to delete this cracker?"))
      return;

    try {
      await API.delete(`/crackers/${id}`);
      setMsg("Deleted successfully");
      fetchCrackers();
    } catch (err) {
      setMsg(err.response?.data?.message || "Error deleting cracker");
    }
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow space-y-6">
      <div className="flex justify-center items-center">
        <h3 className="text-xl font-semibold">Admin Dashboard</h3>
      </div>

      {msg && <div className="text-sm text-green-600">{msg}</div>}

      {/* Add/Edit Form */}
      <form
        id="cracker-form"
        onSubmit={save}
        className="grid grid-cols-1 md:grid-cols-2 gap-3"
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="p-2 border rounded"
        />
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Cracker Name"
          className="p-2 border rounded"
        />
        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          type="number"
          className="p-2 border rounded"
        />
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          className="p-2 border rounded"
        />

        <div className="md:col-span-2 flex gap-2">
          <button
            type="submit"
            className="flex-1 bg-rose-600 text-white py-2 rounded"
          >
            {editId ? "Update Cracker" : "Add Cracker"}
          </button>
          {editId && (
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 bg-gray-400 text-white py-2 rounded"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* List Crackers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {crackers.map((c) => (
          <div key={c._id} className="border rounded shadow p-2">
            <img
              src={`https://kavi-backend-64wb.onrender.com/uploads/${c.imageUrl}`}
              alt={c.name}
              className="w-full h-32 object-cover rounded"
            />
            <div className="mt-2">
              <h4 className="font-semibold">{c.name}</h4>
              <p className="text-sm text-gray-500">{c.title}</p>
              <p className="text-rose-600 font-bold">₹{c.price}</p>
            </div>

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => edit(c)}
                className="flex-1 bg-blue-500 text-white py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => remove(c._id)}
                className="flex-1 bg-red-500 text-white py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
