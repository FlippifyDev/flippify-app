'use client';

// Local Imports
import ImageModal from '@/app/components/ImageModal';
import { currencySymbols } from "@/config/currency-config";
import ProfileSupportButton from "./ProfileSupportButton";
import ProfileBillingPortalButton from "./ProfileBillingPortalButton";

// External Imports
import { useSession } from "next-auth/react";


const ProfileOverview = () => {
    const { data: session } = useSession();
    const currency = session?.user.preferences.locale as string;
    const currencySymbol = currencySymbols[currency];

    // Default avatar
    let avatar = "https://i.imgur.com/pXG2DV3.jpeg";
    let username = "User";
    let email = "N/A";

    if (session) {
        if (session.user?.metaData.image) {
            avatar = session.user.metaData.image;
        }
        if (session.user?.username) {
            username = session.user.username;
        }
        if (session.user?.email) {
            email = session.user.email;
        }
    }

    return (
        <div className="w-full bg-white rounded-xl dark:bg-gray-800 p-4 md:p-6 flex flex-col md:flex-row justify-start items-start">
            <div className="flex items-center">
                <ImageModal src={avatar} alt={"Avatar"} width={80} height={80} className="rounded-full hidden sm:block" />
                <div className="ml-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {username}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">
                        {email}
                    </p>
                    <div>
                        <ProfileBillingPortalButton />
                        <ProfileSupportButton />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileOverview;
