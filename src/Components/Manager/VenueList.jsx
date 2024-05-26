/* eslint-disable react/prop-types */

const VenueList = ({ venues }) => {
	return (
		<div className="bg-white p-4 shadow-md rounded-md h-96 overflow-y-auto">
			<h2 className="text-xl font-bold mb-4">Your Venues</h2>
			{Array.isArray(venues) && venues.length === 0 ? (
				<p>No venues listed yet.</p>
			) : (
				Array.isArray(venues) &&
				venues.map((venue) => (
					<div
						key={venue.id}
						id={venue.id}
						className="bg-white rounded-lg shadow-md p-4 mb-4">
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
							<p className="text-gray-800">Bookings: {venue._count.bookings}</p>
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
				))
			)}
		</div>
	);
};

export default VenueList;
