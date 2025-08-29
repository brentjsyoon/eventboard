import React from "react";
import Button from "../Button";
import styles from "./EventCard.module.css";

type EventCardProps = {
  title: string;
  date: Date;
  location: string;
  description: string;
};

const EventCard: React.FC<EventCardProps> = ({
    title,
    date,
    location,
    description,
}) => {

    const formattedDate = date.toLocaleDateString("en-CA", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <div className={styles.eventCard}>
            <h3>{title}</h3>
            <p>Date: {formattedDate}</p>
            <p>Location: {location}</p>
            <p>{description}</p>
            <Button variant="primary" size="sm">Book Now</Button>
        </div>
    );
};

export default EventCard;