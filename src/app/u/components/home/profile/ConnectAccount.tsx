import React from 'react';
import Image from 'next/image';

// Connection buttons
import AmazonConnectButton from "./AmazonConnectButton";
import EbayConnectButton from "./EbayConnectButton";


interface ConnectAccountProps {
  name: string;
  image: string;
}

const ConnectAccount: React.FC<ConnectAccountProps> = ({ name, image }) => {
	return (
	  <div className="col-span-1 flex flex-row items-center p-4 gap-4">
		{/* Account logo */}
		<div className="border-[3px] rounded-full p-2">
		  <Image alt={`${name} logo`} src={image} width={30} height={30} loading="lazy" />
		</div>
  
		{/* Account name */}
		<div className="text-md font-semibold text-gray-800">{name}</div>

		<div className='w-full flex justify-end'>
			{/* Connect/Disconnect Button */}
			{name === "eBay" && <EbayConnectButton />}
			{name === "Amazon" && <AmazonConnectButton />}
		</div>
	  </div>
	);
  };
  
  export default ConnectAccount;
