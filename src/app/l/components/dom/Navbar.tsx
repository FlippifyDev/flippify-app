// Local Imports
import NavbarItem from "./NavbarItem";
import SidebarSubItem from "./SidebarSubItem";
import NavbarDropdown from "./NavbarDropdown";
import AnimationArrow from "@/app/components/AnimationArrow";

// External Imports
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Lato } from "next/font/google";
import Link from "next/link";

// Icons
import { IoMenu } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { ImBubble } from "react-icons/im";
import { IoMdPricetags } from "react-icons/io";
import { MdAccountBalance, MdOutlineBubbleChart } from "react-icons/md";
import { PiRoadHorizonFill } from "react-icons/pi";
import { FaBook, FaStore, FaBoxes, FaFileAlt, FaPenFancy, FaRss } from "react-icons/fa";
import { FaBoxOpen, FaParachuteBox, FaHandshakeSimple } from "react-icons/fa6";
import {
    FaShieldAlt,
    FaFileContract,
    FaQuestionCircle,
    FaBalanceScale,
    FaSitemap,
    FaSignInAlt,
} from "react-icons/fa";
import { useSession } from "next-auth/react";

const lato = Lato({ weight: "900", style: "italic", subsets: ["latin"] });

interface ILinks {
    label: string;
    description?: string;
    href: string;
    icon?: JSX.Element;
}

const Navbar = () => {
    const { data: session } = useSession();
    const [isHovered, setIsHovered] = useState(false);
    const [hoverIndex, setHoverIndex] = useState(0);
    const [links, setLinks] = useState<ILinks[]>();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarSubMenu, setSidebarSubMenu] = useState(-1);

    const productLinks = [
        {
            label: "Accounting Software",
            description: "Streamline finances and track transactions",
            href: "/l/accounting-software",
            icon: <MdAccountBalance className="text-lg" />,
        },
        {
            label: "Inventory Management",
            description: "Track stock and optimize inventory levels",
            href: "/l/inventory-management",
            icon: <FaBoxOpen className="text-lg" />,
        },
        {
            label: "Order Management",
            description: "Efficiently manage and fulfill orders",
            href: "/l/order-management",
            icon: <FaParachuteBox className="text-lg" />,
        },
        {
            label: "Store Management",
            description: "Control your eBay store operations seamlessly",
            href: "/l/store-management",
            icon: <FaStore className="text-lg" />,
        },
        {
            label: "Our Roadmap",
            description: "See our upcoming features and tools",
            href: "/l/roadmap",
            icon: <PiRoadHorizonFill className="text-lg" />,
        },
    ];

    const resourceLinks = [
        {
            label: "Blog",
            description: "Latest tips, updates & stories from Flippify",
            href: "/l/blog",
            icon: <MdOutlineBubbleChart className="text-lg" />,
        },
        {
            label: "About Us",
            description: "Learn who we are and what we do",
            href: "/l/about",
            icon: <ImBubble className="text-lg" />,
        },
        {
            label: "Privacy Policy",
            description: "How we protect your data",
            href: "/l/privacy-policy",
            icon: <FaShieldAlt className="text-lg" />,
        },
        {
            label: "Terms & Conditions",
            description: "Legal terms of using our services",
            href: "/l/terms-and-conditions",
            icon: <FaFileContract className="text-lg" />,
        },
        {
            label: "FAQs",
            description: "Common questions, answered",
            href: "/l/faq",
            icon: <FaQuestionCircle className="text-lg" />,
        },
        {
            label: "Attributions",
            description: "Credits to resources and tools we use",
            href: "/l/attributions",
            icon: <FaBalanceScale className="text-lg" />,
        },
    ];

    const partnershipsLinks = [
        {
            label: "Become a Partner",
            description: "Join our partnership program and grow with us.",
            href: "/l/partnerships",
            icon: <FaHandshakeSimple className="text-lg" />,
        },
        {
            label: "Our Partners",
            description: "Meet the businesses and individuals we're proud to work with.",
            href: "/l/our-partners",
            icon: <FaSitemap className="text-lg" />,
        },
        {
            label: "Partner Login",
            description: "Access your partner dashboard.",
            href: "https://flippify.endorsely.com/login",
            icon: <FaSignInAlt className="text-lg" />,
        },
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
            case 2:
                setLinks(partnershipsLinks);
                break;
            default:
                setLinks(undefined);
                break;
        }
    }

    function handleLoginClick() {
        if (session && session.user && session.user.subscriptions) {
            router.push(`/u/${session.user.username}/dashboard`);
        } else {
            router.push("/l/login");
        }
    }

    return (
        <div className="md:px-8 lg:px-[44px]">
            <nav
                className={`max-w-6.5xl mx-auto flex flex-row justify-between gap-6 items-center py-3 text-white transition duration-300`}
            >
                <div className="drawer drawer-end relative md:hidden flex flex-col items-end">
                    <input id="my-drawer" type="checkbox" className="drawer-toggle" />
                    <div className="flex flex-row w-full items-center justify-between px-2">
                        <div className="md:hidden z-50 px-4">
                            <a
                                href="/l/home"
                                className={`${lato.className} ${sidebarOpen ? "text-gray-800" : "text-white"
                                    } text-2xl hover:text-gray-300 transition-colors duration-400`}
                            >
                                flippify
                            </a>
                        </div>
                        <div className="drawer-content flex flex-col lg:ml-64 right-0">
                            <label
                                htmlFor="my-drawer"
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className={`btn btn-primary ${sidebarOpen ? "text-gray-800" : "text-white"
                                    } text-2xl bg-transparent border-transparent shadow-none drawer-button xl:hidden hover:bg-transparent hover:border-transparent hover:scale-125 z-50`}
                            >
                                {sidebarOpen ? (
                                    <RxCross2 className="text-[20px]" />
                                ) : (
                                    <IoMenu />
                                )}
                            </label>
                        </div>
                    </div>

                    {/* Side bar which appears on small screens */}
                    <div className="drawer-side z-40">
                        <label
                            htmlFor="my-drawer"
                            aria-label="close sidebar"
                            className="drawer-overlay"
                        ></label>
                        <ul className="relative flex flex-col bg-white min-h-full px-4 w-full pt-[72px] gap-2 text-md text-gray-800 font-medium">
                            <div
                                className={`absolute right-0 left-0 ${sidebarOpen ? "block" : "hidden"
                                    } border-b border-dashed border-gray-300 w-screen z-50`}
                            ></div>
                            <li
                                onClick={() => setSidebarSubMenu(sidebarSubMenu === 0 ? -1 : 0)}
                                className="flex flex-col w-full transition duration-100 mt-6"
                            >
                                <div className="w-full grid grid-cols-12 gap-8 items-center active:bg-gray-100 p-2 rounded-md">
                                    <span className="col-span-1 rounded-none">
                                        <FaBoxes className="pb-[2px]" />
                                    </span>
                                    <span className="col-span-9 rounded-none">Products</span>
                                    <span className="col-span-2">
                                        <AnimationArrow
                                            className={`transition-all duration-200 ${sidebarSubMenu === 0 ? "rotate-90" : "rotate-0"
                                                }`}
                                        />
                                    </span>
                                </div>
                                {sidebarSubMenu === 0 && (
                                    <ul className="px-2 transition-all duration-200">
                                        <SidebarSubItem
                                            text="Accounting Software"
                                            href="/l/accounting-software"
                                            icon={<MdAccountBalance />}
                                        />
                                        <SidebarSubItem
                                            text="Inventory Management"
                                            href="/l/inventory-management"
                                            icon={<FaBoxOpen />}
                                        />
                                        <SidebarSubItem
                                            text="Order Management"
                                            href="/l/order-management"
                                            icon={<FaParachuteBox />}
                                        />
                                        <SidebarSubItem
                                            text="Store Management"
                                            href="/l/store-management"
                                            icon={<FaStore />}
                                        />
                                        <SidebarSubItem
                                            text="Our Roadmap"
                                            href="/l/roadmap"
                                            icon={<PiRoadHorizonFill />}
                                        />
                                    </ul>
                                )}
                            </li>
                            <li
                                onClick={() => setSidebarSubMenu(sidebarSubMenu === 1 ? -1 : 1)}
                                className="flex flex-col w-full transition duration-100 "
                            >
                                <div className="w-full grid grid-cols-12 gap-8 items-center active:bg-gray-100 p-2 rounded-md">
                                    <span className="col-span-1 rounded-none">
                                        <FaBook className="pb-[2px]" />
                                    </span>
                                    <span className="col-span-9 rounded-none">Resources</span>
                                    <span className="col-span-2">
                                        <AnimationArrow
                                            className={`transition-all duration-200 ${sidebarSubMenu === 1 ? "rotate-90" : "rotate-0"
                                                }`}
                                        />
                                    </span>
                                </div>
                                {sidebarSubMenu === 1 && (
                                    <ul className="px-2 transition-all duration-200">
                                        <SidebarSubItem
                                            text="Blog"
                                            href="/l/blog"
                                            icon={<MdOutlineBubbleChart />}
                                        />
                                        <SidebarSubItem
                                            text="About Us"
                                            href="/l/about"
                                            icon={<ImBubble />}
                                        />
                                        <SidebarSubItem
                                            text="Privacy Policy"
                                            href="/l/privacy-policy"
                                            icon={<FaShieldAlt />}
                                        />
                                        <SidebarSubItem
                                            text="Terms & Conditions"
                                            href="/l/terms-and-conditions"
                                            icon={<FaFileContract />}
                                        />
                                        <SidebarSubItem
                                            text="FAQs"
                                            href="/l/faq"
                                            icon={<FaQuestionCircle />}
                                        />
                                        <SidebarSubItem
                                            text="Attributions"
                                            href="/l/attributions"
                                            icon={<FaBalanceScale />}
                                        />
                                    </ul>
                                )}
                            </li>
                            <li
                                onClick={() => setSidebarSubMenu(sidebarSubMenu === 2 ? -1 : 2)}
                                className="flex flex-col w-full transition duration-100"
                            >
                                <div className="w-full grid grid-cols-12 gap-8 items-center active:bg-gray-100 p-2 rounded-md">
                                    <span className="col-span-1 rounded-none">
                                        <FaHandshakeSimple className="pb-[2px]" />
                                    </span>
                                    <span className="col-span-9 rounded-none">Partnerships</span>
                                    <span className="col-span-2">
                                        <AnimationArrow
                                            className={`transition-all duration-200 ${sidebarSubMenu === 2 ? "rotate-90" : "rotate-0"
                                                }`}
                                        />
                                    </span>
                                </div>
                                {sidebarSubMenu === 2 && (
                                    <ul className="px-2 transition-all duration-200">
                                        <SidebarSubItem
                                            text="Become a Partner"
                                            href="/l/partnerships"
                                            icon={<FaHandshakeSimple />}
                                        />
                                        <SidebarSubItem
                                            text="Our Partners"
                                            href="/l/our-partners"
                                            icon={<FaSitemap />}
                                        />
                                        <SidebarSubItem
                                            text="Partner Login"
                                            href="https://partnerships.flippify.io/"
                                            icon={<FaSignInAlt />}
                                        />
                                    </ul>
                                )}
                            </li>
                            <li className="flex flex-col w-full transition duration-100">
                                <div className="grid grid-cols-12 gap-8 items-center active:bg-gray-100 p-2 rounded-md">
                                    <span className="col-span-1 rounded-none">
                                        <IoMdPricetags className="" />
                                    </span>
                                    <span className="col-span-11 rounded-none">
                                        <Link href="/l/pricing" className="col-span-10 text-left">
                                            Pricing
                                        </Link>
                                    </span>
                                </div>
                            </li>
                            <li className="absolute right-0 left-0 w-full bottom-5">
                                <div className="w-full h-full flex justify-center items-center">
                                    <span className="flex flex-row justify-center items-center w-24 h-8 text-white transition duration-100 bg-houseBlue active:bg-houseHoverBlue rounded-full">
                                        <Link href="/l/login" className="text-sm mx-2">
                                            Login
                                        </Link>
                                        <AnimationArrow />
                                    </span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Main Navbar which appears on larger screens */}
                <ul
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className="hidden md:flex flex-row justify-center items-center gap-12 py-2"
                >
                    <div onMouseEnter={() => setHoverIndex(-1)} className="z-50">
                        <a
                            href="/l/home"
                            className={`${lato.className} text-white text-2xl hover:text-gray-300 transition-colors duration-400`}
                        >
                            flippify
                        </a>
                    </div>
                    <div className="relative flex flex-row items-center space-x-4 xl:space-x-8">
                        <NavbarItem
                            title="Products"
                            handleHover={handleHover}
                            isHovered={isHovered}
                            hoverIndex={0}
                        />
                        <NavbarItem
                            title="Resources"
                            handleHover={handleHover}
                            isHovered={isHovered}
                            hoverIndex={1}
                        />
                        <NavbarItem
                            title="Partnerships"
                            handleHover={handleHover}
                            isHovered={isHovered}
                            hoverIndex={2}
                        />
                        <NavbarItem
                            title="Pricing"
                            link="/l/pricing"
                            handleHover={handleHover}
                            isHovered={isHovered}
                            hoverIndex={-1}
                        />

                        {isHovered && links && (
                            <NavbarDropdown
                                links={links}
                                isHovered={isHovered}
                                hoverIndex={hoverIndex}
                            />
                        )}
                    </div>
                </ul>

                <div className="hidden md:flex items-center justify-end">
                    <div className="transition duration-100 rounded-btn p-1">
                        <a
                            className="text-white group flex flex-row hover:text-gray-300 cursor-pointer"
                            onClick={handleLoginClick}
                        >
                            <span className="text-sm select-none font-semibold">
                                {session?.user.subscriptions ? "Dashboard" : "Login"}
                            </span>
                            <span className="pl-1">
                                <AnimationArrow />
                            </span>
                        </a>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;