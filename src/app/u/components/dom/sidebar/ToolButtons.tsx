"use client";

import DisabledSideBarButton from "./ButtonDisabled";
import LayoutSubscriptionWrapper from "../../layout/LayoutSubscriptionWrapper";
import SidebarButton from "./Button";

import React from "react";
import { AiOutlineStock } from "react-icons/ai";
import { FaServer, FaBoxOpen } from "react-icons/fa6";

interface SidebarToolButtonsProps {
	isSidebarOpen: boolean;
	showAlert: () => void;
}

const SidebarToolButtons: React.FC<SidebarToolButtonsProps> = ({
	isSidebarOpen,
	showAlert,
}) => {
	return (
		<div className='w-full flex flex-col gap-1'>
			{/* Disabled Financial Hub */}
			<LayoutSubscriptionWrapper requiredSubscriptions={["!admin"]}>
				<DisabledSideBarButton
					text="Financial Hub"
					redirect="sales-tracker"
					isSidebarOpen={isSidebarOpen}
					symbol={<AiOutlineStock className="text-lg" />}
					tooltip="Coming Soon"
				/>
			</LayoutSubscriptionWrapper>

			{/* Admin Access Financial Hub */}
			<LayoutSubscriptionWrapper requiredSubscriptions={["admin"]}>
				<SidebarButton
					text="Financial Hub"
					redirect="financial-hub"
					isSidebarOpen={isSidebarOpen}
					symbol={<AiOutlineStock className="text-lg" />}
				/>
			</LayoutSubscriptionWrapper>



			{/* Disabled Inventory & Orders */}
			<LayoutSubscriptionWrapper requiredSubscriptions={["!admin"]}>
				<DisabledSideBarButton
					text="Inventory & Orders"
					redirect="inventory-orders"
					isSidebarOpen={isSidebarOpen}
					symbol={<FaBoxOpen className="text-lg" />}
					tooltip="Coming Soon"
				/>
			</LayoutSubscriptionWrapper>

			{/* Admin Access Inventory & Orders */}
			<LayoutSubscriptionWrapper requiredSubscriptions={["admin"]}>
				<SidebarButton
					text="Inventory & Orders"
					redirect="inventory-orders"
					isSidebarOpen={isSidebarOpen}
					symbol={<FaBoxOpen className="text-lg" />}
				/>
			</LayoutSubscriptionWrapper>
		</div>
	);
};

export default SidebarToolButtons;
