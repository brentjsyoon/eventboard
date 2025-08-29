import React from "react";
import styles from "./Login.module.css";
import { Link } from "react-router-dom";
import AuthContainer from "../../components/AuthContainer/AuthContainer";

const Login: React.FC = () => {

    return (
        <div>
            <header className={styles.header}>
                <h1 className={styles.title}>
                    <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
                        <img className={styles.logo} src="/images/logo.png" alt="logo cactus" title="Timmy" />
                        EventBoard
                        <img className={styles.logo} src="/images/logo.png" alt="logo cactus" title="Timmy" />
                    </Link>
                </h1>
            </header>
            <AuthContainer />
        </div>
    );
};

export default Login;