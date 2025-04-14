import AnimationArrow from '@/app/components/AnimationArrow';
import Link from 'next/link';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

interface NavbarDropdownProps {
    links: { label: string; description?: string; href: string; icon?: JSX.Element }[];
    isHovered: boolean;
    hoverIndex: number;
}

const NavbarDropdown: React.FC<NavbarDropdownProps> = ({ links, isHovered, hoverIndex }) => {
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const [height, setHeight] = useState(0);

    useLayoutEffect(() => {
        if (dropdownRef.current) {
            setHeight(dropdownRef.current.scrollHeight);
        }
    }, [links.length]);

    const getDropdownPosition = (index: number) => {
        switch (index) {
            case 0:
                return '';
            case 1:
                return 'left-[28px] transform translate-x-[28px]';
            default:
                return '';
        }
    };

    const getDropdownArrowPosition = (index: number) => {
        switch (index) {
            case 0:
                return '';
            case 1:
                return 'left-[60px] transform translate-x-[60px]';
            default:
                return '';
        }
    };

    return (
        <div
            className={`absolute ${getDropdownPosition(hoverIndex)} left-[-3rem] rounded-md font-semibold origin-top overflow-hidden transition-all duration-300 ease-in-out 
                ${isHovered ? 'opacity-100 translate-y-3' : 'opacity-0 translate-y-0'
                }`}
            style={{
                top: '150%',
                opacity: isHovered ? 1 : 0,
                transform: isHovered ? 'translateY(0)' : 'translateY(10px)',
                height: isHovered ? `${height + 100}px` : '0px',
                left: getDropdownPosition(hoverIndex),
            }}
        >
            {/* Arrow */}
            <div
                className={`absolute ${getDropdownArrowPosition(hoverIndex)} top-5 left-[2.7rem] -translate-y-full transition-all duration-300 ease-in-out w-3 h-3`}
                style={{
                    transitionProperty: 'opacity, transform, left',
                    left: getDropdownArrowPosition(hoverIndex),
                }}
            >
                <div className="w-4 h-4 bg-gray-100 rotate-45 rounded-[2px]"></div>
            </div>

            <div
                ref={dropdownRef}
                className={`flex p-2 bg-gray-100 shadow-lg rounded-md font-semibold origin-top overflow-hidden transition-all duration-300 ease-in-out 
                    ${isHovered ? 'opacity-100 translate-y-3' : 'opacity-0 translate-y-0'
                    }`}
                style={{
                    maxHeight: isHovered ? `${height + 200}px` : '0px',
                    transitionProperty: 'max-height, opacity, transform, left',
                }}
            >
                {/* Dropdown content */}
                <ul className="flex-grow h-full space-y-2">
                    {links.map((link, index) => (
                        <li
                            key={index}
                            className="text-sm p-6 w-96 bg-white rounded-md transform transition duration-200"
                        >
                            <Link
                                href={link.href}
                                className="group flex flex-row items-start text-gray-700 hover:text-gray-900"
                            >
                                <div className="mr-3">
                                    {link.icon && <span className="mr-2">{link.icon}</span>}
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex flex-row">
                                        <span className="flex flex-row items-center">{link.label}</span>
                                        <span>
                                            <AnimationArrow className="scale-75" />
                                        </span>
                                    </div>
                                    <span className="text-sm font-medium text-gray-500 group-hover:text-gray-800 transition duration-200">
                                        {link.description}
                                    </span>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default NavbarDropdown;
