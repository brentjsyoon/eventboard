import React from "react";
import Button from "../Button";
import Navbar from "../Navbar";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";

const Header: React.FC = () => {

    const navigate = useNavigate();
    
    return (
        <header className={styles.header}>
            <h1 className={styles.title}>
                <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
                    <img className={styles.logo} src="/images/logo.png" alt="logo cactus" title="Timmy" />
                    EventBoard
                    <img className={styles.logo} src="/images/logo.png" alt="logo cactus" title="Timmy" />
                </Link>
            </h1>
            <Navbar />
            <div className={styles.actions}>
                <Button variant="secondary" size="md" onClick={() => navigate("/login")}>
                    Login / Create Account
                </Button>
                <Button className={styles.createEventBtn} variant="secondary" size="md">
                    <img className={styles.eventIcon} src="./images/event.png" alt="event creation icon" />
                    Create New Event
                </Button>
            </div>
        </header>
    );
};

export default Header;