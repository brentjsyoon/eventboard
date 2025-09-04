import React, { useState } from "react";
import eyeOpen from '../../assets/icons/eye-open.png';
import eyeClosed from '../../assets/icons/eye-closed.png';
import styles from "./LoginForm.module.css";

type LoginFormProps = {
  onSubmit: (data: { email: string; password: string }) => void;
};

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit({ email: email.toLowerCase(), password });
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

                <div className={styles.inputWrapper}>
                    <input
                        className={styles.input}
                        type={showPassword ? "text" : "password"}
                        id="login-password"
                        name="password"
                        required
                        autoComplete="current-password"
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