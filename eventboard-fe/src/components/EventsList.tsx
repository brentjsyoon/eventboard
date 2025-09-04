import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext/AuthContext";
import EventCard from "./EventCard/EventCard";
import "./EventsList.css";

type EventType = {
    _id: string;
    title: string;
    date: string;
    location: string;
    description: string;
};

interface EventsListProps {
  limit?: number;
  searchQuery?: string;
}

const EventsList: React.FC<EventsListProps> = ({ limit, searchQuery = "" }) => {

    const [events, setEvents] = useState<EventType[]>([]);
    const [loading, setLoading] = useState(true);
    const [bookedEventIds, setBookedEventIds] = useState<string[]>([]);

    const { auth } = useContext(AuthContext);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_RESOURCE_SERVER}/events`);
                
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

    useEffect(() => {
        if (!auth.isAuthenticated) return;

        const fetchBookings = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_RESOURCE_SERVER}/bookings`, {
                    headers: { "Authorization": `Bearer ${auth.accessToken}` },
                });
                if (!res.ok) throw new Error("Failed to fetch bookings");
                const data = await res.json();
                const bookedIds = data.map((b: any) => b.event._id);
                setBookedEventIds(bookedIds);
            } catch (err) {
                console.error(err);
            }
        };

        fetchBookings();
    }, [auth]);

    const filteredEvents = events.filter((event) =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedEvents = filteredEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const eventsToShow = limit ? sortedEvents.slice(0, limit) : sortedEvents;

    if (loading) {
        return <p>Loading events...</p>;
    }

    return (
        <section className="events-list">
            {eventsToShow.length === 0 ? (
                <p>No results found for query</p>
            ) : (
                eventsToShow.map((event) => (
                    <EventCard
                        _id={event._id}
                        title={event.title}
                        date={new Date(event.date)}
                        location={event.location}
                        description={event.description}
                        booked={bookedEventIds.includes(event._id)}
                    />
                ))
            )}
        </section>
    );
};

export default EventsList;