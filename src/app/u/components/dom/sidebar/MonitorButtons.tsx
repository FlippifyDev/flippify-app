import DisabledSideBarButton from "./ButtonDisabled";
import LayoutSubscriptionWrapper from "../../layout/LayoutSubscriptionWrapper";
import SidebarButton from "./Button";

import React from "react";
import { PiLegoFill } from "react-icons/pi";
import { FaLaptop } from "react-icons/fa";
import { FaParachuteBox } from "react-icons/fa6";
import { BiSolidBinoculars } from "react-icons/bi";
import { PiSneakerMoveFill } from "react-icons/pi";

interface SidebaMonitorButtonsProps {
	isSidebarOpen: boolean;
	showAlert: () => void;
}

const SidebarMonitorButtons: React.FC<SidebaMonitorButtonsProps> = ({
	isSidebarOpen,
	showAlert,
}) => {
	return (
		<div className='w-full flex flex-col gap-1'>
			{/* Deal Watch */}
			<LayoutSubscriptionWrapper anySubscriptions={["member", "deal watch"]}>
				<SidebarButton
					text="Deal Watch"
					redirect="monitors/deal-watch"
					isSidebarOpen={isSidebarOpen}
					symbol={<BiSolidBinoculars className="text-lg" />}
				/>
			</LayoutSubscriptionWrapper>

			{/* Deal Watch Disabled */}
			<LayoutSubscriptionWrapper
				requiredSubscriptions={["!deal watch", "!member"]}
			>
				<DisabledSideBarButton
					text="Deal Watch"
					redirect="monitors/deal-watch"
					isSidebarOpen={isSidebarOpen}
					symbol={<BiSolidBinoculars className="text-lg" />}
					showAlert={showAlert}
				/>
			</LayoutSubscriptionWrapper>

			{/* Electronics */}
			<LayoutSubscriptionWrapper anySubscriptions={["member", "electronics"]}>
				<SidebarButton
					text="Electronics"
					redirect="monitors/electronics"
					isSidebarOpen={isSidebarOpen}
					symbol={<FaLaptop className="text-lg" />}
				/>
			</LayoutSubscriptionWrapper>

			{/* Electronics Disabled */}
			<LayoutSubscriptionWrapper
				requiredSubscriptions={["!electronics", "!member"]}
			>
				<DisabledSideBarButton
					text="Electronics"
					redirect="monitors/electronics"
					isSidebarOpen={isSidebarOpen}
					symbol={<FaLaptop className="text-lg" />}
					showAlert={showAlert}
				/>
			</LayoutSubscriptionWrapper>

			{/* Restock Info */}
			<LayoutSubscriptionWrapper anySubscriptions={["member", "electronics"]}>
				<SidebarButton
					text="Restock Info"
					redirect="monitors/restock-info"
					isSidebarOpen={isSidebarOpen}
					symbol={<FaParachuteBox className="text-lg" />}
				/>
			</LayoutSubscriptionWrapper>

			{/* Restock Info Disabled */}
			<LayoutSubscriptionWrapper requiredSubscriptions={["!member"]}>
				<DisabledSideBarButton
					text="Restock Info"
					redirect="monitors/restock-info"
					isSidebarOpen={isSidebarOpen}
					symbol={<FaParachuteBox className="text-lg" />}
					showAlert={showAlert}
				/>
			</LayoutSubscriptionWrapper>

			{/* Retiring Sets */}
			<LayoutSubscriptionWrapper anySubscriptions={["member", "retiring sets"]}>
				<SidebarButton
					text="Retiring Sets"
					redirect="monitors/retiring-sets"
					isSidebarOpen={isSidebarOpen}
					symbol={<PiLegoFill className="text-lg" />}
				/>
			</LayoutSubscriptionWrapper>

			{/* Retiring Sets Disabled */}
			<LayoutSubscriptionWrapper
				requiredSubscriptions={["!retiring sets", "!member"]}
			>
				<DisabledSideBarButton
					text="Retiring Sets"
					redirect="monitors/retiring-sets"
					isSidebarOpen={isSidebarOpen}
					symbol={<PiLegoFill className="text-lg" />}
					showAlert={showAlert}
				/>
			</LayoutSubscriptionWrapper>

			{/* Sneaker Release Info */}
			<LayoutSubscriptionWrapper anySubscriptions={["member"]}>
				<SidebarButton
					text="Sneaker Releases"
					redirect="monitors/sneaker-release-info"
					isSidebarOpen={isSidebarOpen}
					symbol={<PiSneakerMoveFill className="text-lg" />}
				/>
			</LayoutSubscriptionWrapper>

			{/* Sneaker Release Info */}
			<LayoutSubscriptionWrapper anySubscriptions={["!member"]}>
				<DisabledSideBarButton
					text="Sneaker Releases"
					redirect="monitors/sneaker-release-info"
					isSidebarOpen={isSidebarOpen}
					symbol={<PiSneakerMoveFill className="text-lg" />}
					showAlert={showAlert}
				/>
			</LayoutSubscriptionWrapper>

		</div>
	);
};

export default SidebarMonitorButtons;
