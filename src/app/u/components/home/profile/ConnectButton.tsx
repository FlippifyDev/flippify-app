import React from "react";

interface SubConnectButtonProps {
	text: string;
	custom_class: string;
	onClick?: () => void;
}


const SubConnectButton: React.FC<SubConnectButtonProps> = ({ text, custom_class, onClick }) => {
	return (
		<button
			onClick={onClick}
			type="button"
			className={`btn rounded-full text-white w-24 text-center border-0 transition duration-300 ${custom_class}`}
		>
			{text}
		</button>
	)
}


interface ConnectButtonProps {
	connected?: boolean;
	loading?: boolean;
	unavailable?: boolean;
	handleConnect?: () => void;
	handleDisconnect?: () => void;
}

const ConnectButton: React.FC<ConnectButtonProps> = ({
	connected,
	loading,
	unavailable,
	handleConnect,
	handleDisconnect,
}) => {
	const disconnectButtonClass = "bg-red-600 hover:bg-red-500";
	const connectButtonClass = "bg-green-500 hover:bg-green-400";
	const unavailableClass = "btn-disabled";
	const loadingClass = "bg-gray-500 hover:bg-gray-400";

	return (
		<div className="flex flex-col gap-4">
			<div className="relative group w-full">
				{loading ? (
					<SubConnectButton text="Loading..." custom_class={loadingClass}/>
				) : unavailable ? (
					<div className="relative group">
						<SubConnectButton text="Connect" custom_class={unavailableClass} />
						<div className="w-28 absolute pointer-events-none bottom-full mb-1 left-1/2 transform duration-500 -translate-x-1/2 p-2 bg-gray-800 text-white text-center text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
							Coming Soon
						</div>
					</div>
				) : connected ? (
					<SubConnectButton text="Disconnect" custom_class={disconnectButtonClass} onClick={handleDisconnect}/>
				) : (
					<SubConnectButton text="Connect" custom_class={connectButtonClass} onClick={handleConnect}/>
				)}
			</div>
		</div>
	);
};

export default ConnectButton;



