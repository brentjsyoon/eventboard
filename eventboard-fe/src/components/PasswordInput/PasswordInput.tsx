import React, { useState } from "react";
import styles from "./PasswordInput.module.css";

const PasswordInput: React.FC<{
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id: string;
}> = ({ label, value, onChange, id }) => {
  const [show, setShow] = useState(false);

  return (
    <div className={styles.passwordWrapper}>
      <label className={styles.label} htmlFor={id}>{label}</label>
      <div className={styles.inputGroup}>
        <input
          className={styles.input}
          type={show ? "text" : "password"}
          id={id}
          value={value}
          onChange={onChange}
          required
        />
        <button
          type="button"
          className={styles.peekButton}
          onClick={() => setShow(!show)}
        >
          {show ? "🙈" : "👁️"}
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;