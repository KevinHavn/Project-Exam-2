/* eslint-disable react/prop-types */
import { useState, useContext } from "react";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";
import { loginUser } from "./Login";

const LoginForm = ({ switchToRegister }) => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const [submitStatus, setSubmitStatus] = useState(null);
	const { login } = useContext(UserContext);
	const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitStatus("Submitting...");

		try {
			await loginUser(formData.email, formData.password, login);
			setSubmitStatus("Login successful.");
			navigate("/venues");
		} catch (error) {
			setSubmitStatus(`Error: ${error.message}`);
		}
	};

	return (
		<div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg">
			<form onSubmit={handleSubmit}>
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
					<button
						type="submit"
						className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700">
						Log In
					</button>
				</div>
			</form>
			{submitStatus && (
				<p
					className={`mt-4 text-center ${
						submitStatus.startsWith("Error") ? "text-red-500" : "text-green-500"
					}`}>
					{submitStatus}
				</p>
			)}
			<label className="mt-4 text-center">
				Don&apos;t have an account?{" "}
				<button
					onClick={switchToRegister}
					className="text-blue-500 hover:underline">
					Register
				</button>
			</label>
		</div>
	);
};

export default LoginForm;
