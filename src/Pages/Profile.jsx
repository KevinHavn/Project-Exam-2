import { useContext, useState } from "react";
import { UserContext } from "../Components/UserContext";
import ProfileInfo from "../Components/Profile/ProfileInfo";
import BookingList from "../Components/Profile/BookingList";
import EditProfileModal from "../Components/Profile/EditProfileModal";

const Profile = () => {
	const { user } = useContext(UserContext);
	const [isModalOpen, setIsModalOpen] = useState(false);

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
					<BookingList userName={user.name} />
				</div>
			</div>
			{isModalOpen && (
				<EditProfileModal user={user} onClose={handleCloseModal} />
			)}
		</div>
	);
};

export default Profile;
