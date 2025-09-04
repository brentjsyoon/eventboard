import React, { useState } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer";
import EventsList from "../../components/EventsList";
import SearchBar from "../../components/SearchBar/SearchBar";

const Events: React.FC = () => {

    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div>
            <Header />
            <SearchBar onSearch={setSearchQuery}/>
            <h2>All Events</h2>
            <EventsList searchQuery={searchQuery} />
            <Footer />
        </div>
    );
};

export default Events;