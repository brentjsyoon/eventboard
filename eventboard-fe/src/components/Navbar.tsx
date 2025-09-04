import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "./AuthContext/AuthContext";

const Navbar: React.FC = () => {

    const { auth } = useContext(AuthContext);

    return (
        <nav>
            <Link to="/">Home</Link>
            <Link to="/events">Events</Link>
            <Link to="/contact">Contact</Link>
            {auth.isAuthenticated && (
                <Link to="/mybookings">My Bookings</Link>
            )}
        </nav>
    );
};

export default Navbar;