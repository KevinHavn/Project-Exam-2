/* eslint-disable react/prop-types */
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }) => {
	return (
		<div className="flex flex-col min-h-screen">
			<Header />
			<main className="flex-grow w-full mx-auto p-4 bg-stone-300">{children}</main>
			<Footer />
		</div>
	);
};

export default Layout;
