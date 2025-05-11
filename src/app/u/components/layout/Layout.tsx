"use client";

import React, { Suspense, useState, useEffect } from "react";

import LayoutSubscriptionWrapper from "./LayoutSubscriptionWrapper";
import LayoutLoadingSkeleton from "./LayoutLoadingSkeleton";
import LightHamburgerButton from "@/app/components/LightHamburgerButton";
import LayoutNoAccess from "./LayoutNoAccess";
import NewListing from "../tools/navbar-tools/NewListing";
import NewOrder from "../tools/navbar-tools/NewOrder";
import Sidebar from "../dom/sidebar/Sidebar";
import Navbar from "../dom/navbar/Navbar";
import UploadOrders from "../tools/navbar-tools/UploadOrders";


interface LayoutProps {
    children: React.ReactNode;
    requiredSubscriptions?: string[];
    anySubscriptions?: string[];
    pagePath?: string;
    removePadding?: boolean;
}

const LayoutContent = ({ removePadding, children }: { removePadding?: boolean, children: React.ReactNode }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modal, setModal] = useState<React.ReactNode>(null);

    useEffect(() => {
        document.body.classList.remove('overflow-hidden');
        document.body.classList.remove('overflow-auto');
    }, []);


    function handleDisplayModal(display: boolean, type: string) {
        setIsModalOpen(display);

        switch (type) {
            case "add-listing":
                setModal(<NewListing setDisplayModal={setIsModalOpen} />)
                break;
            case "add-order":
                setModal(<NewOrder setDisplayModal={setIsModalOpen} />)
                break;
            case "upload-orders":
                setModal(<UploadOrders setDisplayModal={setIsModalOpen} />)
                break;
            default:
                setModal(null);
                break;
        }
    }

    return (
        <main className="flex flex-row min-h-screen overflow-x-hidden bg-userBackground">
            {/* Sidebar */}
            <section
                className={`fixed top-0 left-0 h-full transition-all duration-300 ease-in-out bg-white ${isSidebarOpen ? 'w-full sm:w-72 2xl:w-80' : 'hidden sm:block w-16'} z-50`}
            >
                <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            </section>

            {/* Content area */}
            <section className={`flex flex-col flex-grow transition-all duration-300 w-full h-screen ${isSidebarOpen ? 'sm:pl-72 2xl:pl-80' : 'sm:pl-16'}`}>
                {/* Navbar */}
                <div className="w-full h-14 bg-white z-30 sticky top-0 flex flex-row">
                    {/* Hamburger Icon for Mobile */}
                    <div className={`sm:hidden transition-all duration-500 ml-1 flex items-center justicy-center ${isSidebarOpen ? 'hidden' : 'block px-1'}`}>
                        <LightHamburgerButton isActive={isSidebarOpen} onClick={() => setIsSidebarOpen(!isSidebarOpen)} />
                    </div>
                    <Navbar handleDisplayModal={handleDisplayModal} />
                </div>

                {/* Scrollable main content */}
                <div className={`relative flex-grow overflow-y-auto scrollbar-hide z-20 ${removePadding ? '' : 'p-2 sm:p-4'}`}>
                    <Suspense fallback={<LayoutLoadingSkeleton />}>
                        {children}

                        {isModalOpen && modal}
                    </Suspense>
                </div>
            </section>
        </main>
    );
};


const Layout: React.FC<LayoutProps> = ({ children, requiredSubscriptions, anySubscriptions, pagePath, removePadding }) => {
    // The following negates the required and any subscription so if the user has none of the subscriptions, then the LayoutNoAccess is displayed.
    let notRequiredSubscriptions: string[] | undefined = [];
    let notAnySubscriptions: string[] | undefined = [];


    /* We add to notRequiredSubscriptions because of De Morgan's Law (A or B) = !(A and B)
     * Since requiredSubscriptions uses AND, when negating it we need to use 
     * OR which is used by anySubscriptions and vice versa.
     */
    if (requiredSubscriptions) {
        if (requiredSubscriptions[0] === "") {
            // This means that the user should have access to the main page but should be restricted from the no access page
            notRequiredSubscriptions = ["no access"];
        } else {
            if (requiredSubscriptions.length >= 2) {
                requiredSubscriptions.forEach((sub) => {
                    notAnySubscriptions?.push(`!${sub}`);
                });
            } else {
                notRequiredSubscriptions.push(`!${requiredSubscriptions[0]}`)
            }
        }
    }

    if (anySubscriptions) {
        if (anySubscriptions[0] === "") {
            notAnySubscriptions = ["no access"];
        } else {
            if (anySubscriptions.length >= 2) {
                anySubscriptions.forEach((sub) => {
                    notRequiredSubscriptions?.push(`!${sub}`);
                });
            } else {
                notAnySubscriptions.push(`!${anySubscriptions[0]}`)
            }
        }
    }

    if (notRequiredSubscriptions.length === 0) {
        notRequiredSubscriptions = undefined;
    }
    if (notAnySubscriptions.length === 0) {
        notAnySubscriptions = undefined;
    }

    return (
        <>
            {/* Check if the user does NOT have access, and display the LayoutNoAccess if true */}
            <LayoutSubscriptionWrapper requiredSubscriptions={notRequiredSubscriptions} anySubscriptions={notAnySubscriptions} pagePath={pagePath}>
                <LayoutContent removePadding={removePadding}>
                    <LayoutNoAccess />
                </LayoutContent>
            </LayoutSubscriptionWrapper>

            {/* Render the actual content if the user has the required subscriptions */}
            <LayoutSubscriptionWrapper requiredSubscriptions={requiredSubscriptions} anySubscriptions={anySubscriptions}>
                <LayoutContent removePadding={removePadding}>
                    {children}
                </LayoutContent>
            </LayoutSubscriptionWrapper>
        </>
    );
};

export default Layout;
