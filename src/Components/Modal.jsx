/* eslint-disable react/prop-types */
const Modal = ({ onClose, children }) => {
	return (
		<div
			className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
			onClick={onClose} // Close the modal when clicking outside the content
		>
			<div
				className="bg-white p-4 rounded-md shadow-md relative"
				onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the content
			>
				<button
					onClick={onClose}
					className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
					&times;
				</button>
				{children}
			</div>
		</div>
	);
};

export default Modal;
