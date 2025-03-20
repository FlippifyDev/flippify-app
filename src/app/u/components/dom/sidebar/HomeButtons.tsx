"use client";

import DisabledSideBarButton from "./ButtonDisabled";
import LayoutSubscriptionWrapper from "../../layout/LayoutSubscriptionWrapper";
import SidebarButton from "./Button";
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { FaSearch, FaBook } from "react-icons/fa";
import { FaHouse } from "react-icons/fa6";
import { MdStickyNote2 } from "react-icons/md";
import { GrHelpBook } from "react-icons/gr";
import { HiDocumentReport } from "react-icons/hi";

interface SidebarHomeButtonsProps {
  isSidebarOpen: boolean;
  showAlert: () => void;
}

const SidebarHomeButtons: React.FC<SidebarHomeButtonsProps> = ({ isSidebarOpen, showAlert }) => {
	const { data: session } = useSession();
	const [unreadCount, setUnreadCount] = useState(0);
	
	return (
		<div className="w-full flex flex-col">
			{/* Dashboard Button - Public*/}
			<SidebarButton
				text="Dashboard"
				redirect="dashboard"
				isSidebarOpen={isSidebarOpen}
				symbol={<FaHouse className="text-lg" />}
			/>

			{/* Plans Button - Public*/}
			<SidebarButton
				text="Plans"
				redirect="plans"
				isSidebarOpen={isSidebarOpen}
				symbol={<FaSearch className="text-lg" />}
			/>

			{/* Activity Log Button - Public*/}
			<LayoutSubscriptionWrapper requiredSubscriptions={["!admin"]}>
				<DisabledSideBarButton
					text="Activity Log"
					redirect="activity-log"
					isSidebarOpen={isSidebarOpen}
					symbol={<MdStickyNote2 className="text-lg" />}
					tooltip="Coming Soon"
				/>
			</LayoutSubscriptionWrapper>

			{/* Activity Log Button - Admin*/}
			<LayoutSubscriptionWrapper requiredSubscriptions={["admin"]}>
				<SidebarButton
					text="Activity Log"
					redirect="activity-log"
					isSidebarOpen={isSidebarOpen}
					symbol={<MdStickyNote2 className="text-xl" />}
				/>
			</LayoutSubscriptionWrapper>

			{/* Reports & Insights Button - Public*/}
			<LayoutSubscriptionWrapper requiredSubscriptions={["!admin"]}>
				<DisabledSideBarButton
					text="Reports & Insights"
					redirect="reports-insights"
					isSidebarOpen={isSidebarOpen}
					symbol={<HiDocumentReport className="text-2xl" />}
					tooltip="Coming Soon"

				/>
			</LayoutSubscriptionWrapper>

			{/* Reports & Insights Button - Admin*/}
			<LayoutSubscriptionWrapper requiredSubscriptions={["admin"]}>
				<SidebarButton
					text="Reports & Insights"
					redirect="reports-insights"
					isSidebarOpen={isSidebarOpen}
					symbol={<HiDocumentReport className="text-2xl" />}
				/>
			</LayoutSubscriptionWrapper>

			{/* Help & Resources Button - Public*/}
			<LayoutSubscriptionWrapper requiredSubscriptions={["!admin"]}>
				<DisabledSideBarButton
					text="Help & Resources"
					redirect="help-resources"
					isSidebarOpen={isSidebarOpen}
					symbol={<FaBook className="text-lg" />}
					tooltip="Coming Soon"
				/>
			</LayoutSubscriptionWrapper>

			{/* Help & Resources Button - Admin*/}
			<LayoutSubscriptionWrapper requiredSubscriptions={["admin"]}>
				<SidebarButton
					text="Help & Resources"
					redirect="help-resources"
					isSidebarOpen={isSidebarOpen}
					symbol={<FaBook className="text-lg" />}
				/>
			</LayoutSubscriptionWrapper>
    	</div>
  );
};

export default SidebarHomeButtons;
