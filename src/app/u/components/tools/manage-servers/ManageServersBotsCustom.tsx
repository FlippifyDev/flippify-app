import React from 'react';
import ManagerServersSelectionList from "./ManageServersSelectionList";
import Frequency from "./ManageServersFreq";

const ManageServersBotsCustom: React.FC = () => {
	return (
		<div className='flex flex-col items-center py-4'>
			<ManagerServersSelectionList className="w-[32%] p-2" />
		</div>
	);
};

export default ManageServersBotsCustom;
