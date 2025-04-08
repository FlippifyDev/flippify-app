"use client";

import { useRouter } from 'next/navigation';

import "@/styles/navbar-arrow.css";

interface NavbarItemProps {
    title: string;
    link?: string;
    hoverIndex: number;
    isHovered: boolean;
    handleHover: (index: number) => void;
}


const NavbarItem: React.FC<NavbarItemProps> = ({ title, link, hoverIndex, isHovered, handleHover }) => {
    const router = useRouter();

    function handleClick(link: string | undefined) {
        if (link) {
            router.push(link);
        }
    }


    return (
        <li
            className='relative group hover:text-white/50'
            onMouseEnter={() => handleHover(hoverIndex)}
            onClick={() => handleClick(link)}
        >
            <span className={`transition duration-100 select-none text-[15px] font-semibold ${link ? 'cursor-pointer' : ''}`}>
                {title}
            </span>
            {!link && (
                <span className={`arrow ml-2 ${isHovered ? 'animate-arrow' : ''}`}>
                    <span className="line line1" />
                    <span className="line line2" />
                </span>
            )}
        </li>
    );
}


export default NavbarItem
