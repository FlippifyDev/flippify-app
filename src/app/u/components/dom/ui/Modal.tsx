import React from 'react'
import { IoClose } from 'react-icons/io5'


interface ModalProps {
    children?: React.ReactNode;
    setDisplayModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const Modal: React.FC<ModalProps> = ({ children, setDisplayModal }) => {
    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-40">
            <div className="relative bg-white p-6 rounded-lg shadow-lg w-80 sm:w-96">
                {/* Close Button (Cross Icon) */}
                <button
                    className="absolute -top-5 -right-5 text-white rounded-full bg-[#3c424b] p-2 shadow-gray-700 shadow-[rgba(0,0,0,0.2)_-2px_2px_8px] z-50"
                    onClick={() => setDisplayModal(false)}
                >
                    <IoClose size={24} />
                </button>


                {children}

            </div>
        </div>
    )
}

export default Modal
