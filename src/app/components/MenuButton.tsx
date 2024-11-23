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
		<div className={`w-full h-full transition-all duration-500 ${isSidebarOpen ? 'grid grid-cols-12 pr-4 pl-2' : 'sm:flex sm:justify-center hidden'}`}>
			<Link
				href="/"
				className={`text-white text-3xl ${isSidebarOpen ? 'col-span-11 block' : 'hidden'} ${lato.className}`}
			>
				flippify
			</Link>
			<DarkHamburgerButton isActive={isSidebarOpen} onClick={onClick} />
		</div>
	);
};

export default MenuButton;
