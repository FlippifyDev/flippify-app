import { useState, useEffect, MouseEvent } from 'react';
import { Lato } from 'next/font/google';
import { IoMenu } from 'react-icons/io5';
import { FaHouse } from 'react-icons/fa6';
import { FaSearch, FaBook, FaDiscord, FaSignInAlt } from "react-icons/fa";
import { MdGroups } from 'react-icons/md';
import Link from 'next/link';
import AnimationArrow from '@/app/components/AnimationArrow';
import { useRouter } from 'next/navigation';

const lato = Lato({ weight: '900', style: 'italic', subsets: ['latin'] });

const Navbar = () => {
	const [isScrolled, setIsScrolled] = useState(false);
    const router = useRouter();

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 0);
		};

		window.addEventListener('scroll', handleScroll);
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	return (
		<div className={`navbar grid grid-cols-12 grid-rows-1 items-center px-4 py-3 text-white transition duration-300 ${isScrolled ? 'bg-base-100 opacity-90 transition-colors duration-500' : 'bg-transparent'}`}>
			<div className="col-span-2 z-50">
				<a href="/l/home" className={`${lato.className} text-white text-4xl hover:text-gray-300 transition-colors duration-400`}>flippify</a>
			</div>

			<div className="drawer md:hidden flex justify-end col-span-10">
				<input id="my-drawer" type="checkbox" className="drawer-toggle" />
				<div className="drawer-content flex flex-col lg:ml-64 right-0">
					<label
						htmlFor="my-drawer"
						className="btn btn-primary text-white text-2xl bg-transparent border-transparent shadow-none drawer-button xl:hidden hover:bg-transparent hover:border-transparent hover:scale-125 z-50">
						<IoMenu />
					</label>
				</div>
				{/* Side bar which appears on small screens */}
				<div className="drawer-side opacity-98 z-40">
					<label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
					<ul className="menu bg-base-200 text-base-content min-h-full w-full pt-24 gap-2">
						<li className="transition duration-100 active:bg-gray-700 rounded-btn grid grid-cols-12 gap-8 items-center mx-2 text-white text-lg font-medium">
							<span className='col-span-1 rounded-none'><FaHouse className="text-lg pb-[2px]" /></span>
							<span className='col-span-11 rounded-none'><Link href="/l/home" className="text-left">Home</Link></span>
						</li>
						<li className="transition duration-100 active:bg-gray-700 rounded-btn grid grid-cols-12 gap-8 items-center mx-2 text-white text-lg font-medium">
							<span className='col-span-1 rounded-none'><FaBook className="text-lg pb-[2px]" /></span>
							<span className='col-span-11 rounded-none'><Link href="/l/services" className="col-span-10 text-left">Services</Link></span>
						</li>
						<li className="transition duration-100 active:bg-gray-700 rounded-btn grid grid-cols-12 gap-8 items-center mx-2 text-white text-lg font-medium">
							<span className='col-span-1 rounded-none'><FaSearch className="text-lg" /></span>
							<span className='col-span-11 rounded-none'><Link href="/l/plans" className="col-span-10 text-left">Plans</Link></span>
						</li>
						<li className="transition duration-100 active:bg-gray-700 rounded-btn grid grid-cols-12 gap-8 items-center mx-2 text-white text-lg font-medium">
							<span className='col-span-1 rounded-none'><FaDiscord className="text-lg" /></span>
							<span className='col-span-11 rounded-none'><Link href="https://discord.gg/gNPYfe7YFm" target="_blank" className="col-span-10 text-left">Discord</Link></span>
						</li>
						{/* Adjusted Sign In button alignment */}
						<li className="transition duration-100 active:bg-gray-700 rounded-btn grid grid-cols-12 gap-8 items-center mx-2 text-white text-lg font-medium">
							<span><FaSignInAlt className="col-span-1 text-lg" /></span>
							<span className="col-span-11 text-left">
								<Link href="/l/login">Login</Link>
							</span>
						</li>
					</ul>
				</div>
			</div>

			{/* Main Navbar which appears on larger screens */}
			<ul className="hidden md:flex flex-row space-x-3 xl:space-x-8 col-span-8 justify-center">
				<li className="transition duration-100 hover:scale-105 rounded-btn p-1">
					<Link href="/l/home">Home</Link>
				</li>
				<li className="transition duration-100 hover:scale-105 rounded-btn p-1">
					<Link href="/l/services">Services</Link>
				</li>
				<li className="transition duration-100 hover:scale-105 rounded-btn p-1">
					<Link href="/l/plans">Plans</Link>
				</li>
				<li className="transition duration-100 hover:scale-105 rounded-btn p-1">
					<Link href="https://discord.gg/gNPYfe7YFm" target="_blank">Discord</Link>
				</li>
			</ul>

			<div className="hidden md:flex items-center col-span-2 justify-end">
                <div className='transition duration-100 hover:scale-105 rounded-btn p-1'>
                    <a className="text-white group flex flex-row" onClick={() => router.push('/l/login')}>
                        <span className='text-md select-none'>Sign in</span>
                        <span className='pt-[2px] pl-1'><AnimationArrow /></span>
                    </a>
                </div>
			</div>
		</div>
	);
};

export default Navbar;
