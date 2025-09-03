import React, { useState } from "react";

const API_URL = import.meta.env.VITE_RESOURCE_SERVER;

console.log("API_URL:", API_URL);

const CreateEvent: React.FC = () => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("accessToken");

    try {
      const response = await fetch(`${API_URL}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          date,
          location,
          description,
        }),
      });

      if (response.ok) {
        alert("✅ Event created!");
        setTitle("");
        setDate("");
        setLocation("");
        setDescription("");
      } else {
        const msg = await response.text();
        alert("❌ Failed to create event: " + msg);
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Something went wrong.");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "2rem auto" }}>
      <h2>Create New Event</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <button type="submit">Create Event</button>
      </form>
    </div>
  );
};

export default CreateEvent;