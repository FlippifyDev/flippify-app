import React from 'react';
import ManagerServersSelectionList from "./ManageServersSelectionList";
import Frequency from "./ManageServersFreq";

const Cust: React.FC = () => {
  return (
        <div className='flex flex-col items-center py-4'>
        <h1>Customisation page for the bots that the server owner has </h1>
        <div className='flex flex-wrap justify-between'>
        <ManagerServersSelectionList className="w-[32%] p-2"/>
        <Frequency className="w-[32%] p-2"/>
        </div>
        </div>
  );
};

export default Cust;
