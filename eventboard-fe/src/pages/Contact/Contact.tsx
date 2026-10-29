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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`EventBoard contact from ${formData.name}`);
    const body = encodeURIComponent(`From: ${formData.name} (${formData.email})\n\n${formData.message}`);
    window.location.href = `mailto:support@eventboard.com?subject=${subject}&body=${body}`;
    setStatus("Your email app should open with this message. It has not been sent by this site.");
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