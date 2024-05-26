import { useState, useContext } from "react";
import { UserContext } from "../UserContext";

// Access the environment variable
const API_KEY = import.meta.env.VITE_API_KEY;

const VenueForm = () => {
	const { user } = useContext(UserContext);
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		media: [{ url: "", alt: "" }],
		price: 0,
		maxGuests: 0,
		rating: 0,
		meta: {
			wifi: false,
			parking: false,
			breakfast: false,
			pets: false,
		},
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

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		if (type === "checkbox") {
			setFormData((prevFormData) => ({
				...prevFormData,
				meta: {
					...prevFormData.meta,
					[name]: checked,
				},
			}));
		} else if (name.startsWith("media")) {
			const index = parseInt(name.split(".")[1], 10);
			const field = name.split(".")[2];
			const updatedMedia = formData.media.map((m, i) =>
				i === index ? { ...m, [field]: value } : m
			);
			setFormData((prevFormData) => ({
				...prevFormData,
				media: updatedMedia,
			}));
		} else if (name.startsWith("location")) {
			const field = name.split(".")[1];
			setFormData((prevFormData) => ({
				...prevFormData,
				location: {
					...prevFormData.location,
					[field]: value,
				},
			}));
		} else {
			setFormData((prevFormData) => ({
				...prevFormData,
				[name]: type === "number" ? parseFloat(value) : value,
			}));
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await fetch(
				"https://v2.api.noroff.dev/holidaze/venues",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${user.accessToken}`,
						"X-Noroff-API-Key": API_KEY,
					},
					body: JSON.stringify(formData),
				}
			);
			if (!response.ok) {
				throw new Error("Failed to create venue");
			}
			alert("Venue created successfully");
		} catch (error) {
			console.error("Error creating venue:", error);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="bg-white p-4 shadow-md rounded-md">
			<h2 className="text-xl font-bold mb-4">List a New Venue</h2>

			<div className="mb-4">
				<label htmlFor="name" className="block text-gray-700 font-bold mb-2">
					Venue Name
				</label>
				<input
					type="text"
					id="name"
					name="name"
					value={formData.name}
					onChange={handleChange}
					required
					className="w-full px-3 py-2 border rounded-md"
				/>
			</div>

			<div className="mb-4">
				<label
					htmlFor="description"
					className="block text-gray-700 font-bold mb-2">
					Description
				</label>
				<textarea
					id="description"
					name="description"
					value={formData.description}
					onChange={handleChange}
					required
					className="w-full px-3 py-2 border rounded-md"
				/>
			</div>

			<div className="mb-4">
				<label htmlFor="price" className="block text-gray-700 font-bold mb-2">
					Price
				</label>
				<input
					type="number"
					id="price"
					name="price"
					value={formData.price}
					onChange={handleChange}
					required
					className="w-full px-3 py-2 border rounded-md"
				/>
			</div>

			<div className="mb-4">
				<label
					htmlFor="maxGuests"
					className="block text-gray-700 font-bold mb-2">
					Max Guests
				</label>
				<input
					type="number"
					id="maxGuests"
					name="maxGuests"
					value={formData.maxGuests}
					onChange={handleChange}
					required
					className="w-full px-3 py-2 border rounded-md"
				/>
			</div>

			<div className="mb-4">
				<label
					htmlFor="mediaUrl"
					className="block text-gray-700 font-bold mb-2">
					Media URL
				</label>
				<input
					type="url"
					id="mediaUrl"
					name="media.0.url"
					value={formData.media[0].url}
					onChange={handleChange}
					className="w-full px-3 py-2 border rounded-md"
				/>
			</div>

			<div className="mb-4">
				<label
					htmlFor="mediaAlt"
					className="block text-gray-700 font-bold mb-2">
					Media Alt Text
				</label>
				<input
					type="text"
					id="mediaAlt"
					name="media.0.alt"
					value={formData.media[0].alt}
					onChange={handleChange}
					className="w-full px-3 py-2 border rounded-md"
				/>
			</div>

			<div className="mb-4">
				<label className="block text-gray-700 font-bold mb-2">Amenities</label>
				<label className="inline-flex items-center">
					<input
						type="checkbox"
						name="wifi"
						checked={formData.meta.wifi}
						onChange={handleChange}
						className="form-checkbox"
					/>
					<span className="ml-2">WiFi</span>
				</label>
				<label className="inline-flex items-center ml-4">
					<input
						type="checkbox"
						name="parking"
						checked={formData.meta.parking}
						onChange={handleChange}
						className="form-checkbox"
					/>
					<span className="ml-2">Parking</span>
				</label>
				<label className="inline-flex items-center ml-4">
					<input
						type="checkbox"
						name="breakfast"
						checked={formData.meta.breakfast}
						onChange={handleChange}
						className="form-checkbox"
					/>
					<span className="ml-2">Breakfast</span>
				</label>
				<label className="inline-flex items-center ml-4">
					<input
						type="checkbox"
						name="pets"
						checked={formData.meta.pets}
						onChange={handleChange}
						className="form-checkbox"
					/>
					<span className="ml-2">Pets</span>
				</label>
			</div>

			<div className="mb-4">
				<h3 className="text-lg font-bold">Location</h3>
				<div className="mb-2">
					<label
						htmlFor="address"
						className="block text-gray-700 font-bold mb-2">
						Address
					</label>
					<input
						type="text"
						id="address"
						name="location.address"
						value={formData.location.address}
						onChange={handleChange}
						className="w-full px-3 py-2 border rounded-md"
					/>
				</div>
				<div className="mb-2">
					<label htmlFor="city" className="block text-gray-700 font-bold mb-2">
						City
					</label>
					<input
						type="text"
						id="city"
						name="location.city"
						value={formData.location.city}
						onChange={handleChange}
						className="w-full px-3 py-2 border rounded-md"
					/>
				</div>
				<div className="mb-2">
					<label htmlFor="zip" className="block text-gray-700 font-bold mb-2">
						Zip
					</label>
					<input
						type="text"
						id="zip"
						name="location.zip"
						value={formData.location.zip}
						onChange={handleChange}
						className="w-full px-3 py-2 border rounded-md"
					/>
				</div>
				<div className="mb-2">
					<label
						htmlFor="country"
						className="block text-gray-700 font-bold mb-2">
						Country
					</label>
					<input
						type="text"
						id="country"
						name="location.country"
						value={formData.location.country}
						onChange={handleChange}
						className="w-full px-3 py-2 border rounded-md"
					/>
				</div>
				<div className="mb-2">
					<label
						htmlFor="continent"
						className="block text-gray-700 font-bold mb-2">
						Continent
					</label>
					<input
						type="text"
						id="continent"
						name="location.continent"
						value={formData.location.continent}
						onChange={handleChange}
						className="w-full px-3 py-2 border rounded-md"
					/>
				</div>
				<div className="mb-2">
					<label htmlFor="lat" className="block text-gray-700 font-bold mb-2">
						Latitude
					</label>
					<input
						type="number"
						id="lat"
						name="location.lat"
						value={formData.location.lat}
						onChange={handleChange}
						className="w-full px-3 py-2 border rounded-md"
					/>
				</div>
				<div className="mb-2">
					<label htmlFor="lng" className="block text-gray-700 font-bold mb-2">
						Longitude
					</label>
					<input
						type="number"
						id="lng"
						name="location.lng"
						value={formData.location.lng}
						onChange={handleChange}
						className="w-full px-3 py-2 border rounded-md"
					/>
				</div>
			</div>

			<button
				type="submit"
				className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700">
				Create Venue
			</button>
		</form>
	);
};

export default VenueForm;
