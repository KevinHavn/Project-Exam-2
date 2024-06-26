/* eslint-disable react/prop-types */
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import { loginUser } from "./Login";

const RegisterForm = ({ switchToLogin }) => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		bio: "",
		avatarUrl: "",
		avatarAlt: "",
		venueManager: false,
	});

	const [submitStatus, setSubmitStatus] = useState(null);
	const { login } = useContext(UserContext);
	const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData({
			...formData,
			[name]: type === "checkbox" ? checked : value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitStatus("Submitting...");

		const payload = {
			name: formData.name,
			email: formData.email,
			password: formData.password,
			bio: formData.bio,
			avatar: {
				url: formData.avatarUrl,
				alt: formData.avatarAlt,
			},
			venueManager: formData.venueManager,
		};

		try {
			const response = await fetch("https://v2.api.noroff.dev/auth/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});

			const responseData = await response.json();

			if (!response.ok) {
				const errorMessage = responseData.errors
					? responseData.errors.map((err) => err.message).join(", ")
					: responseData.message || JSON.stringify(responseData);
				throw new Error(errorMessage);
			}

			await loginUser(formData.email, formData.password, login);

			setSubmitStatus("Registration and Login successful.");
			navigate("/venues");
		} catch (error) {
			setSubmitStatus(`Error: ${error.message}`);
		}
	};

	return (
		<div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg">
			<form onSubmit={handleSubmit}>
				<div className="mb-4">
					<label htmlFor="name" className="block text-gray-700 font-bold mb-2">
						Username
					</label>
					<input
						type="text"
						id="name"
						name="name"
						value={formData.name}
						onChange={handleChange}
						required
						className="w-full px-3 py-2 border rounded-md"
						pattern="^[\w]+$"
						maxLength={20}
						title="Must be a name, and can't exceed 20 characters."
					/>
				</div>
				<div className="mb-4">
					<label htmlFor="email" className="block text-gray-700 font-bold mb-2">
						Email
					</label>
					<input
						type="email"
						id="email"
						name="email"
						value={formData.email}
						onChange={handleChange}
						required
						className="w-full px-3 py-2 border rounded-md"
						pattern="^[\w\-.]+@(stud\.)?noroff\.no$"
						title="Must be Noroff.no or Stud.noroff.no e-mail address"
					/>
				</div>
				<div className="mb-4">
					<label
						htmlFor="password"
						className="block text-gray-700 font-bold mb-2">
						Password
					</label>
					<input
						type="password"
						id="password"
						name="password"
						value={formData.password}
						onChange={handleChange}
						required
						className="w-full px-3 py-2 border rounded-md"
						minLength={8}
						title="Minimum 8 characters"
					/>
				</div>
				<div className="mb-4">
					<label htmlFor="bio" className="block text-gray-700 font-bold mb-2">
						Bio
					</label>
					<textarea
						id="bio"
						name="bio"
						value={formData.bio}
						onChange={handleChange}
						className="w-full px-3 py-2 border rounded-md"
						maxLength={180}></textarea>
				</div>
				<div className="mb-4">
					<label
						htmlFor="avatarUrl"
						className="block text-gray-700 font-bold mb-2">
						Avatar URL
					</label>
					<input
						type="url"
						id="avatarUrl"
						name="avatarUrl"
						value={formData.avatarUrl}
						onChange={handleChange}
						className="w-full px-3 py-2 border rounded-md"
					/>
				</div>
				<div className="mb-4">
					<label
						htmlFor="avatarAlt"
						className="block text-gray-700 font-bold mb-2">
						Avatar Alt Text
					</label>
					<input
						type="text"
						id="avatarAlt"
						name="avatarAlt"
						value={formData.avatarAlt}
						onChange={handleChange}
						className="w-full px-3 py-2 border rounded-md"
					/>
				</div>
				<div className="mb-4"></div>
				<div className="mb-4">
					<label
						htmlFor="venueManager"
						className="block text-gray-700 font-bold mb-2">
						<input
							type="checkbox"
							id="venueManager"
							name="venueManager"
							checked={formData.venueManager}
							onChange={handleChange}
							className="mr-2 leading-tight"
						/>
						Venue Manager
					</label>
				</div>
				<div className="mb-4">
					<button
						type="submit"
						className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded-md ">
						Register
					</button>
				</div>
			</form>
			{submitStatus && (
				<p
					className={`mt-4 text-center ${
						submitStatus.startsWith("Error") ? "text-red-700" : "text-green-700"
					}`}>
					{submitStatus}
				</p>
			)}
			<label className="mt-4 text-center">
				Already have an account?{" "}
				<button
					onClick={switchToLogin}
					className="text-blue-700 hover:text-blue-800 hover:underline">
					Log In
				</button>
			</label>
		</div>
	);
};

export default RegisterForm;
