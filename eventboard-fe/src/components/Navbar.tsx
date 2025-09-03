import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {

    const accessToken = localStorage.getItem("accessToken");

    return (
        <nav>
            <Link to="/">Home</Link>
            <Link to={accessToken ? "/events" : "/login"}>Events</Link>
            <Link to="/contact">Contact</Link>
        </nav>
    );
};

export default Navbar;