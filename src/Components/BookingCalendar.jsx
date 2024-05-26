/* eslint-disable react/prop-types */
import { useState, useEffect, useContext } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { UserContext } from "../Components/UserContext";

const API_KEY = import.meta.env.VITE_API_KEY;

const BookingCalendar = ({ venueId, maxGuests }) => {
	const { user } = useContext(UserContext);
	const [selectionRange, setSelectionRange] = useState({
		startDate: new Date(),
		endDate: new Date(),
		key: "selection",
	});
	const [guests, setGuests] = useState(1);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(null);
	const [bookedDates, setBookedDates] = useState([]);

	useEffect(() => {
		const fetchBookings = async () => {
			try {
				const response = await fetch(
					`https://v2.api.noroff.dev/holidaze/venues/${venueId}?_bookings=true`,
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
				console.log("Fetched data: ", data); // Log the fetched data

				// Access the nested data property correctly
				const bookings = data.data.bookings;
				console.log("bookings: ", bookings); // Log bookings

				if (bookings && Array.isArray(bookings) && bookings.length > 0) {
					const dates = bookings.map((booking) => ({
						startDate: new Date(booking.dateFrom),
						endDate: new Date(booking.dateTo),
					}));
					setBookedDates(dates);
					console.log("Parsed bookings: ", dates); // Log parsed bookings
				} else {
					throw new Error("No bookings found");
				}
			} catch (error) {
				console.error("Error fetching bookings: ", error);
				setError(error.message);
			}
		};

		fetchBookings();
	}, [venueId, user.accessToken]);

	const handleSelect = (ranges) => {
		setSelectionRange(ranges.selection);
	};

	const handleGuestsChange = (e) => {
		setGuests(e.target.value);
	};

	const handleBooking = async () => {
		setLoading(true);
		setError(null);
		setSuccess(null);

		const bookingData = {
			dateFrom: selectionRange.startDate.toISOString(),
			dateTo: selectionRange.endDate.toISOString(),
			guests: parseInt(guests, 10),
			venueId: venueId,
		};

		console.log("Booking Data: ", bookingData);

		try {
			const response = await fetch(
				"https://v2.api.noroff.dev/holidaze/bookings",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${user.accessToken}`,
						"X-Noroff-API-Key": API_KEY,
					},
					body: JSON.stringify(bookingData),
				}
			);

			const responseData = await response.json();
			console.log("Response Data: ", responseData);

			if (!response.ok) {
				console.log("Response: ", response);
				throw new Error(
					`Error: ${responseData.message || response.statusText}`
				);
			}

			console.log("Success: ", responseData);
			setSuccess("Booking created successfully!");
		} catch (error) {
			console.error("Error: ", error);
			setError(error.message);
		} finally {
			setLoading(false);
		}
	};

	const getDisabledDates = () => {
		const disabledDates = [];
		bookedDates.forEach(({ startDate, endDate }) => {
			let currentDate = new Date(startDate);
			while (currentDate <= endDate) {
				disabledDates.push(new Date(currentDate));
				currentDate.setDate(currentDate.getDate() + 1);
			}
		});
		return disabledDates;
	};

	return (
		<div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-md">
			<h2 className="text-xl font-bold mb-4 text-center">Book This Venue</h2>
			<div className="mb-4">
				<label
					htmlFor="dateRange"
					className="block text-gray-700 font-bold mb-2 text-center">
					Select Date Range
				</label>
				<div className="flex justify-center">
					<DateRange
						ranges={[selectionRange]}
						onChange={handleSelect}
						moveRangeOnFirstSelection={false}
						className="w-full"
						disabledDates={getDisabledDates()}
					/>
				</div>
			</div>
			<div className="mb-4">
				<label
					htmlFor="guests"
					className="block text-gray-700 font-bold mb-2 text-center">
					Guests
				</label>
				<input
					type="number"
					id="guests"
					name="guests"
					value={guests}
					onChange={handleGuestsChange}
					min="1"
					max={maxGuests}
					className="w-full px-3 py-2 border rounded-md"
				/>
			</div>
			{error && <p className="text-red-500 text-center">{error}</p>}
			{success && <p className="text-green-500 text-center">{success}</p>}
			<div className="flex justify-center">
				<button
					onClick={handleBooking}
					className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700"
					disabled={loading}>
					{loading ? "Booking..." : "Book Now"}
				</button>
			</div>
		</div>
	);
};

export default BookingCalendar;
