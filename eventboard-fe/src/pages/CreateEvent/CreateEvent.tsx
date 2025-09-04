import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CreateEvent.module.css"; // Import CSS module
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer";

const API_URL = import.meta.env.VITE_RESOURCE_SERVER;

const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");

    try {
      const res = await fetch(`${API_URL}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, date, location, description }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create event");
      }

      setTitle("");
      setDate("");
      setLocation("");
      setDescription("");
      navigate("/");
    } catch (err: any) {
      console.error(err);
      alert(`❌ Failed to create event: ${err.message}`);
    }
  };

  return (
    <>
      <Header />
        <div className={styles.container}>
          <h2 className={styles.title}>Create New Event</h2>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Title</label>
              <input
                className={styles.input}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Date</label>
              <input
                className={styles.input}
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Location</label>
              <input
                className={styles.input}
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Description</label>
              <textarea
                className={`${styles.input} ${styles.textarea}`}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <button type="submit" className={styles.createEventBtn}>
              <span className={styles.eventIcon}>🗓️</span> Create Event
            </button>
          </form>
        </div>
      <Footer />
    </>
  );
};

export default CreateEvent;