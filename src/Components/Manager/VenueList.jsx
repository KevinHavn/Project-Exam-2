/* eslint-disable react/prop-types */
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../UserContext";
import Modal from "../Modal";

const API_KEY = import.meta.env.VITE_API_KEY;

const VenueList = ({ venues, setVenues }) => {
	const { user } = useContext(UserContext);
	const [selectedVenue, setSelectedVenue] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [editForm, setEditForm] = useState({
		name: "",
		description: "",
		media: { url: "", alt: "" },
		price: 0,
		maxGuests: 0,
		rating: 0,
		meta: { wifi: false, parking: false, breakfast: false, pets: false },
		location: {
			address: "",
			city: "",
			zip: "",
			country: "",
			continent: "",
			lat: 0,
			lng: 0,
		},
	});

	useEffect(() => {
		if (selectedVenue) {
			setEditForm({
				name: selectedVenue.name || "",
				description: selectedVenue.description || "",
				media: selectedVenue.media[0] || { url: "", alt: "" },
				price: selectedVenue.price || 0,
				maxGuests: selectedVenue.maxGuests || 0,
				rating: selectedVenue.rating || 0,
				meta: selectedVenue.meta || {
					wifi: false,
					parking: false,
					breakfast: false,
					pets: false,
				},
				location: selectedVenue.location || {
					address: "",
					city: "",
					zip: "",
					country: "",
					continent: "",
					lat: 0,
					lng: 0,
				},
			});
		}
	}, [selectedVenue]);

	const handleCardClick = (venue) => {
		setSelectedVenue(venue);
		setShowModal(true);
	};

	const handleCloseModal = () => {
		setShowModal(false);
		setSelectedVenue(null);
	};

	const handleDeleteVenue = async () => {
		if (!selectedVenue) return;

		try {
			const response = await fetch(
				`https://v2.api.noroff.dev/holidaze/venues/${selectedVenue.id}`,
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

			setVenues((prevVenues) =>
				prevVenues.filter((venue) => venue.id !== selectedVenue.id)
			);
			handleCloseModal();
		} catch (error) {
			console.error("Error deleting venue: ", error);
		}
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		const keys = name.split(".");
		if (keys.length > 1) {
			setEditForm((prevForm) => ({
				...prevForm,
				[keys[0]]: {
					...prevForm[keys[0]],
					[keys[1]]: value,
				},
			}));
		} else {
			setEditForm((prevForm) => ({ ...prevForm, [name]: value }));
		}
	};

	const handleCheckboxChange = (e) => {
		const { name, checked } = e.target;
		setEditForm((prevForm) => ({
			...prevForm,
			meta: { ...prevForm.meta, [name]: checked },
		}));
	};

	const handleEditVenue = async () => {
		if (!selectedVenue) return;

		const payload = {
			...editForm,
			media: [editForm.media],
		};

		try {
			const response = await fetch(
				`https://v2.api.noroff.dev/holidaze/venues/${selectedVenue.id}`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${user.accessToken}`,
						"X-Noroff-API-Key": API_KEY,
					},
					body: JSON.stringify(payload),
				}
			);

			if (!response.ok) {
				throw new Error(`Error: ${response.statusText}`);
			}

			const updatedVenue = await response.json();

			setVenues((prevVenues) =>
				prevVenues.map((venue) =>
					venue.id === updatedVenue.id ? updatedVenue : venue
				)
			);
			handleCloseModal();
		} catch (error) {
			console.error("Error editing venue: ", error);
		}
	};

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
						className="block cursor-pointer"
						onClick={() => handleCardClick(venue)}>
						<div className="bg-white rounded-lg shadow-md p-4 mb-4">
							<div className="mb-4">
								<img
									src={venue.media[0]?.url}
									alt={venue.media[0]?.alt || "Venue image"}
									className="w-full h-48 object-cover rounded-t-lg"
								/>
							</div>
							<div className="mb-2">
								<h2 className="text-xl font-semibold truncate">{venue.name}</h2>
								<p className="text-gray-800 overflow-hidden overflow-ellipsis whitespace-nowrap">
									{venue.description}
								</p>
							</div>
							<div className="mb-2">
								<p className="text-gray-800 font-bold">Price: ${venue.price}</p>
								<p className="text-gray-800">Max Guests: {venue.maxGuests}</p>
								<p className="text-gray-800">Rating: {venue.rating}</p>
								<p className="text-gray-800">
									Bookings: {venue._count.bookings}
								</p>
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
					</div>
				))
			)}
			{showModal && selectedVenue && (
				<Modal onClose={handleCloseModal}>
					<div className="max-h-96 overflow-y-auto p-4">
						<h2 className="text-xl font-bold mb-2">Edit Venue</h2>
						<div className="mb-4">
							<img
								src={selectedVenue.media[0]?.url || "default-image-url.jpg"}
								alt={selectedVenue.media[0]?.alt || "Venue image"}
								className="w-full h-48 object-cover rounded-t-lg mb-4"
							/>
						</div>
						<form className="space-y-4">
							<div>
								<label htmlFor="name" className="block text-gray-700">
									Name
								</label>
								<input
									type="text"
									id="name"
									name="name"
									value={editForm.name}
									onChange={handleInputChange}
									className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
								/>
							</div>
							<div>
								<label htmlFor="description" className="block text-gray-700">
									Description
								</label>
								<textarea
									id="description"
									name="description"
									value={editForm.description}
									onChange={handleInputChange}
									className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
								/>
							</div>
							<div>
								<label htmlFor="media.url" className="block text-gray-700">
									Media URL
								</label>
								<input
									type="text"
									id="media.url"
									name="media.url"
									value={editForm.media.url}
									onChange={handleInputChange}
									className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
								/>
							</div>
							<div>
								<label htmlFor="media.alt" className="block text-gray-700">
									Media Alt Text
								</label>
								<input
									type="text"
									id="media.alt"
									name="media.alt"
									value={editForm.media.alt}
									onChange={handleInputChange}
									className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
								/>
							</div>
							<div>
								<label htmlFor="price" className="block text-gray-700">
									Price
								</label>
								<input
									type="number"
									id="price"
									name="price"
									value={editForm.price}
									onChange={handleInputChange}
									className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
								/>
							</div>
							<div>
								<label htmlFor="maxGuests" className="block text-gray-700">
									Max Guests
								</label>
								<input
									type="number"
									id="maxGuests"
									name="maxGuests"
									value={editForm.maxGuests}
									onChange={handleInputChange}
									className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
								/>
							</div>
							<div>
								<label htmlFor="rating" className="block text-gray-700">
									Rating
								</label>
								<input
									type="number"
									id="rating"
									name="rating"
									value={editForm.rating}
									onChange={handleInputChange}
									className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
								/>
							</div>
							<div>
								<label className="block text-gray-700">Amenities</label>
								<div className="flex items-center">
									<input
										type="checkbox"
										id="wifi"
										name="wifi"
										checked={editForm.meta.wifi}
										onChange={handleCheckboxChange}
										className="mr-2"
									/>
									<label htmlFor="wifi" className="text-gray-700">
										WiFi
									</label>
								</div>
								<div className="flex items-center">
									<input
										type="checkbox"
										id="parking"
										name="parking"
										checked={editForm.meta.parking}
										onChange={handleCheckboxChange}
										className="mr-2"
									/>
									<label htmlFor="parking" className="text-gray-700">
										Parking
									</label>
								</div>
								<div className="flex items-center">
									<input
										type="checkbox"
										id="breakfast"
										name="breakfast"
										checked={editForm.meta.breakfast}
										onChange={handleCheckboxChange}
										className="mr-2"
									/>
									<label htmlFor="breakfast" className="text-gray-700">
										Breakfast
									</label>
								</div>
								<div className="flex items-center">
									<input
										type="checkbox"
										id="pets"
										name="pets"
										checked={editForm.meta.pets}
										onChange={handleCheckboxChange}
										className="mr-2"
									/>
									<label htmlFor="pets" className="text-gray-700">
										Pets allowed
									</label>
								</div>
							</div>
							<div>
								<label className="block text-gray-700">Location</label>
								<div className="grid grid-cols-2 gap-4">
									<div>
										<label
											htmlFor="location.address"
											className="block text-gray-700">
											Address
										</label>
										<input
											type="text"
											id="location.address"
											name="location.address"
											placeholder="Address"
											value={editForm.location.address}
											onChange={handleInputChange}
											className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
										/>
									</div>
									<div>
										<label
											htmlFor="location.city"
											className="block text-gray-700">
											City
										</label>
										<input
											type="text"
											id="location.city"
											name="location.city"
											placeholder="City"
											value={editForm.location.city}
											onChange={handleInputChange}
											className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
										/>
									</div>
									<div>
										<label
											htmlFor="location.zip"
											className="block text-gray-700">
											Zip
										</label>
										<input
											type="text"
											id="location.zip"
											name="location.zip"
											placeholder="Zip"
											value={editForm.location.zip}
											onChange={handleInputChange}
											className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
										/>
									</div>
									<div>
										<label
											htmlFor="location.country"
											className="block text-gray-700">
											Country
										</label>
										<input
											type="text"
											id="location.country"
											name="location.country"
											placeholder="Country"
											value={editForm.location.country}
											onChange={handleInputChange}
											className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
										/>
									</div>
									<div>
										<label
											htmlFor="location.continent"
											className="block text-gray-700">
											Continent
										</label>
										<input
											type="text"
											id="location.continent"
											name="location.continent"
											placeholder="Continent"
											value={editForm.location.continent}
											onChange={handleInputChange}
											className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
										/>
									</div>
									<div>
										<label
											htmlFor="location.lat"
											className="block text-gray-700">
											Latitude
										</label>
										<input
											type="number"
											id="location.lat"
											name="location.lat"
											placeholder="Latitude"
											value={editForm.location.lat}
											onChange={handleInputChange}
											className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
										/>
									</div>
									<div>
										<label
											htmlFor="location.lng"
											className="block text-gray-700">
											Longitude
										</label>
										<input
											type="number"
											id="location.lng"
											name="location.lng"
											placeholder="Longitude"
											value={editForm.location.lng}
											onChange={handleInputChange}
											className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
										/>
									</div>
								</div>
							</div>
						</form>
						<div className="flex justify-between mt-4">
							<button
								onClick={handleEditVenue}
								className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded">
								Save Changes
							</button>
							<button
								onClick={handleDeleteVenue}
								className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded">
								Delete Venue
							</button>
						</div>
					</div>
				</Modal>
			)}
		</div>
	);
};

export default VenueList;
