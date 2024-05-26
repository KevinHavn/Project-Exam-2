/* eslint-disable react/prop-types */
export const loginUser = async (email, password, login) => {
	const payload = { email, password };

	const response = await fetch(
		"https://v2.api.noroff.dev/auth/login?_holidaze=true",
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		}
	);

	const responseData = await response.json();

	if (!response.ok) {
		const errorMessage = responseData.errors
			? responseData.errors.map((err) => err.message).join(", ")
			: responseData.message || JSON.stringify(responseData);
		throw new Error(errorMessage);
	}

	const userData = {
		accessToken: responseData.data.accessToken,
		name: responseData.data.name,
		email: responseData.data.email,
		bio: responseData.data.bio,
		avatar: responseData.data.avatar,
		banner: responseData.data.banner,
		venueManager: responseData.data.venueManager || false,
	};

	login(userData);
	return userData;
};
