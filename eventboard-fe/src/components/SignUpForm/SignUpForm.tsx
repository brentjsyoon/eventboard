import React, { useState } from "react";
import eyeOpen from '../../assets/icons/eye-open.png';
import eyeClosed from '../../assets/icons/eye-closed.png';
import styles from "./SignUpForm.module.css";

type SignUpFormProps = {
  onSubmit: (data: { fullName: string; email: string; password: string }) => void;
};

const SignUpForm: React.FC<SignUpFormProps> = ({ onSubmit }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setError("");
    onSubmit({ fullName, email, password });
  };

  return (
    <form className={`${styles.form} ${styles.formActive}`} onSubmit={handleSubmit}>
      <label className={styles.label} htmlFor="signup-name">Full Name</label>
      <input
        className={styles.input}
        type="text"
        id="signup-name"
        name="fullName"
        required
        autoComplete="name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />

      <label className={styles.label} htmlFor="signup-email">Email</label>
      <input
        className={styles.input}
        type="email"
        id="signup-email"
        name="email"
        required
        autoComplete="username"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <label className={styles.label} htmlFor="signup-password">Password</label>
      <div className={styles.inputWrapper}>
        <input
          className={styles.input}
          type={showPassword ? "text" : "password"}
          id="signup-password"
          name="password"
          required
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="button"
          className={styles.eyeButton}
          onClick={() => setShowPassword(!showPassword)}
          tabIndex={-1}
        >
          <img
            src={showPassword ? eyeClosed : eyeOpen}
            alt={showPassword ? "Hide" : "Show"}
            className={styles.eyeIcon}
          />
        </button>
      </div>

      <label className={styles.label} htmlFor="confirm-password">Confirm Password</label>
      <div className={styles.inputWrapper}>
        <input
          className={styles.input}
          type={showConfirm ? "text" : "password"}
          id="confirm-password"
          name="confirm"
          required
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
        <button
          type="button"
          className={styles.eyeButton}
          onClick={() => setShowConfirm(!showConfirm)}
          tabIndex={-1}
        >
          <img
            src={showConfirm ? eyeClosed : eyeOpen}
            alt={showConfirm ? "Hide" : "Show"}
            className={styles.eyeIcon}
          />
        </button>
      </div>

      {error && <p style={{ color: "red", fontSize: "0.85rem", marginTop: "-0.5rem" }}>{error}</p>}

      <button className={styles.submitButton} type="submit">
        Sign Up
      </button>
    </form>
  );
};

export default SignUpForm;