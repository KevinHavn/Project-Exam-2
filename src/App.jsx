import { Routes, Route } from "react-router-dom";
import { UserProvider } from "./Components/UserContext";
import Layout from "./Components/Layout/Index";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Venues from "./Pages/Venues";
import VenueManager from "./Pages/VenueManager";
import Profile from "./Pages/Profile";
import SingleVenue from "./Pages/SingleVenue";

const App = () => {
	return (
		<UserProvider>
			<Layout>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/about" element={<About />} />
					<Route path="/venues" element={<Venues />} />
					<Route path="/venue-manager" element={<VenueManager />}></Route>
					<Route path="/profile" element={<Profile></Profile>}></Route>
					<Route path="/venues/:id" element={<SingleVenue />} />
				</Routes>
			</Layout>
		</UserProvider>
	);
};

export default App;
