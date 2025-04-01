import { uploadImage } from '@/services/imgur/upload';
import { validateUrlInput } from '@/utils/input-validation';
import React, { useState } from 'react'
import { IoClose } from 'react-icons/io5';
import { MdInsertPhoto } from 'react-icons/md'

interface ImageUploadProps {
    title: string;
    fileName: string;
    url: string;
    setFileName: (fileName: string) => void;
    setIsModalOpen: (isOpen: boolean) => void;
    setUrl: (value: string) => void;
    handleUpload?: (imageUrl?: string | null) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
    title,  
    fileName,
    url,
    setFileName,
    setIsModalOpen,
    setUrl,
    handleUpload
}) => {
    const [error, setError] = useState("");
    const [validImage, setValidImage] = useState(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [validUrl, setValidUrl] = useState(false);
    const [localUrl, setLocalUrl] = useState<string>("");

    function shortenFileName(fileName: string) {
        if (fileName.length <= 14) return fileName;
        const firstThree = fileName.substring(0, 7);
        const lastThree = fileName.substring(fileName.length - 7);
        return `${firstThree}...${lastThree}`;
    }

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFileName(event.target.files[0].name);
            setSelectedImage(event.target.files[0]);
            setValidImage(true);
        }
    };

    function handleUrlInput(value: string) {
        validateUrlInput(value, setLocalUrl, setValidUrl);
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedImage(null);
        setFileName("Upload Image");
        setValidUrl(false);
        setValidImage(false);
    };

    const handleLocalUpload = async () => {
        let imageUrl = localUrl as string | null;
        if (selectedImage) {
            try {
                const imageBuffer = await selectedImage.arrayBuffer();
                imageUrl = await uploadImage(Buffer.from(imageBuffer).toString("base64"));
                if (!imageUrl) {
                    setError("Image failed to upload. Please try again.");
                    return;
                }
                console.log("imgur url", imageUrl)
                setUrl(imageUrl);
            } catch (error) {
                console.error("Image upload failed:", error);
                setError("Image failed to upload. Please try again.");
                return;
            }
        }
        // Pass the imageUrl directly
        handleUpload?.(imageUrl);

        setIsModalOpen(false);
        setSelectedImage(null);
        setFileName("Upload Image");
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-40">
            <div className="relative bg-white p-6 rounded-lg shadow-lg w-80 sm:w-96">
                {/* Close Button (Cross Icon) */}
                <button
                    className="absolute -top-5 -right-5 text-white rounded-full bg-[#3c424b] p-2 shadow-gray-700 shadow-[rgba(0,0,0,0.2)_-2px_2px_8px] z-50"
                    onClick={handleCloseModal}
                >
                    <IoClose size={24} />
                </button>

                <h3 className="text-xl font-semibold mb-4 text-center">{title}</h3>
                {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
                <div className='w-full flex items-center justify-center mb-3'>
                    <label className="block w-1/2 bg-gray-800 p-2 rounded text-white text-center text-sm hover:cursor-pointer">
                        {fileName === "Upload Image" ? fileName : shortenFileName(fileName)}
                        <input
                            type="file"
                            onChange={handleImageUpload}
                            accept="image/*"
                            className="hidden"
                            disabled={validUrl}
                        />
                    </label>
                </div>
                <div className='flex flex-col items-center justify-center gap-2'>
                    <div className="flex justify-center">
                        <button
                            onClick={handleLocalUpload}
                            disabled={!validImage && !validUrl}
                            className='hover:text-gray-700 disabled:cursor-not-allowed transition duration-200 flex flex-row gap-2 items-center justify-center'
                        >
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
                        <input
                            type="text"
                            onChange={(e) => handleUrlInput(e.target.value)}
                            placeholder='Paste URL'
                            disabled={validImage}
                            className='text-sm font-bold border-0 ring-0 focus:ring-[1px] transition duration-200 hover:ring-[1px] bg-gray-800 text-white text-center placeholder-white focus:placeholder-opacity-0 rounded'
                        />
                    </div>
                </div>

            </div>
        </div>
    )
}

export default ImageUpload
