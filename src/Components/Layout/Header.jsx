import { useContext, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext";

const Header = () => {
	const { user, logout } = useContext(UserContext);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const dropdownRef = useRef(null);

	const toggleDropdown = () => {
		setIsDropdownOpen(!isDropdownOpen);
	};

	const handleClickOutside = (event) => {
		if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
			setIsDropdownOpen(false);
		}
	};

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<header className="bg-blue-600 p-4 text-white">
			<div className="container mx-auto flex justify-between items-center">
				<h1 className="text-2xl font-bold">Holidaze</h1>
				<nav>
					<ul className="flex space-x-4 items-center">
						<li>
							<Link to="/" className="hover:text-gray-300">
								Home
							</Link>
						</li>
						<li>
							<Link to="/about" className="hover:text-gray-300">
								About
							</Link>
						</li>
						<li>
							<Link to="/venues" className="hover:text-gray-300">
								Venues
							</Link>
						</li>
						{user && (
							<li className="relative" ref={dropdownRef}>
								<button
									onClick={toggleDropdown}
									className="flex items-center hover:text-gray-300">
									{user.name}
									<svg
										className="ml-2 w-4 h-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M19 9l-7 7-7-7"></path>
									</svg>
								</button>
								{isDropdownOpen && (
									<div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg z-20">
										<Link
											to="/profile"
											className="block px-4 py-2 text-sm hover:bg-gray-200">
											Profile
										</Link>
										{user.venueManager && (
											<Link
												to="/venue-manager"
												className="block px-4 py-2 text-sm hover:bg-gray-200">
												Venue Manager
											</Link>
										)}
										<button
											onClick={logout}
											className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-200">
											Log out
										</button>
									</div>
								)}
							</li>
						)}
					</ul>
				</nav>
			</div>
		</header>
	);
};

export default Header;
