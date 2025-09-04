import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../components/AuthContext/AuthContext";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer";
import styles from "./MyBookings.module.css";

type BookingType = {
    _id: string;
    event: {
        _id: string;
        title: string;
        date: string;
        location: string;
        description: string;
    };
    seats: number;
};

const MyBookings: React.FC = () => {
    const { auth } = useContext(AuthContext);
    const [bookings, setBookings] = useState<BookingType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!auth.isAuthenticated) return;

        const fetchBookings = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_RESOURCE_SERVER}/bookings`, {
                    headers: { "Authorization": `Bearer ${auth.accessToken}` },
                });
                if (!res.ok) throw new Error("Failed to fetch bookings");
                const data = await res.json();
                setBookings(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [auth]);

    if (!auth.isAuthenticated) return <p className={styles.noBookings}>Please log in to view your bookings.</p>;

    if (loading) return <p className={styles.loading}>Loading your bookings...</p>;
    
    if (bookings.length === 0) return <p className={styles.noBookings}>You have not booked any events yet.</p>;

    return (
        <div>
            <Header />
            <main className={styles.myBookingsContainer}>
                <h2>My Bookings</h2>
                {bookings.map((booking) => {
                const formattedDate = new Date(booking.event.date).toLocaleDateString("en-CA", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                });

                return (
                    <div key={booking._id} className={styles.bookingCard}>
                        <h3>{booking.event.title}</h3>
                        <p><strong>Date:</strong> {formattedDate}</p>
                        <p><strong>Location:</strong> {booking.event.location}</p>
                        <p><strong>Seats:</strong> {booking.seats}</p>
                        <p>{booking.event.description}</p>
                    </div>
                );
                })}
            </main>
            <Footer />
        </div>
    );
};

export default MyBookings;