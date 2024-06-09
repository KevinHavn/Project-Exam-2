import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const VenuesCard = () => {
	const [venues, setVenues] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [page, setPage] = useState(1);
	const [query, setQuery] = useState("");
	const [hasMore, setHasMore] = useState(true);

	const fetchData = async (page, query = "") => {
		setLoading(true);
		try {
			const endpoint = query
				? `https://v2.api.noroff.dev/holidaze/venues/search?q=${query}&page=${page}`
				: `https://v2.api.noroff.dev/holidaze/venues?page=${page}`;

			const response = await fetch(endpoint, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				throw new Error(`Error: ${response.statusText}`);
			}

			const result = await response.json();
			if (result.data.length > 0) {
				setVenues((prevVenues) => {
					const venueMap = new Map(
						prevVenues.map((venue) => [venue.id, venue])
					);
					result.data.forEach((venue) => venueMap.set(venue.id, venue));
					return Array.from(venueMap.values());
				});
			} else {
				setHasMore(false);
			}
		} catch (error) {
			setError(error.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData(page, query);
	}, [page, query]);

	const handleSearch = (e) => {
		setQuery(e.target.value);
		setPage(1);
		setVenues([]);
		setHasMore(true);
	};

	const handleViewMore = () => {
		setPage((prevPage) => prevPage + 1);
	};

	return (
		<div className="container mx-auto p-4">
			<div className="p-4">
				<label htmlFor="search" className="block text-gray-700 font-bold mb-2">
					Search Venues
				</label>
				<input
					type="text"
					placeholder="Search venues..."
					value={query}
					onChange={handleSearch}
					className="w-full px-3 py-2 border rounded-md"
				/>
			</div>
			{loading && <p>Loading...</p>}
			{error && <p>Error: {error}</p>}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
				{venues.map((venue) => (
					<Link to={`/venues/${venue.id}`} key={venue.id} className="h-full">
						<div className="bg-white rounded-lg shadow-md p-4 flex flex-col h-full">
							<div className="mb-4">
								<img
									src={venue.media[0]?.url}
									alt={venue.media[0]?.alt || "Venue image"}
									className="w-full h-48 object-cover rounded-t-lg"
								/>
							</div>
							<div className="mb-2 flex-grow">
								<h2 className="text-xl font-semibold truncate">{venue.name}</h2>
								<p className="text-gray-800 overflow-hidden overflow-ellipsis whitespace-nowrap">
									{venue.description}
								</p>
							</div>
							<div className="mb-2">
								<p className="text-gray-800 font-bold">
									Price per night: ${venue.price}
								</p>
								<p className="text-gray-800">Max Guests: {venue.maxGuests}</p>
								<p className="text-gray-800">Rating: {venue.rating}</p>
							</div>
							<div className="mb-2">
								<h3 className="text-lg font-semibold">Location:</h3>
								<p className="text-gray-800 truncate">
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
					</Link>
				))}
			</div>
			{hasMore && !loading && (
				<div className="text-center">
					<button
						onClick={handleViewMore}
						className="bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded-md">
						View More
					</button>
				</div>
			)}
		</div>
	);
};

export default VenuesCard;
