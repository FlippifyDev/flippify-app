"use client";

// Local Imoports
import { handleSignOut } from "@/services/sign-out";
import LayoutSubscriptionWrapper from "../../layout/LayoutSubscriptionWrapper";
import { createBillingPortalUrl } from "@/services/stripe/create";
import { discordLink, discordSupportLink, userProfileImages } from "@/utils/constants";

// External Imports
import { MdOutlineAdminPanelSettings, MdOutlineBubbleChart, MdOutlineKeyboardArrowDown, MdOutlinePrivacyTip, MdPersonOutline } from "react-icons/md";
import { PiSignOutBold, PiWalletBold } from "react-icons/pi";
import { useState, useRef, useEffect } from "react";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { RiDiscordLine } from "react-icons/ri";
import { useSession } from "next-auth/react";
import { TbTestPipe } from "react-icons/tb";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ProfileLetters from "../ui/ProfileLetters";
import { formatUsername } from "@/utils/format";



const NavbarProfileAvatar = () => {
    const { data: session } = useSession();
    const [billingUrl, setBillingUrl] = useState<string | null>(null);
    const router = useRouter();
    const customerIdRef = useRef<string | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const root = process.env.ROOT as string;

    // Default avatar
    let avatar: string | null = "https://i.imgur.com/uOCy7MN.jpeg";
    let referral_code = "None";

    if (session) {
        if (session.user?.metaData?.image) {
            avatar = session.user.metaData.image;
            if (userProfileImages.includes(avatar)) {
                avatar = null;
            }
        }
        if (session?.user.referral?.referralCode) {
            referral_code = session.user.referral.referralCode;
        }
    }

    useEffect(() => {
        const fetchCheckoutUrl = async () => {
            if (session?.user) {
                const user = session.user;
                customerIdRef.current = user.stripeCustomerId || null;

                if (customerIdRef.current) {
                    try {
                        const url = await createBillingPortalUrl(
                            user.username ?? "",
                            customerIdRef.current
                        );
                        setBillingUrl(url);
                    } catch (error) {
                        setBillingUrl(
                            root.concat("/u/failed-to-create-billing-portal")
                        );
                    }
                }
            }
        };

        fetchCheckoutUrl();
    }, [session, root]);


    const handleBillingPortalButtonClick = () => {
        if (billingUrl) {
            window.open(billingUrl, "_blank");
        }
    };

    const handleProfileOpen = (e: React.MouseEvent) => {
        if (session) {
            if (session.user?.username) {
                router.push(`/u/${session.user.username}/profile`);
            } else {
                router.push(`/u/loading`);
            }
        }
    };

    const handleSubscriptionsOpen = (e: React.MouseEvent) => {
        if (session) {
            if (session.user?.username) {
                router.push(`/u/${session.user.username}/plans`);
            } else {
                router.push(`/u/loading`);
            }
        }
    }

    const toggleDropdown = () => {
        setIsDropdownOpen((prevState) => !prevState); // Toggles the dropdown state
    };

    const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (!target.closest('.dropdown')) {
            setIsDropdownOpen(false); // Closes dropdown when clicking outside
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleAdminOpen = (e: React.MouseEvent) => {
        if (session) {
            if (session.user?.username) {
                router.push(`/u/${session.user.username}/asldf0987asDa230fDsADMIN`);
            } else {
                router.push(`/u/loading`);
            }
        }
    };

    const handleTestingOpen = (e: React.MouseEvent) => {
        if (session) {
            if (session.user?.username) {
                router.push(`/u/${session.user.username}/bfoau214QNI42nAjTEST`);
            } else {
                router.push(`/u/loading`);
            }
        }
    };

    function handleOpen(url: string) {
        window.open(url, "_blank");
    }

    return (
        <div className="dropdown dropdown-end h-6 border-l border-uiBorder pl-2 lg:pl-6">
            <div
                tabIndex={0}
                role="button"
                className="flex flex-row items-center"
                onClick={toggleDropdown}
            >
                <div className="w-6 rounded-full mr-2">
                    {avatar && (
                        <Image
                            alt="Avatar"
                            src={avatar}
                            width={50}
                            height={50}
                            loading="lazy"
                            className="rounded-full"
                        />
                    )}
                    {!avatar && (
                        <ProfileLetters text={formatUsername(session?.user.username ?? "N/A")} containerClassName='border border-uiBorder w-6 h-6' className='text-[0.60rem] text-white' />
                    )}
                </div>
                <div className="text-sm text-white inline-flex items-center select-none">
                    <span className="mr-2">{session?.user.username}</span>
                    <span className="text-lg"><MdOutlineKeyboardArrowDown /></span>
                </div>
            </div>
            {isDropdownOpen && ( // Conditionally render the dropdown menu
                <div className="fixed top-14 right-0">
                    <ul
                        tabIndex={0}
                        className="menu menu-sm p-0 dropdown-content bg-black border border-uiBorder text-white w-72 shadow rounded-bl-md"
                    >
                        <div className="border-b border-uiBorder p-4 flex items-center">
                            <div className="w-10 rounded-full mr-2 border border-uiBorder">
                                {avatar && (
                                    <Image
                                        alt="Avatar"
                                        src={avatar}
                                        width={50}
                                        height={50}
                                        loading="lazy"
                                        className="rounded-full"
                                    />
                                )}
                                {!avatar && (
                                    <ProfileLetters text={formatUsername(session?.user.username ?? "N/A")} containerClassName='border border-uiBorder w-10 h-10 ' className='text-sm text-white' />
                                )}
                            </div>
                            <div className="text-sm flex flex-col">
                                <span className="mr-2 text-white">{session?.user.username}</span>
                                <span className="mr-2 text-gray-500 text-xs">{session?.user.email}</span>
                            </div>
                        </div>
                        <div className="w-full">
                            <div className="px-[0.75rem] my-2">
                                <span className="text-white font-semibold">Account</span>
                            </div>
                            <button
                                className='relative w-full grid grid-cols-12 py-1 gap-5 items-center flex-wrap flex-shrink-0 align-items hover:bg-muted/10 active:bg-muted/30 transition duration-100'
                                onClick={handleProfileOpen}>
                                <span className='col-span-2 px-[0.75rem]'><MdPersonOutline className="text-lg" /></span>
                                <span className='col-span-10 text-start py-[0.25rem] text-[0.875rem]'>Profile</span>
                            </button>
                            <button
                                className='relative w-full grid grid-cols-12 py-1 gap-5 items-center flex-wrap flex-shrink-0 align-items hover:bg-muted/10 active:bg-muted/30 transition duration-100'
                                onClick={handleSubscriptionsOpen}>
                                <span className='col-span-2 px-[0.75rem]'><FaMagnifyingGlass /></span>
                                <span className='col-span-10 text-start py-[0.25rem] text-[0.875rem]'>Subscriptions</span>
                            </button>
                            <LayoutSubscriptionWrapper requiredSubscriptions={['admin']}>
                                <button
                                    className='relative w-full grid grid-cols-12 py-1 gap-5 items-center flex-wrap flex-shrink-0 align-items hover:bg-muted/10 active:bg-muted/30 transition duration-100'
                                    onClick={handleAdminOpen}>
                                    <span className='col-span-2 px-[0.75rem]'><MdOutlineAdminPanelSettings /></span>
                                    <span className='col-span-10 text-start py-[0.25rem] text-[0.875rem]'>Admin</span>
                                </button>
                            </LayoutSubscriptionWrapper>
                            <button
                                className='relative w-full grid grid-cols-12 py-1 gap-5 items-center flex-wrap flex-shrink-0 align-items hover:bg-muted/10 active:bg-muted/30 transition duration-100'
                                onClick={handleBillingPortalButtonClick}>
                                <span className='col-span-2 px-[0.75rem]'><PiWalletBold className="text-lg" /></span>
                                <span className='col-span-10 text-start py-[0.25rem] text-[0.875rem]'>Billing</span>
                            </button>
                            <div className="px-[0.75rem] my-2">
                                <span className="text-white font-semibold">Resources</span>
                            </div>
                            <button
                                className='relative w-full grid grid-cols-12 py-1 gap-5 items-center flex-wrap flex-shrink-0 align-items hover:bg-muted/10 active:bg-muted/30 transition duration-100'
                                onClick={() => handleOpen("/l/blog")}>
                                <span className='col-span-2 px-[0.75rem]'><MdOutlineBubbleChart className="text-lg" /></span>
                                <span className='col-span-10 text-start py-[0.25rem] text-[0.875rem]'>Blog</span>
                            </button>
                            <button
                                className='relative w-full grid grid-cols-12 py-1 gap-5 items-center flex-wrap flex-shrink-0 align-items rounded-b-md hover:bg-muted/10 active:bg-muted/30 transition duration-100'
                                onClick={() => handleOpen(discordLink)}>
                                <span className='col-span-2 px-[0.75rem]'><RiDiscordLine className="text-lg" /></span>
                                <span className='col-span-10 text-start py-[0.25rem] text-[0.875rem]'>Discord</span>
                            </button>
                            <button
                                className='relative w-full grid grid-cols-12 py-1 gap-5 items-center flex-wrap flex-shrink-0 align-items rounded-b-md hover:bg-muted/10 active:bg-muted/30 transition duration-100'
                                onClick={() => handleOpen(discordSupportLink)}>
                                <span className='col-span-2 px-[0.75rem]'><IoChatboxEllipsesOutline className="text-lg" /></span>
                                <span className='col-span-10 text-start py-[0.25rem] text-[0.875rem]'>Support</span>
                            </button>
                            <button
                                className='relative w-full grid grid-cols-12 py-1 gap-5 items-center flex-wrap flex-shrink-0 align-items rounded-b-md hover:bg-muted/10 active:bg-muted/30 transition duration-100'
                                onClick={() => handleOpen("/l/privacy-policy")}>
                                <span className='col-span-2 px-[0.75rem]'><MdOutlinePrivacyTip className="text-lg" /></span>
                                <span className='col-span-10 text-start py-[0.25rem] text-[0.875rem]'>Privacy Policy</span>
                            </button>
                            <div className="w-full border-b border-uiBorder my-1"></div>
                            <button
                                className='relative w-full grid grid-cols-12 py-1 gap-5 items-center flex-wrap flex-shrink-0 align-items rounded-b-md hover:bg-muted/10 active:bg-muted/30 transition duration-100'
                                onClick={() => handleSignOut()}>
                                <span className='col-span-2 px-[0.75rem]'><PiSignOutBold /></span>
                                <span className='col-span-10 text-start py-[0.25rem] text-[0.875rem]'>Sign Out</span>
                            </button>
                        </div>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default NavbarProfileAvatar;
