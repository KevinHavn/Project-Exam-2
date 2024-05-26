/* eslint-disable react/prop-types */
const Modal = ({ onClose, children }) => {
	return (
		<div
			className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
			onClick={onClose} // Close the modal when clicking outside the content
		>
			<div
				className="bg-white p-4 rounded-md shadow-md relative max-w-lg w-full"
				onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the content
			>
				<button
					onClick={onClose}
					className="absolute top-2 right-2 text-gray-700 hover:text-gray-800">
					&times;
				</button>
				<div className="max-h-96 overflow-y-auto">{children}</div>
			</div>
		</div>
	);
};

export default Modal;
