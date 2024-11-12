"use client";

import React from "react";

const NotificationsControls: React.FC = () => {
	return (
		<div className="w-full h-full p-4 flex items-center justify-center bg-gray-100 rounded-lg shadow-md">
			{/* Coming Soon Box */}
			<div className="bg-white font-semibold text-black py-2 px-4 rounded-lg shadow-xl">
				Coming Soon
			</div>
		</div>
	);
};

export default NotificationsControls;
