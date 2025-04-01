import PlusIcon from "@/app/components/PlusIcon";

interface NavbarAddListingProps {
    handleDisplayModal: (display: boolean, type: string) => void;
}

const NavbarAddListing: React.FC<NavbarAddListingProps> = ({ handleDisplayModal }) => {
    function handleOnClick() {
        handleDisplayModal(true, "add-listing");
    }
    return (
        <div className="relative inline-block group">
            <PlusIcon title="Add New Listing" onClick={handleOnClick} />
            {/* Tooltip */}
            <div className="absolute left-1/4 transform -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="bg-gray-800 text-white text-xs rounded py-1 px-2 w-20">
                    Add Listing
                </div>
            </div>
        </div>
    );
}

export default NavbarAddListing;
