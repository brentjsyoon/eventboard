import React, { useState } from "react";
import styles from "./SignUpForm.module.css";

type SignUpFormProps = {
  onSubmit: (data: { fullName: string; email: string; password: string }) => void;
};

const SignUpForm: React.FC<SignUpFormProps> = ({ onSubmit }) => {

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit({ fullName, email, password });
    };
    
    return (
        <div>
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
                <input
                className={styles.input}
                type="password"
                id="signup-password"
                name="password"
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />

                <button className={styles.submitButton} type="submit">
                    Sign Up
                </button>
            </form>
        </div>
    );
};

export default SignUpForm;