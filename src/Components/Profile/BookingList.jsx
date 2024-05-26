/* eslint-disable react/prop-types */

const BookingList = ({ bookings }) => {
	return (
		<div className="bg-white p-4 shadow-md rounded-md h-96 overflow-y-auto">
			<h2 className="text-xl font-bold mb-4">Your Bookings</h2>
			{Array.isArray(bookings) && bookings.length === 0 ? (
				<p>No bookings found.</p>
			) : (
				Array.isArray(bookings) &&
				bookings.map((booking) => (
					<div
						key={booking.id}
						id={booking.id}
						className="bg-white rounded-lg shadow-md p-4 mb-4">
						<h3 className="text-lg font-bold">{booking.venue.name}</h3>
						<p className="text-gray-600">{booking.venue.description}</p>
						<p className="text-gray-800">Guests: {booking.guests}</p>
						<p className="text-gray-800">
							From: {new Date(booking.dateFrom).toLocaleDateString()}
						</p>
						<p className="text-gray-800">
							To: {new Date(booking.dateTo).toLocaleDateString()}
						</p>
					</div>
				))
			)}
		</div>
	);
};

export default BookingList;
