import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import Tabs from "../Tabs/Tabs";
import LoginForm from "../LoginForm/LoginForm";
import SignUpForm from "../SignUpForm/SignUpForm";
import { AuthContext } from "../AuthContext/AuthContextValue";
import styles from "./AuthContainer.module.css";

const AuthContainer: React.FC = () => {

    const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const { login } = useContext(AuthContext); 

    const handleLogin = async (data: { email: string; password: string }) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_AUTH_SERVER}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
                credentials: "include",
            });

            if (!res.ok) throw new Error((await res.json()).error || "Login failed");
            const { accessToken } = await res.json();

            login(accessToken);

            navigate("/");
        } catch (err) {
            console.error(err);
            setMessage("❌ Login failed");
        }
    };

    const handleSignup = async (data: { fullName: string; email: string; password: string }) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_AUTH_SERVER}/users`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error((await res.json()).error || "Signup failed");
            setActiveTab("login");
        } catch (err) {
            console.error(err);
            setMessage("❌ Signup failed");
        }
    };

    return (
        <div className={styles.container}>
        <Tabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "login" ? (
            <LoginForm onSubmit={handleLogin} />
        ) : (
            <SignUpForm onSubmit={handleSignup} />
        )}

        {message && <p>{message}</p>}
        </div>
    );
};

export default AuthContainer;