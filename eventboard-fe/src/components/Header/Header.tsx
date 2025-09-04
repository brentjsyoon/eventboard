import React, { useContext } from "react";
import Button from "../Button";
import Navbar from "../Navbar";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext/AuthContext";
import userIcon from "../../assets/icons/user.png";
import eventIcon from "../../assets/icons/event.png";
import styles from "./Header.module.css";

const Header: React.FC = () => {

    const navigate = useNavigate();
    const { auth, logout } = useContext(AuthContext);

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
                {!auth.isAuthenticated ? (
                    // If NOT logged in -> show Login / Create Account
                    <Button variant="secondary" size="md" onClick={() => navigate("/login")}>
                        Login / Create Account
                    </Button>
                ) : (
                    // If logged in → show Profile + Logout
                    <>
                        <Button 
                            style={{ padding: "4px 12px", minWidth: "auto" }}
                            variant="secondary"
                            size="md"
                            onClick={() => navigate("/profile")}
                        >
                            <img className={styles.userIcon} src={userIcon} alt="user profile icon" />
                            Profile
                        </Button>

                        <Button
                            style={{ padding: "4px 12px", minWidth: "auto" }}
                            variant="secondary" size="md" 
                            onClick={() => {
                                logout();
                                navigate("/");
                            }}
                        >
                            Logout
                        </Button>
                    </>
                )}

                <Button className={styles.createEventBtn} variant="secondary" size="md"
                        onClick={() => {
                            if (!auth.isAuthenticated) {
                                navigate("/login");
                            } else {
                            navigate("/create-event");
                            }
                }}>
                    <img className={styles.eventIcon} src={eventIcon} alt="event creation icon" />
                    Create New Event
                </Button>
            </div>
        </header>
    );
};

export default Header;