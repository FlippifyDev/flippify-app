import { BiBookAdd } from "react-icons/bi";


interface NavbarAddListingProps {
    isConnected: boolean;
    handleDisplayModal: (display: boolean, type: string) => void;
}

const NavbarAddOrder: React.FC<NavbarAddListingProps> = ({ isConnected, handleDisplayModal }) => {
    function handleOnClick() {
        if (!isConnected) return;
        handleDisplayModal(true, "add-order");
    }
    return (
        <div className="relative inline-block group">
            <BiBookAdd className="text-xl hover:text-gray-800 text-black" onClick={handleOnClick} />
            {/* Tooltip */}
            <div className="absolute left-1/4 transform -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="bg-gray-800 text-white text-xs rounded py-1 px-2 w-[114px]">
                    {isConnected ? "Add To Orders" : "No connected account"}
                </div>
            </div>
        </div>
    );
}

export default NavbarAddOrder
