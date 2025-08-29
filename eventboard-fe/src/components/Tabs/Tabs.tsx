import React from "react";
import styles from "./Tabs.module.css";

type TabsProps = {
  activeTab: "login" | "signup";
  onTabChange: (tab: "login" | "signup") => void;
};

const Tabs: React.FC<TabsProps> = ({ activeTab, onTabChange }) => {

    return (
        <div className={styles.tabs}>
            <button 
                className={activeTab === "login" ? styles.active : ""}
                onClick={() => onTabChange("login")}>
                Login
            </button>
            <button
                className={activeTab === "signup" ? styles.active : ""}
                onClick={() => onTabChange("signup")}>
                Sign Up
            </button>
        </div>
    );
};

export default Tabs;