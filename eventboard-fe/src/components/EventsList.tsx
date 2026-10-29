import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext/AuthContextValue";
import EventCard from "./EventCard/EventCard";
import "./EventsList.css";

type EventType = {
    _id: string;
    title: string;
    date: string;
    location: string;
    description: string;
};

type BookingType = {
    event: { _id: string } | null;
};

interface EventsListProps {
  limit?: number;
  searchQuery?: string;
}

const EventsList: React.FC<EventsListProps> = ({ limit, searchQuery = "" }) => {

    const [events, setEvents] = useState<EventType[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [bookedEventIds, setBookedEventIds] = useState<string[]>([]);

    const { auth } = useContext(AuthContext);

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams({
                    page: String(limit ? 1 : page),
                    limit: String(limit || 20),
                    q: searchQuery,
                });
                const res = await fetch(`${import.meta.env.VITE_RESOURCE_SERVER}/events?${params}`);
                
                if (!res.ok) throw new Error("Failed to fetch events");

                const data = await res.json();
                setEvents(data.events);
                setPages(data.pages);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [limit, page, searchQuery]);

    useEffect(() => {
        setPage(1);
    }, [searchQuery]);

    useEffect(() => {
        if (!auth.isAuthenticated) return;

        const fetchBookings = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_RESOURCE_SERVER}/bookings`, {
                    headers: { "Authorization": `Bearer ${auth.accessToken}` },
                });
                if (!res.ok) throw new Error("Failed to fetch bookings");
                const data: BookingType[] = await res.json();
                const bookedIds = data.flatMap((booking) => booking.event ? [booking.event._id] : []);
                setBookedEventIds(bookedIds);
            } catch (err) {
                console.error(err);
            }
        };

        fetchBookings();
    }, [auth]);

    if (loading) {
        return <p>Loading events...</p>;
    }

    return (
        <section className="events-list">
            {events.length === 0 ? (
                <p>No results found for query</p>
            ) : (
                events.map((event) => (
                    <EventCard
                        key={event._id}
                        _id={event._id}
                        title={event.title}
                        date={new Date(event.date)}
                        location={event.location}
                        description={event.description}
                        booked={bookedEventIds.includes(event._id)}
                    />
                ))
            )}
            {!limit && pages > 1 && (
                <div className="events-pagination" aria-label="Event pages">
                    <button type="button" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
                    <span>Page {page} of {pages}</span>
                    <button type="button" disabled={page >= pages} onClick={() => setPage(page + 1)}>Next</button>
                </div>
            )}
        </section>
    );
};

export default EventsList;