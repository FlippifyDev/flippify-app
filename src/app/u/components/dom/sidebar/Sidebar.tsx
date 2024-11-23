import SidebarMonitorButtons from './MonitorButtons';
import SidebarSignOutButton from './ButtonSignout';
import SidebarHomeButtons from './HomeButtons';
import SidebarToolButtons from './ToolButtons';
import SidebarButton from './Button';
import ButtonFeedback from './ButtonFeedback';
import Alert from '@/src/app/components/Alert';
import React, { useState, useEffect } from 'react';

import { BsClipboard2Fill } from 'react-icons/bs';
import "@/src/styles/hide-scrollbar.css";

import MenuButton from '@/src/app/components/MenuButton';


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
		<div className={`relative z-0 h-full bg-darkBackground transition-all duration-300 ${isSidebarOpen ? 'w-full sm:w-72 2xl:w-80' : 'hidden sm:block w-16'}`}>
			<Alert message="Membership Required." visible={alertVisible} onClose={hideAlert} />

			{/* Toggle Button */}
			<div className="p-2 border-b border-gray-500 flex justify-center items-center">
				<MenuButton isSidebarOpen={isSidebarOpen} onClick={() => setIsSidebarOpen(!isSidebarOpen)} />
			</div>

			{/* Sidebar Content */}
			<div className="p-2 h-full flex flex-col justify-between gap-4 overflow-y-auto scrollbar-hide pb-16">
				<div className="flex flex-col gap-4">
					<div>
						<h2 className={`text-white text-lg font-bold px-2 ${isSidebarOpen ? 'block' : 'hidden'}`} style={{ overflow: 'hidden' }}>
							Home
						</h2>
						<SidebarHomeButtons showAlert={showAlert} isSidebarOpen={isSidebarOpen} />
					</div>
					<div>
						<h2 className={`text-white text-lg font-bold px-2 ${isSidebarOpen ? 'block' : 'hidden'}`} style={{ overflow: 'hidden' }}>
							Monitors
						</h2>
						<SidebarMonitorButtons showAlert={showAlert} isSidebarOpen={isSidebarOpen} />
					</div>
					<div>
						<h2 className={`text-white text-lg font-bold px-2 ${isSidebarOpen ? 'block' : 'hidden'}`} style={{ overflow: 'hidden' }}>
							Tools
						</h2>
						<SidebarToolButtons showAlert={showAlert} isSidebarOpen={isSidebarOpen} />
					</div>
				</div>
				<div className="mt-5">
					<ButtonFeedback isSidebarOpen={isSidebarOpen} />
					<SidebarButton text="Legal" redirect="legal" isSidebarOpen={isSidebarOpen} symbol={<BsClipboard2Fill className="text-lg" />} />
					<SidebarSignOutButton isSidebarOpen={isSidebarOpen} />
				</div>
			</div>
		</div>
	);
};

export default Sidebar;