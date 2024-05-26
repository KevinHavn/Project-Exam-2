import { useState, useEffect } from "react";

const VenuesCard = () => {
	const [venues, setVenues] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(
					"https://v2.api.noroff.dev/holidaze/venues",
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
						},
					}
				);

				if (!response.ok) {
					throw new Error(`Error: ${response.statusText}`);
				}

				const result = await response.json();
				setVenues(result.data);
			} catch (error) {
				setError(error.message);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error: {error}</p>;

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
			{venues.map((venue) => (
				<div key={venue.id} className="bg-white rounded-lg shadow-md p-4">
					<div className="mb-4">
						<img
							src={venue.media[0]?.url}
							alt={venue.media[0]?.alt || "Venue image"}
							className="w-full h-48 object-cover rounded-t-lg"
						/>
					</div>
					<div className="mb-2">
						<h2 className="text-xl font-semibold truncate">{venue.name}</h2>
						<p className="text-gray-600 overflow-hidden overflow-ellipsis whitespace-nowrap">
							{venue.description}
						</p>
					</div>
					<div className="mb-2">
						<p className="text-gray-800 font-bold">Price: ${venue.price}</p>
						<p className="text-gray-800">Max Guests: {venue.maxGuests}</p>
						<p className="text-gray-800">Rating: {venue.rating}</p>
					</div>
					<div className="mb-2">
						<h3 className="text-lg font-semibold">Location:</h3>
						<p className="text-gray-600 truncate">
							{venue.location.address}, {venue.location.city},{" "}
							{venue.location.country}
						</p>
					</div>
					<div>
						<h3 className="text-lg font-semibold">Amenities:</h3>
						<ul className="list-disc list-inside">
							{venue.meta.wifi && <li>WiFi</li>}
							{venue.meta.parking && <li>Parking</li>}
							{venue.meta.breakfast && <li>Breakfast</li>}
							{venue.meta.pets && <li>Pets allowed</li>}
						</ul>
					</div>
				</div>
			))}
		</div>
	);
};

export default VenuesCard;
