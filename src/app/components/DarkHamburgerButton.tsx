import { RxHamburgerMenu } from "react-icons/rx";

interface DarkHamburgerButtonProps {
	isActive: boolean;
	onClick: () => void;
}


const DarkHamburgerButton: React.FC<DarkHamburgerButtonProps> = ({ isActive, onClick }) => {
	return (
        <button className={`w-full transition-all duration-500 flex items-center justify-end relative group ${isActive ? '' : 'mr-1'}`} onClick={onClick}>
            <div className={`flex ${isActive ? '' : 'w-full'} overflow-hidden items-center justify-center`}>
                <span className="p-2 hover:bg-muted/10 rounded text-white"><RxHamburgerMenu /></span>
			</div>
		</button>
	)
}

export default DarkHamburgerButton
