import AnimationArrow from '@/app/components/AnimationArrow';
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'

interface NavbarDropdownProps {
    links: { label: string, description?: string; href: string, icon?: JSX.Element }[];
    isHovered: boolean;
    hoverIndex: number;
}

const NavbarDropdown: React.FC<NavbarDropdownProps> = ({ links, isHovered, hoverIndex }) => {
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        if (dropdownRef.current) {
            setHeight(dropdownRef.current.scrollHeight); // Measure the full height of the content
        }
    }, [links.length]); // Re-run on change in the number of links

    // Determine the position based on the hover index
    let dropdownPosition: string;

    const getDropdownPosition = (index: number) => {
        switch (index) {
            case 0:
                return '';
            case 1:
                return 'left-[68px] transform translate-x-[68px]';
            default:
                return '';
        }
    };



    return (
        <div
            ref={dropdownRef}
            className={`absolute ${getDropdownPosition(hoverIndex)} left-[-3rem] p-2 bg-gray-100 shadow-lg rounded-md font-semibold origin-top overflow-hidden transition-all duration-300 ease-in-out ${isHovered ? 'opacity-100 translate-y-3 max-h-[32rem]' : 'opacity-0 translate-y-0 max-h-0'
                }`}
            style={{
                top: '150%',
                opacity: isHovered ? 1 : 0,
                transform: isHovered ? 'translateY(0)' : 'translateY(10px)',
                maxHeight: isHovered ? `${height}px` : '0px',
                overflow: 'hidden',
                transitionProperty: 'max-height, opacity, transform, left',
                left: getDropdownPosition(hoverIndex),
            }}
        >
            <ul className="space-y-2">
                {links.map((link, index) => (
                    <li
                        key={index}
                        className="text-sm p-6 w-96 bg-white rounded-md transform transition duration-200"
                    >
                        <Link href={link.href} className="group flex flex-row items-start text-gray-700 hover:text-gray-900">
                            <div className="mr-3">
                                {link.icon && <span className="mr-2">{link.icon}</span>}
                            </div>
                            <div className="flex flex-col">
                                <div className='flex flex-row'>
                                    <span className="flex flex-row items-center">{link.label}</span>
                                    <span><AnimationArrow className='scale-75' /></span>
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
    );
};

export default NavbarDropdown;
