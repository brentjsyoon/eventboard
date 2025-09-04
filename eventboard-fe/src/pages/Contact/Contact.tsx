import React, { useState } from "react";
import styles from "./Contact.module.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer";

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      // In production: send to backend or email service (e.g. Nodemailer, Formspree)
      console.log("Form submitted:", formData);

      setFormData({ name: "", email: "", message: "" });
      setStatus("✅ Message sent successfully!");
    } catch (err) {
      console.error(err);
      setStatus("❌ Failed to send message. Please try again.");
    }
  };

  return (
    <>
      <Header />
        <div className={styles.container}>
        <h2 className={styles.title}>Contact Us</h2>

        <div className={styles.content}>
            {/* Contact Info Section */}
            <div className={styles.info}>
            <h3>Get in touch</h3>
            <p><strong>Email:</strong> support@eventboard.com</p>
            <p><strong>Phone:</strong> +1 (647) 123-4567</p>
            <p><strong>Address:</strong> 123 Main Street, Toronto, ON</p>
            </div>

            {/* Contact Form Section */}
            <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
                <label className={styles.label}>Name</label>
                <input
                className={styles.input}
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                />
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>Email</label>
                <input
                className={styles.input}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                />
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>Message</label>
                <textarea
                className={`${styles.input} ${styles.textarea}`}
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                />
            </div>

            <button type="submit" className={styles.submitBtn}>
                Send Message
            </button>

            {status && <p className={styles.status}>{status}</p>}
            </form>
        </div>
        </div>
      <Footer />
    </>
  );
};

export default Contact;