import { useContext, useEffect, useState } from "react";
import { UserContext } from "../Components/UserContext";
import VenueForm from "../Components/Manager/VenueForm";
import VenueList from "../Components/Manager/VenueList";

const API_KEY = import.meta.env.VITE_API_KEY;

const VenueManager = () => {
	const { user } = useContext(UserContext);
	const [venues, setVenues] = useState([]);

	useEffect(() => {
		const fetchVenues = async () => {
			if (!user || !user.accessToken || !API_KEY) return;

			const headers = {
				Authorization: `Bearer ${user.accessToken}`,
				"X-Noroff-API-Key": API_KEY,
			};

			try {
				const response = await fetch(
					`https://v2.api.noroff.dev/holidaze/profiles/${user.name}/venues`,
					{ headers }
				);

				const responseData = await response.json();
				setVenues(responseData.data);
			} catch (error) {
				console.error("Error fetching venues:", error);
			}
		};

		fetchVenues();
	}, [user]);

	return (
		<div className="container mx-auto p-4">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<VenueForm />
				</div>
				<div>
					<VenueList venues={venues} setVenues={setVenues} />
				</div>
			</div>
		</div>
	);
};

export default VenueManager;
