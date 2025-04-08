// Local Imports
import NavbarItem from './NavbarItem';
import AnimationArrow from '@/app/components/AnimationArrow';
import NavbarDropdown from './NavbarDropdown';
import { discordLink } from '@/utils/constants';


// External Imports
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Lato } from 'next/font/google';
import Link from 'next/link';

// Icons
import { IoMenu } from 'react-icons/io5';
import { RxCross2 } from "react-icons/rx";
import { ImBubble } from "react-icons/im";
import { MdAccountBalance } from "react-icons/md";
import { FaHouse, FaBoxOpen, FaParachuteBox } from 'react-icons/fa6';
import { FaSearch, FaBook, FaDiscord, FaSignInAlt, FaStore } from "react-icons/fa";
import { FaShieldAlt, FaFileContract, FaQuestionCircle, FaBalanceScale, FaSitemap } from 'react-icons/fa';


const lato = Lato({ weight: '900', style: 'italic', subsets: ['latin'] });


interface ILinks {
    label: string;
    description?: string;
    href: string;
    icon?: JSX.Element;
}

const Navbar = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [hoverIndex, setHoverIndex] = useState(0);
    const [links, setLinks] = useState<ILinks[]>();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const productLinks = [
        { label: "Accounting Software", description: "Streamline finances and track transactions", href: "/accounting-software", icon: <MdAccountBalance className="text-lg" /> },
        { label: "Inventory Management", description: "Track stock and optimize inventory levels", href: "/inventory-management", icon: <FaBoxOpen className="text-lg" /> },
        { label: "Order Management", description: "Efficiently manage and fulfill orders", href: "/order-management", icon: <FaParachuteBox className="text-lg" /> },
        { label: "Store Management", description: "Control your eBay store operations seamlessly", href: "/store-management", icon: <FaStore className="text-lg" /> },
    ]

    const resourceLinks = [
        {
            label: "About Us",
            description: "Learn who we are and what we do",
            href: "/about",
            icon: <ImBubble className="text-lg" />
        },
        {
            label: "Privacy Policy",
            description: "How we protect your data",
            href: "/privacy-policy",
            icon: <FaShieldAlt className="text-lg" />
        },
        {
            label: "Terms & Conditions",
            description: "Legal terms of using our services",
            href: "/terms-and-conditions",
            icon: <FaFileContract className="text-lg" />
        },
        {
            label: "FAQs",
            description: "Common questions, answered",
            href: "/faq",
            icon: <FaQuestionCircle className="text-lg" />
        },
        {
            label: "Attributions",
            description: "Credits to resources and tools we use",
            href: "/attributions",
            icon: <FaBalanceScale className="text-lg" />
        },
        {
            label: "Sitemap",
            description: "All pages in one place",
            href: "/sitemap",
            icon: <FaSitemap className="text-lg" />
        }
    ];

    function handleHover(index: number) {
        setHoverIndex(index);
        switch (index) {
            case 0:
                setLinks(productLinks);
                break;
            case 1:
                setLinks(resourceLinks);
                break;
            default:
                setLinks(undefined);
                break;
        }
    }

    return (
        <nav className={`max-w-5.5xl mx-auto flex flex-row justify-between gap-6 items-center px-4 py-3 text-white transition duration-300`}>
            <div className="drawer md:hidden flex justify-end">
                <input id="my-drawer" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content flex flex-col lg:ml-64 right-0">
                    <label
                        htmlFor="my-drawer"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className={`btn btn-primary ${sidebarOpen ? "text-gray-800": "text-white"} text-2xl bg-transparent border-transparent shadow-none drawer-button xl:hidden hover:bg-transparent hover:border-transparent hover:scale-125 z-50`}>
                        {sidebarOpen ? <RxCross2 className='text-base'/> : <IoMenu />}
                    </label>
                </div>
                {/* Side bar which appears on small screens */}
                <div className="drawer-side z-40">
                    <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                    <ul className="menu bg-white min-h-full w-full pt-16 gap-2 text-md text-gray-800 font-medium">
                        <li className="transition duration-100 active:bg-gray-100 rounded-btn grid grid-cols-12 gap-8 items-center mx-2">
                            <span className='col-span-1 rounded-none'><FaHouse className="pb-[2px]" /></span>
                            <span className='col-span-11 rounded-none'><Link href="/l/home" className="text-left">Home</Link></span>
                        </li>
                        <li className="transition duration-100 active:bg-gray-100 rounded-btn grid grid-cols-12 gap-8 items-center mx-2">
                            <span className='col-span-1 rounded-none'><FaBook className="pb-[2px]" /></span>
                            <span className='col-span-11 rounded-none'><Link href="/l/products" className="col-span-10 text-left">Products</Link></span>
                        </li>
                        <li className="transition duration-100 active:bg-gray-100 rounded-btn grid grid-cols-12 gap-8 items-center mx-2">
                            <span className='col-span-1 rounded-none'><FaSearch className="" /></span>
                            <span className='col-span-11 rounded-none'><Link href="/l/pricing" className="col-span-10 text-left">Pricing</Link></span>
                        </li>
                        <li className="transition duration-100 active:bg-gray-100 rounded-btn grid grid-cols-12 gap-8 items-center mx-2">
                            <span className='col-span-1 rounded-none'><FaDiscord className="" /></span>
                            <span className='col-span-11 rounded-none'><Link href={discordLink} target="_blank" className="col-span-10 text-left">Discord</Link></span>
                        </li>
                        <li className="transition duration-100 active:bg-gray-100 rounded-btn grid grid-cols-12 gap-8 items-center mx-2">
                            <span><FaSignInAlt className="col-span-1" /></span>
                            <span className="col-span-11 text-left">
                                <Link href="/l/login">Login</Link>
                            </span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Main Navbar which appears on larger screens */}
            <ul
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="hidden md:flex flex-row justify-center items-center gap-3 xl:gap-12 py-2"
            >
                <div
                    onMouseEnter={() => setHoverIndex(-1)}
                    className="z-50"
                >
                    <a href="/l/home" className={`${lato.className} text-white text-2xl hover:text-gray-300 transition-colors duration-400`}>flippify</a>
                </div>
                <div className='relative flex flex-row items-center space-x-3 xl:space-x-12'>
                    <NavbarItem title="Products" handleHover={handleHover} isHovered={isHovered} hoverIndex={0} />
                    <NavbarItem title="Resources" handleHover={handleHover} isHovered={isHovered} hoverIndex={1} />
                    <NavbarItem title="Partnerships" link="/partnerships" handleHover={handleHover} isHovered={isHovered} hoverIndex={-1} />
                    <NavbarItem title="Pricing" link="/l/pricing" handleHover={handleHover} isHovered={isHovered} hoverIndex={-1} />

                    {isHovered && links && (
                        <NavbarDropdown links={links} isHovered={isHovered} hoverIndex={hoverIndex} />
                    )}
                </div>
            </ul>

            <div className="hidden md:flex items-center justify-end">
                <div className='transition duration-100 rounded-btn p-1'>
                    <a className="text-white group flex flex-row hover:text-gray-300" onClick={() => router.push('/l/login')}>
                        <span className='text-sm select-none font-semibold'>Login</span>
                        <span className='pt-[1px] pl-1'><AnimationArrow /></span>
                    </a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
