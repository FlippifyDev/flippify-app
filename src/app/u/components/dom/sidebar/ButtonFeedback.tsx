import React from 'react'
import { MdFeedback } from "react-icons/md";

import SidebarButton from './Button'


interface ButtonFeedbackProps {
	isSidebarOpen: boolean;
}


const ButtonFeedback:React.FC<ButtonFeedbackProps> = ({ isSidebarOpen }) => {
	const feedback_url = "https://discord.com/channels/1236428617962229830/1236439119123447892"

	const handleClick = () => {
		// Open the Discord link in a new tab
		window.open(feedback_url, "_blank");
	  };

	return (
		<SidebarButton text="Feedback" isSidebarOpen={isSidebarOpen} symbol={<MdFeedback className='text-lg'/>} onClick={handleClick}/>
	)
}

export default ButtonFeedback
