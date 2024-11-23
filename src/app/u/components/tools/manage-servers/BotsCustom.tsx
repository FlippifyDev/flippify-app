import React from 'react';
import ManagerServersSelectionList from "./SelectionList";
import Frequency from "./Freq";

const ManageServersBotsCustom: React.FC = () => {
	return (
		<div className='flex flex-col items-center py-4'>
			<ManagerServersSelectionList className="w-[32%] p-2" />
		</div>
	);
};

export default ManageServersBotsCustom;
