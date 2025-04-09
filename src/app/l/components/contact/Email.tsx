"use client";

import { supportEmail } from '@/utils/constants';

import { FaClipboardList } from "react-icons/fa";
import { useState } from 'react';
import { FaCheck } from "react-icons/fa6";

const Email = () => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(supportEmail).then(() => {
            setCopied(true);

            setTimeout(() => {
                setCopied(false); // Reset the copied state after 2 seconds
            }, 2000);
        }).catch((error) => {
            console.error("Error copying email: ", error);
        });
    };

    return (
        <div className="w-full max-w-[16rem]">
            <div className='relative'>
                <span className='block w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-500 text-sm rounded-lg'>{supportEmail}</span>
                <div onClick={copyToClipboard} className="absolute end-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:bg-gray-100 rounded-lg p-2 inline-flex items-center justify-center">
                    {copied ? <FaCheck className='text-lg' /> : <FaClipboardList className='text-lg' />}
                </div>

                {/* Tooltip */}
                <div
                    role="tooltip"
                    className={`absolute right-[-16px] top-[-42px] z-10 inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-xs ${copied ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    style={{ transition: 'opacity 0.3s ease' }}
                >
                    <span>Copied!</span>
                </div>
            </div>
        </div>
    );
};

export default Email;
