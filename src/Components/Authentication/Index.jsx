import { useState } from "react";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";

const AuthenticationForms = () => {
	const [isRegister, setIsRegister] = useState(false);

	const switchToRegister = () => setIsRegister(true);
	const switchToLogin = () => setIsRegister(false);

	return (
		<div className="min-h-screen flex items-center justify-center">
			{isRegister ? (
				<RegisterForm switchToLogin={switchToLogin} />
			) : (
				<LoginForm switchToRegister={switchToRegister} />
			)}
		</div>
	);
};

export default AuthenticationForms;
 