import React, { useContext } from "react";
import Button from "../Button";
import { AuthContext } from "../AuthContext/AuthContext";
import styles from "./EventCard.module.css";

type EventCardProps = {
    _id: string;
    title: string;
    date: Date;
    location: string;
    description: string;
    booked?: boolean;
};

const EventCard: React.FC<EventCardProps> = ({
    _id,
    title,
    date,
    location,
    description,
    booked = false,
}) => {
    const { auth } = useContext(AuthContext);

    const formattedDate = date.toLocaleDateString("en-CA", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const handleBook = async () => {
        if (!auth.isAuthenticated) {
        alert("Please log in to book an event.");
        return;
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_RESOURCE_SERVER}/bookings`, {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${auth.accessToken}`,
                },
                body: JSON.stringify({ eventId: _id, seats: 1 }),
            });

            if (!res.ok) throw new Error("Booking failed");

            alert("Booking successful!");
        } catch (err) {
            console.error(err);
            alert("Booking failed");
        }
    };

    return (
        <div className={styles.eventCard}>
            <h3>{title}</h3>
            <p>Date: {formattedDate}</p>
            <p>Location: {location}</p>
            <p>{description}</p>
            
            {!booked && (
                <Button variant="primary" size="sm" onClick={handleBook}>
                    Book Now
                </Button>
            )}
        </div>
    );
};

export default EventCard;