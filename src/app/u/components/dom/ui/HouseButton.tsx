import { useState } from "react";


interface HouseButtonProps {
    text: string;
    icon?: any;
    onClick?: () => void;
}


const HouseButton: React.FC<HouseButtonProps> = ({ text, icon, onClick }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async () => {
        if (isLoading) return; // Prevent multiple clicks
        setIsLoading(true);

        try {
            await onClick?.(); // Handle async functions if provided
        } catch (error) {
            console.error("Error in HouseButton onClick:", error);
        }

        setIsLoading(false);
    };

    return (
        <button
            onClick={handleClick}
            disabled={isLoading}
            className="w-full p-3 bg-houseBlue rounded text-white hover:bg-blue-600 transition duration-200"
        >
            <span className="inline-flex items-center gap-2">
                {isLoading ? (
                    "Processing..."
                ) : (
                    <>
                        {icon && <span>{icon}</span>}
                        {text}
                    </>
                )}
            </span>
        </button>
    );
};

export default HouseButton;