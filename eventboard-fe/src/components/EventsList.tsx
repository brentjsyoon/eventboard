import React from "react";
import EventCard from "./EventCard/EventCard";
import { parseISO } from "date-fns";
import "./EventsList.css";

const EventsList: React.FC = () => {
    const events = [
        {
            title: "Summer Music Festival",
            date: parseISO("2025-07-15"),
            location: "Downtown Park",
            description: "Join us for a night of music, food, and fun!",
        },
        {
            title: "Startup Networking Night",
            date: parseISO("2025-08-01"),
            location: "Tech Hub",
            description: "Meet and connect with entrepreneurs and inventors.",
        },
    ];

    const sortedEvents = events.sort((a, b) => a.date.getTime() - b.date.getTime());

    return (
        <section className="events-list">
            <h2>Upcoming Events</h2>
            {sortedEvents.map((event, index) => (
                <EventCard
                key={index}
                title={event.title}
                date={event.date}
                location={event.location}
                description={event.description}
                />
            ))}
        </section>
    );
}

export default EventsList;