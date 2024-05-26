/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import Modal from "../Modal";

const API_KEY = import.meta.env.VITE_API_KEY;

const BookingList = ({ userName }) => {
	const { user } = useContext(UserContext);
	const [bookings, setBookings] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [selectedBooking, setSelectedBooking] = useState(null);
	const [showModal, setShowModal] = useState(false);

	useEffect(() => {
		const fetchBookings = async () => {
			setLoading(true);
			try {
				const response = await fetch(
					`https://v2.api.noroff.dev/holidaze/profiles/${userName}/bookings?_venue=true`,
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

				const data = await response.json();
				setBookings(data.data);
			} catch (error) {
				console.error("Error fetching bookings: ", error);
				setError(error.message);
			} finally {
				setLoading(false);
			}
		};

		fetchBookings();
	}, [userName, user.accessToken]);

	const handleCardClick = (booking) => {
		setSelectedBooking(booking);
		setShowModal(true);
	};

	const handleCloseModal = () => {
		setShowModal(false);
		setSelectedBooking(null);
	};

	const handleDeleteBooking = async () => {
		if (!selectedBooking) return;

		try {
			const response = await fetch(
				`https://v2.api.noroff.dev/holidaze/bookings/${selectedBooking.id}`,
				{
					method: "DELETE",
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

			// Remove the deleted booking from the state
			setBookings((prevBookings) =>
				prevBookings.filter((booking) => booking.id !== selectedBooking.id)
			);
			handleCloseModal();
		} catch (error) {
			console.error("Error deleting booking: ", error);
			setError(error.message);
		}
	};

	return (
		<div className="bg-white p-4 shadow-md rounded-md h-96 overflow-y-auto">
			<h2 className="text-xl font-bold mb-4">Your Bookings</h2>
			{loading ? (
				<p>Loading...</p>
			) : error ? (
				<p className="text-red-500">{error}</p>
			) : Array.isArray(bookings) && bookings.length === 0 ? (
				<p>No bookings found.</p>
			) : (
				Array.isArray(bookings) &&
				bookings.map((booking) => (
					<div
						key={booking.id}
						id={booking.id}
						className="block cursor-pointer"
						onClick={() => handleCardClick(booking)}>
						<div className="bg-white rounded-lg shadow-md p-4 mb-4">
							<div className="mb-4">
								<img
									src={booking.venue?.media[0]?.url || "default-image-url.jpg"}
									alt={booking.venue?.media[0]?.alt || "Venue image"}
									className="w-full h-48 object-cover rounded-t-lg"
								/>
							</div>
							<div className="mb-2">
								<h2 className="text-xl font-semibold truncate">
									{booking.venue?.name || "No venue name"}
								</h2>
								<p className="text-gray-600 overflow-hidden overflow-ellipsis whitespace-nowrap">
									{booking.venue?.description || "No description available"}
								</p>
							</div>
							<div className="mb-2">
								<p className="text-gray-800 font-bold">
									Guests: {booking.guests}
								</p>
								<p className="text-gray-800">
									From: {new Date(booking.dateFrom).toLocaleDateString()}
								</p>
								<p className="text-gray-800">
									To: {new Date(booking.dateTo).toLocaleDateString()}
								</p>
							</div>
							<div>
								<h3 className="text-lg font-semibold">Location:</h3>
								<p className="text-gray-600 truncate">
									{booking.venue?.location.address || "No address"},{" "}
									{booking.venue?.location.city || "No city"},{" "}
									{booking.venue?.location.country || "No country"}
								</p>
							</div>
						</div>
					</div>
				))
			)}
			{showModal && selectedBooking && (
				<Modal onClose={handleCloseModal}>
					<div>
						<h2 className="text-xl font-bold mb-2">
							{selectedBooking.venue?.name || "No venue name"}
						</h2>
						<img
							src={
								selectedBooking.venue?.media[0]?.url || "default-image-url.jpg"
							}
							alt={selectedBooking.venue?.media[0]?.alt || "Venue image"}
							className="w-full h-48 object-cover rounded-t-lg mb-4"
						/>
						<p>
							{selectedBooking.venue?.description || "No description available"}
						</p>
						<p className="font-bold">Guests: {selectedBooking.guests}</p>
						<p>
							From: {new Date(selectedBooking.dateFrom).toLocaleDateString()}
						</p>
						<p>To: {new Date(selectedBooking.dateTo).toLocaleDateString()}</p>
						<p>
							Location:{" "}
							{`${selectedBooking.venue?.location.address || "No address"}, ${
								selectedBooking.venue?.location.city || "No city"
							}, ${selectedBooking.venue?.location.country || "No country"}`}
						</p>
						<button
							onClick={handleDeleteBooking}
							className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
							Delete Booking
						</button>
					</div>
				</Modal>
			)}
		</div>
	);
};

export default BookingList;
