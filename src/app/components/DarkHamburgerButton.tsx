interface DarkHamburgerButtonProps {
	isActive: boolean;
	onClick: () => void;
}


const DarkHamburgerButton: React.FC<DarkHamburgerButtonProps> = ({ isActive, onClick }) => {

	return (
		<button className={`relative group ${isActive ? 'col-span-1' : 'col-span-12'} transition-all duration-500`} onClick={onClick}>
			<div className="relative flex overflow-hidden items-center justify-center rounded-full w-[40px] h-[40px] transform transition-all bg-slate-900 ring-0 ring-gray-600 hover:ring-4 ring-opacity-30 duration-200 shadow-md">
				<div
					className={`flex flex-col justify-between w-[15px] h-[15px] transform transition-all duration-500 origin-center overflow-hidden ${isActive ? '-rotate-180' : ''
						}`}
				>
					<div
						className={`bg-white h-[2px] w-5 transform transition-all duration-500 ${isActive ? 'rotate-45 -translate-x-[1.8px]' : ''
							}`}
					></div>
					<div
						className="bg-white h-[2px] w-5 rounded transform transition-all duration-500"
					></div>
					<div
						className={`bg-white h-[2px] w-5 transform transition-all duration-500 ${isActive ? '-rotate-45 -translate-x-[1.8px]' : ''
							}`}
					></div>
				</div>
			</div>
		</button>
	)
}

export default DarkHamburgerButton
