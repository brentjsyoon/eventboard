import Header from "../../components/Header/Header";
import EventsList from "../../components/EventsList";
import Footer from "../../components/Footer";
import "../../index.css";

const Home: React.FC = () => {

  return (
    <div>
      <Header />
      <main>
        <h2>Upcoming Events</h2>
        <EventsList limit={4} />
      </main>
      <Footer />
    </div>
  );
};

export default Home;