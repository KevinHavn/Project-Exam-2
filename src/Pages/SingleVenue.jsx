import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../Components/UserContext";
import BookingCalendar from "../Components/BookingCalendar";

const API_KEY = import.meta.env.VITE_API_KEY;

const SingleVenue = () => {
	const { id } = useParams();
	const { user } = useContext(UserContext);
	const [venue, setVenue] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchVenue = async () => {
			setLoading(true);
			try {
				const response = await fetch(
					`https://v2.api.noroff.dev/holidaze/venues/${id}`,
					{
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${user.accessToken}`,
							"X-Noroff-API-Key": API_KEY,
						},
					}
				);

				if (!response.ok) {
					throw new Error(`Error: ${response.statusText}`);
				}

				const result = await response.json();
				setVenue(result.data);
			} catch (error) {
				setError(error.message);
			} finally {
				setLoading(false);
			}
		};

		fetchVenue();
	}, [id, user]);

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error: {error}</p>;
	if (!venue) return <p>No venue found</p>;

	const {
		media,
		name,
		description,
		price,
		maxGuests,
		rating,
		_count,
		location,
		meta,
		owner,
	} = venue || {};

	return (
		<div className="container mx-auto p-4">
			<div className="bg-white rounded-lg shadow-md p-4 mb-4">
				{media && media.length > 0 && (
					<div className="mb-4">
						<img
							src={media[0]?.url}
							alt={media[0]?.alt || "Venue image"}
							className="w-full h-48 object-cover rounded-t-lg"
						/>
					</div>
				)}
				<div className="mb-2">
					<h2 className="text-xl font-semibold">{name}</h2>
					<p className="text-gray-600">{description}</p>
				</div>
				<div className="mb-2">
					<p className="text-gray-800 font-bold">Price: ${price}</p>
					<p className="text-gray-800">Max Guests: {maxGuests}</p>
					<p className="text-gray-800">Rating: {rating}</p>
					{_count && (
						<p className="text-gray-800">Bookings: {_count.bookings}</p>
					)}
				</div>
				<div className="mb-2">
					<h3 className="text-lg font-semibold">Location:</h3>
					{location && (
						<p className="text-gray-600">
							{location.address}, {location.city}, {location.country}
						</p>
					)}
				</div>
				<div>
					<h3 className="text-lg font-semibold">Amenities:</h3>
					<ul className="list-disc list-inside">
						{meta?.wifi && <li>WiFi</li>}
						{meta?.parking && <li>Parking</li>}
						{meta?.breakfast && <li>Breakfast</li>}
						{meta?.pets && <li>Pets allowed</li>}
					</ul>
				</div>
			</div>

			{user && user.name !== owner?.name && (
				<BookingCalendar
					venueId={venue.id}
					maxGuests={venue.maxGuests}
					userToken={user.accessToken}
				/>
			)}
		</div>
	);
};

export default SingleVenue;
