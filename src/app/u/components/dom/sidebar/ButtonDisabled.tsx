"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

interface DisabledSideBarButtonProps {
    text: string;
    redirect: string;
    symbol: React.ReactNode;
    tooltip?: string;
    showAlert?: () => void;
    isSidebarOpen: boolean; // Control visibility of text on hover
}

const DisabledSideBarButton: React.FC<DisabledSideBarButtonProps> = ({
    text,
    redirect,
    symbol,
    tooltip,
    showAlert,
    isSidebarOpen,
}) => {
    const { data: session } = useSession();
    const pathname = usePathname();

    const basePath = `/u/${session?.user?.username}`;
    const isActive = pathname === `${basePath}/${redirect}`;

    const handleButtonClick = () => {
        if (showAlert) {
            showAlert();
        }
    };

    return (
        <div className="relative group flex items-center justify-center">
            <button
                className={`relative z-50 flex justify-start items-center gap-4 p-1 ${isSidebarOpen ? "justify-start w-full" : "justify-center"
                    } bg-black text-gray-600 rounded-md cursor-pointer transition duration-200`}
                onClick={handleButtonClick}
            >
                {/* Icon container with fixed dimensions */}
                <span className="w-8 h-8 flex justify-center items-center text-gray-600">
                    {symbol}
                </span>

                {/* Text – visibility controlled by isSidebarOpen */}
                <span
                    className={`absolute left-14 text-base text-left ${isActive ? "font-semibold" : "font-medium"
                        } ${isSidebarOpen ? "opacity-100 max-w-full" : "opacity-0 max-w-0"} transition-all duration-300 ease-in-out overflow-hidden`}
                    style={{ whiteSpace: "nowrap" }}
                >
                    {text}
                </span>
            </button>

            {/* Tooltip: Only show if sidebar is open */}
            {isSidebarOpen && tooltip && (
                <div className="absolute z-50 bottom-full text-nowrap mb-2 left-1/2 transform -translate-x-1/2 p-2 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {tooltip}
                </div>
            )}
        </div>
    );
};

export default DisabledSideBarButton;
