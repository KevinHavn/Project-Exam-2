/* eslint-disable react/prop-types */

const ProfileInfo = ({ user, onEditProfileClick }) => {
	return (
		<div className="bg-white p-4 shadow-md rounded-md">
			<div className="text-center mb-4">
				<img
					src={user.avatar.url}
					alt={user.avatar.alt || "Profile image"}
					className="w-32 h-32 rounded-full mx-auto object-cover"
				/>
			</div>
			<h2 className="text-2xl font-bold text-center mb-2">{user.name}</h2>
			<p className="text-gray-600 text-center mb-4">{user.bio}</p>
			<div className="text-center">
				<button
					onClick={onEditProfileClick}
					className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700">
					Edit Profile
				</button>
			</div>
		</div>
	);
};

export default ProfileInfo;
