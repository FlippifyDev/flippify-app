import React from 'react'

interface NavbarItemProps {
    title: string;
    icon: React.ReactNode;
    isSubscribed: boolean;
}

const NabarItem: React.FC<NavbarItemProps> = ({ title, icon, isSubscribed }) => {
    return (
        <div className="relative inline-block group">
            {icon}
            {/* Tooltip */}
            <div className="absolute left-1/4 transform -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 text-nowrap">
                    {!isSubscribed ? "Subscription Required" : title}
                </div>
            </div>
        </div>
    )
}

export default NabarItem
