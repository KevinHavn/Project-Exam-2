/* eslint-disable react/prop-types */
const Modal = ({ onClose, children }) => {
	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
			<div className="bg-white p-4 rounded-md shadow-md relative">
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
