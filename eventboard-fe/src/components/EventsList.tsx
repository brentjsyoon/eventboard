import React, { useEffect, useState } from "react";
import EventCard from "./EventCard/EventCard";
import "./EventsList.css";

type EventType = {
    _id: string;
    title: string;
    date: string;
    location: string;
    description: string;
};

const EventsList: React.FC = () => {

    const [events, setEvents] = useState<EventType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                const res = await fetch(`${process.env.VITE_RESOURCE_SERVER}/events`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error("Failed to fetch events");

                const data = await res.json();
                setEvents(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const sortedEvents = events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (loading) {
        return <p>Loading events...</p>;
    }

    return (
        <section className="events-list">
            <h2>Upcoming Events</h2>
            {sortedEvents.length === 0 ? (
                <p>No events available</p>
            ) : (
                sortedEvents.map((event) => (
                    <EventCard
                        key={event._id}
                        title={event.title}
                        date={new Date(event.date)}
                        location={event.location}
                        description={event.description}
                    />
                ))
            )}
        </section>
    );
};

export default EventsList;