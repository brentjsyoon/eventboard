import Header from "../../components/Header/Header";
import EventsList from "../../components/EventsList";
import Footer from "../../components/Footer";
import "../../index.css";

const Home: React.FC = () => {

  const AUTH_SERVER = import.meta.env.VITE_AUTH_SERVER;
  const RESOURCE_SERVER = import.meta.env.VITE_RESOURCE_SERVER;

  console.log("Auth Server:", AUTH_SERVER);
  console.log("Resource Server:", RESOURCE_SERVER);

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