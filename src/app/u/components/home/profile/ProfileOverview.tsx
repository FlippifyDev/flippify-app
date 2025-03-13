"use client";

// Local Imports
import ImageModal from '@/app/components/ImageModal';
import { updateUser } from '@/services/firebase/update';
import { uploadImage } from '@/services/imgur/upload';
import ProfileSupportButton from "./ProfileSupportButton";
import ProfileBillingPortalButton from "./ProfileBillingPortalButton";

// External Imports
import { MdInsertPhoto } from "react-icons/md";
import { useSession } from "next-auth/react";
import { FaCamera } from "react-icons/fa";
import { useState } from "react";
import { IoClose } from "react-icons/io5";

const ProfileOverview = () => {
    const { data: session, update: setSession } = useSession();
    const [fileName, setFileName] = useState("Upload File");
    const [url, setUrl] = useState("");
    const [error, setError] = useState("");

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

    // Modal state to show/hide the modal for uploading the image
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFileName(event.target.files[0].name);
            setSelectedImage(event.target.files[0]);
        }
    };

    const handleCameraClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleUpload = async () => {
        if (!session?.user?.id) {
            setError("You must be logged in to update your profile picture.");
            return;
        }

        let imageUrl = url as string | null;
        if (selectedImage) {
            try {
                const imageBuffer = await selectedImage.arrayBuffer();
                imageUrl = await uploadImage(Buffer.from(imageBuffer).toString("base64"));
            } catch (error) {
                console.error("Image upload failed:", error);
                setError("Image failed to upload. Please try again.");
                return;
            }
        }

        if (imageUrl) {
            await updateUser(session.user.id, { metaData: { image: imageUrl } });
            setSession({ ...session, user: { ...session.user, metaData: { ...session.user.metaData, image: imageUrl } } });
        }

        setIsModalOpen(false);
    };

    // Return first 3 letters ... last 3 letters and the extension of the file
    function shortenFileName(fileName: string) {
        if (fileName.length <= 14) return fileName;
        const firstThree = fileName.substring(0, 7);
        const lastThree = fileName.substring(fileName.length - 7);
        return `${firstThree}...${lastThree}`;
    }

    return (
        <div className="w-full bg-white rounded-xl dark:bg-gray-800 p-4 md:p-6 flex flex-col md:flex-row justify-start items-start">
            <div className="flex items-center">
                <div className='relative'>
                    <ImageModal src={avatar} alt={"Avatar"} width={80} height={80} className="rounded-full hidden sm:block" />
                    <div
                        className='absolute bottom-1 right-1 h-7 w-7 rounded-full bg-gray-500 bg-opacity-50 flex items-center justify-center cursor-pointer z-10'
                        onClick={handleCameraClick} // Open the modal when clicked
                    >
                        <FaCamera className="text-white" />
                    </div>
                </div>
                <div className="ml-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {username}
                    </h2>
                    <p className="text-gray-500">
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
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-40">
                    <div className="relative bg-white p-6 rounded-lg shadow-lg w-96">
                        {/* Close Button (Cross Icon) */}
                        <button
                            className="absolute -top-5 -right-5 text-white rounded-full bg-[#3c424b] p-2 shadow-gray-700 shadow-[rgba(0,0,0,0.2)_-2px_2px_8px] z-50"
                            onClick={handleCloseModal}
                        >
                            <IoClose size={24} />
                        </button>


                        <h3 className="text-xl font-semibold mb-4 text-center">Upload Profile Picture</h3>
                        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
                        <div className='w-full flex items-center justify-center mb-3'>
                            <label className="block w-1/2 bg-gray-800 p-2 rounded text-white text-center text-sm">
                                {fileName === "Upload File" ? fileName : shortenFileName(fileName)}
                                <input
                                    type="file"
                                    onChange={handleImageUpload}
                                    accept="image/*"
                                    className="hidden"
                                />
                            </label>
                        </div>
                        <div className='flex flex-col items-center justify-center gap-2'>
                            <div className="flex justify-center">
                                <button onClick={handleUpload} className='hover:text-gray-700 transition duration-200 flex flex-row gap-2 items-center justify-center'>
                                    <span><MdInsertPhoto /></span>
                                    <span className='text-sm'>Upload Photo</span>
                                </button>
                            </div>

                            <div className="flex items-center justify-center gap-2 w-1/2">
                                <hr className="flex-grow border-gray-500" />
                                <span className="text-gray-800 font-bold">or</span>
                                <hr className="flex-grow border-gray-500" />
                            </div>

                            <div className='text-center'>
                                <input type="text" onChange={(e) => setUrl(e.target.value)} placeholder='Paste URL' className='text-sm font-bold border-0 ring-0 focus:ring-[1px] transition duration-200 hover:ring-[1px] bg-gray-800 text-white text-center placeholder-white focus:placeholder-opacity-0 rounded' />
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileOverview;
