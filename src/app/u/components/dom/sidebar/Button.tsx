'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';

interface SidebarButtonProps {
    text: string;
    redirect?: string;
    symbol: React.ReactNode;
    isSidebarOpen: boolean;
    onClick?: () => void;
}

const SidebarButton: React.FC<SidebarButtonProps> = ({
    text,
    redirect,
    symbol,
    isSidebarOpen,
    onClick,
}) => {
    const { data: session } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    const [hovered, setHovered] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
    const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const basePath = `/u/${session?.user?.username}`;
    const isActive = pathname === `${basePath}/${redirect}`;

    const handleClick = () => {
        if (!onClick) {
            if (session) {
                if (session.user?.username) {
                    router.push(`${basePath}/${redirect}`);
                } else {
                    router.push(`/u/loading`);
                }
            }
        } else {
            onClick();
        }
    };

    useEffect(() => {
        if (hovered && buttonRef.current && !isSidebarOpen) {
            const rect = buttonRef.current.getBoundingClientRect();
            setTooltipPos({
                top: rect.top + rect.height / 2,
                left: rect.right + 14, // 8px to the right
            });
        }
    }, [hovered, isSidebarOpen]);

    const onMouseEnter = () => {
        setHovered(true);
        // After 300ms of hovered, actually show the tooltip
        hoverTimeoutRef.current = setTimeout(() => {
            setShowTooltip(true);
        }, 50);
    };

    const onMouseLeave = () => {
        setHovered(false);
        // If timer is still pending, clear it
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = null;
        }
        // Immediately hide tooltip
        setShowTooltip(false);
    };

    return (
        <>
            <div className="relative flex items-center justify-center">
                <button
                    ref={buttonRef}
                    onClick={handleClick}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    className={`relative z-50 flex items-center gap-4 p-1 ${isSidebarOpen ? 'justify-start w-full' : 'justify-center'
                        } active:bg-muted/30 hover:bg-muted/10 rounded-md transition duration-200 ${isActive ? 'text-white' : 'bg-black text-gray-400'
                        }`}
                >
                    <span
                        className={`w-8 h-8 flex justify-center items-center ${isActive ? 'text-houseBlue' : 'text-offWhite'
                            }`}
                    >
                        {symbol}
                    </span>

                    {/* Sidebar label when open */}
                    <span
                        className={`absolute left-14 text-sm text-left ${isActive ? 'font-semibold' : 'font-medium'
                            } ${isSidebarOpen ? 'opacity-100 max-w-full delay-100' : 'opacity-0 max-w-0'
                            } transition-all duration-150 ease-in-out overflow-hidden`}
                        style={{ whiteSpace: 'nowrap' }}
                    >
                        {text}
                    </span>
                </button>
            </div>

            {/* Tooltip: uses fixed positioning, but only becomes visible once showTooltip is true */}
            {!isSidebarOpen && (
                <div
                    className={`fixed top-0 left-0 pointer-events-none z-50 transition-opacity duration-200 ${showTooltip ? 'opacity-100' : 'opacity-0'
                        }`}
                    style={{
                        top: tooltipPos.top,
                        left: tooltipPos.left,
                        transform: 'translateY(-50%)',
                        whiteSpace: 'nowrap',
                    }}
                >
                    <div className="bg-black text-white text-xs px-2 py-1 rounded-sm shadow-md">
                        {text}
                    </div>
                </div>
            )}
        </>
    );
};

export default SidebarButton;
