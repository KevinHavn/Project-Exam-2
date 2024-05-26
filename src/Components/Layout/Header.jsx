import { useContext, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext";

const Header = () => {
	const { user, logout } = useContext(UserContext);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const dropdownRef = useRef(null);

	const toggleDropdown = () => {
		setIsDropdownOpen(!isDropdownOpen);
	};

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
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
		<header className="bg-blue-700 p-4 text-white">
			<div className="container mx-auto flex justify-between items-center">
				<Link to="/venues">
					<h1 className="text-2xl font-bold logo hover:text-rose-200">
						Holidaze
					</h1>
				</Link>
				<button
					className="block md:hidden text-white focus:outline-none"
					onClick={toggleMenu}>
					<svg
						className="w-6 h-6"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M4 6h16M4 12h16m-7 6h7"></path>
					</svg>
				</button>
				<nav
					className={`${
						isMenuOpen ? "block" : "hidden"
					} md:flex md:items-center`}>
					<ul className="flex flex-col md:flex-row md:space-x-4 items-center">
						{!user && (
							<li>
								<Link to="/" className="hover:text-gray-300">
									Log in
								</Link>
							</li>
						)}
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
											Profile & Bookings
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
