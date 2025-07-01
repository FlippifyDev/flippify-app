"use client";

// Local Imports
import ImageModal from '@/app/components/ImageModal';
import ImageUpload from '../../dom/ui/ImageUpload';
import ProfileSupportButton from "./ProfileSupportButton";
import ProfileBillingPortalButton from "./ProfileBillingPortalButton";

// External Imports
import { useSession } from "next-auth/react";
import { FaCamera } from "react-icons/fa";
import { useState } from "react";
import { updateUser } from '@/services/firebase/update';
import { userProfileImages } from '@/utils/constants';
import ProfileLetters from '../../dom/ui/ProfileLetters';
import { formatUsername } from '@/utils/format';


const ProfileOverview = () => {
    const { data: session, update: setSession } = useSession();
    const [fileName, setFileName] = useState("Upload Image");
    const [url, setUrl] = useState("");

    // Default avatar
    let avatar: string | null = "https://i.imgur.com/uOCy7MN.jpeg";
    let username = "User";
    let email = "N/A";

    if (session) {
        if (session.user?.metaData?.image) {
            avatar = session.user.metaData.image;
            if (userProfileImages.includes(avatar)) {
                avatar = null;
            }
        }
        if (session.user?.username) {
            username = session.user.username;
        }
        if (session.user?.email) {
            email = session.user.email;
        }
    }

    // Modal state to show/hide the modal for uploading the image
    const [isModalOpen, setIsModalOpen] = useState(false);


    const handleCameraClick = () => {
        setIsModalOpen(true);
    };


    const handleUpload = async (imageUrl?: string | null) => {
        if (!session?.user?.id) {
            return;
        }
        // Use the imageUrl passed in, or fall back to the state value
        const finalUrl = imageUrl || url;

        if (finalUrl) {
            await updateUser({ uid: session.user.id, data: { metaData: { image: finalUrl } } });
            setSession({
                ...session,
                user: {
                    ...session.user,
                    metaData: { ...session.user.metaData, image: finalUrl }
                }
            });
        }

        setIsModalOpen(false);
        setFileName("Upload Image");
        setUrl("");
    };


    return (
        <div className="w-full bg-white rounded-xl shadow p-4 md:p-6 justify-start items-start">
            <div className="w-full flex flex-row items-center gap-2 sm:gap-4">
                <div className='w-28 h-full relative'>
                    {avatar && (
                        <ImageModal src={avatar} alt={"Avatar"} width={80} height={80} className="rounded-full" />
                    )}
                    {!avatar && (
                        <ProfileLetters text={formatUsername(session?.user.username ?? "N/A")} containerClassName='w-[110px] h-[110px] border' className='text-3xl'/>
                    )}
                    <div
                        className='absolute bottom-1 right-1 h-7 w-7 rounded-full bg-gray-500 bg-opacity-50 flex items-center justify-center cursor-pointer z-10'
                        onClick={handleCameraClick} // Open the modal when clicked
                    >
                        <FaCamera className="text-white" />
                    </div>
                </div>
                <div className="h-full">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                        {username}
                    </h2>
                    <p className="text-sm sm:text-lg text-gray-500">
                        {email}
                    </p>
                    <div>
                        <ProfileBillingPortalButton />
                        <ProfileSupportButton />
                    </div>
                </div>
            </div>

            {/* Modal for uploading the image */}
            {isModalOpen && (
                <ImageUpload
                    title="Upload Profile Picture"
                    fileName={fileName}
                    url={url}
                    setIsModalOpen={setIsModalOpen}
                    setFileName={setFileName}
                    setUrl={setUrl}
                    handleUpload={handleUpload}
                />
            )}
        </div>
    );
};

export default ProfileOverview;
