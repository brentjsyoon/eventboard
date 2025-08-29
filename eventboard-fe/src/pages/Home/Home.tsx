import React from "react";
import Header from "../../components/Header/Header";
import SearchBar from "../../components/SearchBar/SearchBar";
import EventsList from "../../components/EventsList";
import Footer from "../../components/Footer";
import "../../index.css";

const Home: React.FC = () => {

  return (
    <div>
      <Header />
      <main>
        <SearchBar />
        <EventsList />
      </main>
      <Footer />
    </div>
  );
};

export default Home;