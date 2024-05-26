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
  const [myBookedDates, setMyBookedDates] = useState([]);

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
        const bookings = data.data.bookings;

        if (bookings && Array.isArray(bookings) && bookings.length > 0) {
          const dates = bookings.map((booking) => ({
            startDate: new Date(booking.dateFrom),
            endDate: new Date(booking.dateTo),
            userId: booking.customer.id, // Assuming customer.id is the user ID
          }));
          setBookedDates(dates);

          const myDates = dates.filter((date) => date.userId === user.id);
          setMyBookedDates(myDates);
        } else {
          throw new Error("No bookings found");
        }
      } catch (error) {
        console.error("Error fetching bookings: ", error);
        setError(error.message);
      }
    };

    fetchBookings();
  }, [venueId, user.accessToken, user.id]);

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

      if (!response.ok) {
        throw new Error(`Error: ${responseData.message || response.statusText}`);
      }

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

  const getMyBookedDates = () => {
    const myDates = [];
    myBookedDates.forEach(({ startDate, endDate }) => {
      let currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        myDates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });
    return myDates;
  };

  const getDateColor = (date) => {
    const myDates = getMyBookedDates();
    const disabledDates = getDisabledDates();

    if (myDates.some((d) => d.getTime() === date.getTime())) {
      return "bg-blue-200"; // Your booked dates in blue
    }

    if (disabledDates.some((d) => d.getTime() === date.getTime())) {
      return "bg-red-200"; // Booked dates in red
    }

    return "bg-white"; // Available dates in white
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold mb-4 text-center">Book This Venue</h2>
      <div className="mb-4">
        <label
          htmlFor="dateRange"
          className="block text-gray-700 font-bold mb-2 text-center"
        >
          Select Date Range
        </label>
        <div className="flex justify-center">
          <DateRange
            ranges={[selectionRange]}
            onChange={handleSelect}
            moveRangeOnFirstSelection={false}
            className="w-full"
            disabledDates={getDisabledDates()}
            dateDisplayFormat="yyyy-MM-dd"
            rangeColors={["#3b82f6"]} // Default selected range color
            showDateDisplay={true}
            color="#f87171" // Booked dates color
            renderDayContents={(day) => (
              <div className={`${getDateColor(day)} rounded-full w-full h-full flex items-center justify-center`}>
                {day.getDate()}
              </div>
            )}
          />
        </div>
      </div>
      <div className="mb-4">
        <label
          htmlFor="guests"
          className="block text-gray-700 font-bold mb-2 text-center"
        >
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
      {error && <p className="text-red-700 text-center">{error}</p>}
      {success && <p className="text-green-700 text-center">{success}</p>}
      <div className="flex justify-center">
        <button
          onClick={handleBooking}
          className="bg-blue-700 text-white py-2 px-4 rounded-md hover:bg-blue-800"
          disabled={loading}
        >
          {loading ? "Booking..." : "Book Now"}
        </button>
      </div>
    </div>
  );
};

export default BookingCalendar;
