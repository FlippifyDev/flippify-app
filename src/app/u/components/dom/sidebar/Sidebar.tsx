import SidebarSignOutButton from './ButtonSignout';
import SidebarHomeButtons from './HomeButtons';
import SidebarToolButtons from './ToolButtons';
import ButtonFeedback from './ButtonFeedback';
import Alert from '@/app/components/Alert';
import React, { useState, useEffect } from 'react';

import MenuButton from '@/app/components/MenuButton';


interface SidebarProps {
	isSidebarOpen: boolean;
	setIsSidebarOpen: (value: boolean) => void;
}


const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, setIsSidebarOpen }) => {
	const [alertVisible, setAlertVisible] = useState(false);

	const showAlert = () => {
		setAlertVisible(true);
	};

	const hideAlert = () => {
		setAlertVisible(false);
	};

	// Disable background scrolling when sidebar is open
	useEffect(() => {
		document.body.classList.add('overflow-hidden'); 
		return () => {
			document.body.classList.remove('overflow-hidden');
		};
	}, []);

	return (
        <div className={`relative z-0 h-full bg-black border-r border-uiBorder transition-all duration-300 ${isSidebarOpen ? 'w-full sm:w-72 2xl:w-80' : 'hidden sm:block w-16'}`}>
			<Alert message="Membership Required." visible={alertVisible} onClose={hideAlert} />

			{/* Toggle Button */}
            <div className="p-2 h-14 border-b border-uiBorder flex justify-center items-center">
				<MenuButton isSidebarOpen={isSidebarOpen} onClick={() => setIsSidebarOpen(!isSidebarOpen)} />
			</div>

			{/* Sidebar Content */}
			<div className="p-2 h-full flex flex-col justify-between gap-4 overflow-y-auto scrollbar-hide pb-16">
				<div className="flex flex-col">
                    <div className='pb-4'>
                        <h2 className={`text-white text-base font-bold px-2 mb-1 transition-all duration-150 ${isSidebarOpen ? 'opacity-100 delay-100' : 'opacity-0'}`} style={{ overflow: 'hidden' }}>
							Home
						</h2>
						<SidebarHomeButtons showAlert={showAlert} isSidebarOpen={isSidebarOpen} />
					</div>
                    <div className={`w-full ${isSidebarOpen ? '' : 'border-b border-uiBorder'}`}></div>
                    <div className='pb-4'>
                        <h2 className={`text-white text-base font-bold px-2 mb-1 transition-all duration-150 ${isSidebarOpen ? 'opacity-100 delay-100' : 'opacity-0'}`} style={{ overflow: 'hidden' }}>
							Tools
						</h2>
						<SidebarToolButtons showAlert={showAlert} isSidebarOpen={isSidebarOpen} />
					</div>
				</div>

				<div className="mt-5">
                    <div className={`w-full ${isSidebarOpen ? 'border-b border-uiBorder mb-4' : 'border-b border-uiBorder mb-4'}`}></div>
					<ButtonFeedback isSidebarOpen={isSidebarOpen} />
					<SidebarSignOutButton isSidebarOpen={isSidebarOpen} />
				</div>
			</div>
		</div>
	);
};

export default Sidebar;