import React, { useState } from "react";
import Tabs from "../Tabs/Tabs";
import LoginForm from "../LoginForm/LoginForm";
import SignUpForm from "../SignUpForm/SignUpForm";
import styles from "./AuthContainer.module.css";

const AuthContainer: React.FC = () => {

    const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

    return (
        <div className={styles.container}>
            <Tabs activeTab={activeTab} onTabChange={setActiveTab} />

            {activeTab === "login" ? (
                <LoginForm onSubmit={(data) => console.log("login", data)} />
            ) : (
                <SignUpForm onSubmit={(data) => console.log("signup", data)} />
            )}
        </div>
    );
};

export default AuthContainer;