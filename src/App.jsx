import { Routes, Route } from "react-router-dom";
import { UserProvider } from "./Components/UserContext";
import Layout from "./Components/Layout/Index";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Venues from "./Pages/Venues";

const App = () => {
	return (
		<UserProvider>
			<Layout>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/about" element={<About />} />
					<Route path="/venues" element={<Venues />} />
				</Routes>
			</Layout>
		</UserProvider>
	);
};

export default App;
