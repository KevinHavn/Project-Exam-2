import { useContext, useEffect, useState } from "react";
import { UserContext } from "../Components/UserContext";
import ProfileInfo from "../Components/Profile/ProfileInfo";
import BookingList from "../Components/Profile/BookingList";
import EditProfileModal from "../Components/Profile/EditProfileModal";

const API_KEY = import.meta.env.VITE_API_KEY;

const Profile = () => {
	const { user } = useContext(UserContext);
	const [bookings, setBookings] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);

	useEffect(() => {
		const fetchBookings = async () => {
			if (!user || !user.accessToken || !API_KEY) return;

			const headers = {
				Authorization: `Bearer ${user.accessToken}`,
				"X-Noroff-API-Key": API_KEY,
			};

			try {
				const response = await fetch(
					`https://v2.api.noroff.dev/holidaze/profiles/${user.name}/bookings`,
					{ headers }
				);

				const responseData = await response.json();
				setBookings(responseData.data);
			} catch (error) {
				console.error("Error fetching bookings:", error);
			}
		};

		fetchBookings();
	}, [user]);

	const handleEditProfileClick = () => {
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
	};

	if (!user) {
		return <div>Loading...</div>; // or some other fallback
	}

	return (
		<div className="container mx-auto p-4">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<ProfileInfo
						user={user}
						onEditProfileClick={handleEditProfileClick}
					/>
				</div>
				<div>
					<BookingList bookings={bookings} />
				</div>
			</div>
			{isModalOpen && (
				<EditProfileModal user={user} onClose={handleCloseModal} />
			)}
		</div>
	);
};

export default Profile;
