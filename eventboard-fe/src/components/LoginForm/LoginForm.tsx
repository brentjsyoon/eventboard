import React, { useState } from "react";
import styles from "./LoginForm.module.css";

type LoginFormProps = {
  onSubmit: (data: { email: string; password: string }) => void;
};

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit({ email, password });
    };

    return (
        <div>
            <form className={`${styles.form} ${styles.formActive}`} onSubmit={handleSubmit}>
                <label className={styles.label} htmlFor="login-email">Email</label>
                <input
                className={styles.input}
                type="email"
                id="login-email"
                name="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />

                <label className={styles.label} htmlFor="login-password">Password</label>
                <input
                className={styles.input}
                type="password"
                id="login-password"
                name="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />

                <div className={styles.smallText}>
                    <a href="/forgot-password">Forgot password?</a>
                </div>

                <button className={styles.submitButton} type="submit">
                    Log In
                </button>
            </form>
        </div>
    );
};

export default LoginForm;