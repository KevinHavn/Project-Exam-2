/* eslint-disable react/prop-types */
import { useState, useContext } from "react";
import { UserContext } from "../UserContext";
import Modal from "../Modal";

const API_KEY = import.meta.env.VITE_API_KEY;

const EditProfileModal = ({ user, onClose }) => {
	const { login } = useContext(UserContext);
	const [formData, setFormData] = useState({
		avatar: { url: user.avatar.url, alt: user.avatar.alt },
		banner: { url: user.banner.url, alt: user.banner.alt },
		bio: user.bio,
		venueManager: user.venueManager,
	});

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		if (type === "checkbox") {
			setFormData((prevFormData) => ({
				...prevFormData,
				[name]: checked,
			}));
		} else if (name.startsWith("avatar") || name.startsWith("banner")) {
			const field = name.split(".")[1];
			setFormData((prevFormData) => ({
				...prevFormData,
				[name.split(".")[0]]: {
					...prevFormData[name.split(".")[0]],
					[field]: value,
				},
			}));
		} else {
			setFormData((prevFormData) => ({
				...prevFormData,
				[name]: value,
			}));
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await fetch(
				`https://v2.api.noroff.dev/holidaze/profiles/${user.name}`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${user.accessToken}`,
						"X-Noroff-API-Key": API_KEY,
					},
					body: JSON.stringify(formData),
				}
			);

			if (!response.ok) {
				throw new Error("Failed to update profile");
			}

			const updatedUser = { ...user, ...formData };
			login(updatedUser);
			alert("Profile updated successfully");
			onClose();
		} catch (error) {
			console.error("Error updating profile:", error);
		}
	};

	return (
		<Modal onClose={onClose}>
			<form
				onSubmit={handleSubmit}
				className="bg-white p-4 shadow-md rounded-md">
				<h2 className="text-xl font-bold mb-4">Edit Profile</h2>

				<div className="mb-4">
					<label htmlFor="avatarUrl" className="block  font-bold mb-2">
						Avatar URL
					</label>
					<input
						type="url"
						id="avatarUrl"
						name="avatar.url"
						value={formData.avatar.url}
						onChange={handleChange}
						className="w-full px-3 py-2 border rounded-md"
					/>
				</div>

				<div className="mb-4">
					<label htmlFor="avatarAlt" className="block  font-bold mb-2">
						Avatar Alt Text
					</label>
					<input
						type="text"
						id="avatarAlt"
						name="avatar.alt"
						value={formData.avatar.alt}
						onChange={handleChange}
						className="w-full px-3 py-2 border rounded-md"
					/>
				</div>

				<div className="mb-4">
					<label htmlFor="bannerUrl" className="block  font-bold mb-2">
						Banner URL
					</label>
					<input
						type="url"
						id="bannerUrl"
						name="banner.url"
						value={formData.banner.url}
						onChange={handleChange}
						className="w-full px-3 py-2 border rounded-md"
					/>
				</div>

				<div className="mb-4">
					<label htmlFor="bannerAlt" className="block  font-bold mb-2">
						Banner Alt Text
					</label>
					<input
						type="text"
						id="bannerAlt"
						name="banner.alt"
						value={formData.banner.alt}
						onChange={handleChange}
						className="w-full px-3 py-2 border rounded-md"
					/>
				</div>

				<div className="mb-4">
					<label htmlFor="bio" className="block  font-bold mb-2">
						Bio
					</label>
					<textarea
						id="bio"
						name="bio"
						value={formData.bio}
						onChange={handleChange}
						className="w-full px-3 py-2 border rounded-md"
					/>
				</div>

				<div className="mb-4">
					<label className="inline-flex items-center">
						<input
							type="checkbox"
							name="venueManager"
							checked={formData.venueManager}
							onChange={handleChange}
							className="form-checkbox"
						/>
						<span className="ml-2">Venue Manager</span>
					</label>
				</div>

				<button
					type="submit"
					className="w-full bg-blue-700 text-white py-2 px-4 rounded-md hover:bg-blue-800">
					Save Changes
				</button>
			</form>
		</Modal>
	);
};

export default EditProfileModal;
