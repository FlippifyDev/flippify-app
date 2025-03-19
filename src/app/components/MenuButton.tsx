import Link from 'next/link';
import { Lato } from 'next/font/google';

import DarkHamburgerButton from './DarkHamburgerButton';

const lato = Lato({ weight: '900', style: 'italic', subsets: ['latin'] });


interface MenuButtonProps {
    isSidebarOpen: boolean,
    onClick: () => void;
}

const MenuButton: React.FC<MenuButtonProps> = ({ isSidebarOpen, onClick }) => {
    return (
        <div className={`relative w-full h-full transition-all duration-500 ${isSidebarOpen ? 'pl-2' : 'sm:flex sm:justify-center hidden'}`}>
            <Link
                href="/"
                className={`absolute text-white text-3xl ease-in ${isSidebarOpen ? 'opacity-100 delay-100 transition-all duration-500' : 'opacity-0'} ${lato.className}`}
            >
                flippify
            </Link>
            <DarkHamburgerButton isActive={isSidebarOpen} onClick={onClick} />
        </div>
    );
};

export default MenuButton;
