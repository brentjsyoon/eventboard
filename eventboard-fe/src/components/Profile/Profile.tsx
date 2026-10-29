import React, { useContext, useEffect, useState } from "react";
import styles from "./Profile.module.css";
import Button from "../Button";
import { Link } from "react-router-dom";
import { AuthContext } from "../AuthContext/AuthContextValue";

type UserProfile = {
    fullName: string;
    email: string;
};

const Profile: React.FC = () => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const { logout } = useContext(AuthContext);

    useEffect(() => {
        const fetchProfile = async () => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_RESOURCE_SERVER}/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error("Failed to load profile");
            const data: { user: UserProfile } = await res.json();
            setUser(data.user);
        } catch (err) {
            console.error("❌ Error fetching profile:", err);
            setUser(null);
        } finally {
            setLoading(false);
        }};

        fetchProfile();
    }, []);

    if (loading) return <p className={styles.message}>Loading...</p>;
    if (!user) return <p className={styles.message}>❌ Not logged in</p>;

    return (
        <>
    
            <header className={styles.header}>
                    <h1 className={styles.title}>
                        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
                            <img className={styles.logo} src="/images/logo.png" alt="logo cactus" title="Timmy" />
                            EventBoard
                            <img className={styles.logo} src="/images/logo.png" alt="logo cactus" title="Timmy" />
                        </Link>
                    </h1>
            </header>
            <div className={styles.container}>
                <h2 className={styles.title}>👤 My Profile</h2>

                <div className={styles.card}>
                    <p><strong>Name:</strong> {user.fullName}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                </div>

                <Button
                className={styles.logoutBtn}
                variant="secondary"
                size="md"
                onClick={() => {
                void logout().then(() => {
                    window.location.href = "/";
                });
                }}>
                    Logout
                </Button>
            </div>
        </>
    );
};

export default Profile;