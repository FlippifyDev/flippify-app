import React from 'react'
import { IoClose } from 'react-icons/io5'


interface ModalProps {
    title?: string;
    className?: string;
    children?: React.ReactNode;
    setDisplayModal: (display: boolean) => void;
}

const Modal: React.FC<ModalProps> = ({ title, className, children, setDisplayModal }) => {
    return (
        <div className="fixed sm:absolute inset-0 flex justify-center items-start pt-24 pb-8 sm:pt-0 sm:items-center bg-black bg-opacity-50 z-40 overflow-y-auto">
            <div className={`relative bg-white rounded-lg shadow-lg w-80 sm:w-96 ${className}`}>
                {/* Close Button (Cross Icon) */}
                <button
                    className="absolute -top-5 -right-5 text-white rounded-full bg-[#3c424b] p-2 shadow-gray-700 shadow-[rgba(0,0,0,0.2)_-2px_2px_8px] z-50"
                    onClick={() => setDisplayModal(false)}
                >
                    <IoClose size={24} />
                </button>
                {title && (
                    <div className='px-6 py-4'>
                        <h1 className='font-semibold text-lg'>{title}</h1>
                    </div>
                )}
                <hr />

                <div className='w-full p-6'>
                    {children}
                </div>

            </div>
        </div>
    )
}

export default Modal
