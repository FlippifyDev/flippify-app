import DisabledSideBarButton from "./ButtonDisabled";
import LayoutSubscriptionWrapper from "../../layout/LayoutSubscriptionWrapper";
import SidebarButton from "./Button";
import { FaBook, FaSearch } from "react-icons/fa";
import { MdStickyNote2 } from "react-icons/md";
import { HiDocumentReport } from "react-icons/hi";
import { FaGlobe } from "react-icons/fa";

interface SidebarHomeButtonsProps {
  isSidebarOpen: boolean;
  showAlert: () => void;
}

const SidebarHomeButtons: React.FC<SidebarHomeButtonsProps> = ({ isSidebarOpen, showAlert }) => {	
	return (
		<div className="w-full flex flex-col">
			{/* Dashboard Button - Public*/}
			<SidebarButton
				text="Dashboard"
				redirect="dashboard"
				isSidebarOpen={isSidebarOpen}
                symbol={<FaGlobe className="text-base" />}
			/>

            {/* Plans - Public*/}
            <LayoutSubscriptionWrapper requiredSubscriptions={["!member"]}>
                <SidebarButton
                    text="Plans"
                    redirect="plans"
                    isSidebarOpen={isSidebarOpen}
                    symbol={<FaSearch className="text-base" />}
                />
            </LayoutSubscriptionWrapper>

			{/* Activity Log Button - Public*/}
			<LayoutSubscriptionWrapper requiredSubscriptions={["!admin"]}>
				<DisabledSideBarButton
					text="Activity Log"
					redirect="activity-log"
					isSidebarOpen={isSidebarOpen}
                    symbol={<MdStickyNote2 className="text-base" />}
					tooltip="Coming Soon"
				/>
			</LayoutSubscriptionWrapper>

			{/* Activity Log Button - Admin*/}
			<LayoutSubscriptionWrapper requiredSubscriptions={["admin"]}>
				<SidebarButton
					text="Activity Log"
					redirect="activity-log"
					isSidebarOpen={isSidebarOpen}
					symbol={<MdStickyNote2 className="text-lg" />}
				/>
			</LayoutSubscriptionWrapper>

			{/* Reports & Insights Button - Public*/}
            <LayoutSubscriptionWrapper requiredSubscriptions={["!standard", "!pro", "!admin"]}>
				<DisabledSideBarButton
					text="Reports & Insights"
					redirect="reports-and-insights"
					isSidebarOpen={isSidebarOpen}
					symbol={<HiDocumentReport className="text-xl" />}
                    tooltip="Your subscription does not include this"

				/>
			</LayoutSubscriptionWrapper>

			{/* Reports & Insights Button */}
			<LayoutSubscriptionWrapper anySubscriptions={["standard", "pro", "admin"]}>
				<SidebarButton
					text="Reports & Insights"
					redirect="reports-and-insights"
					isSidebarOpen={isSidebarOpen}
					symbol={<HiDocumentReport className="text-xl" />}
				/>
			</LayoutSubscriptionWrapper>

			{/* Help & Resources Button - Public*/}
			<LayoutSubscriptionWrapper requiredSubscriptions={["!admin"]}>
				<DisabledSideBarButton
					text="Help & Resources"
					redirect="help-and-resources"
					isSidebarOpen={isSidebarOpen}
                    symbol={<FaBook className="text-base" />}
					tooltip="Coming Soon"
				/>
			</LayoutSubscriptionWrapper>

			{/* Help & Resources Button - Admin*/}
			<LayoutSubscriptionWrapper requiredSubscriptions={["admin"]}>
				<SidebarButton
					text="Help & Resources"
					redirect="help-and-resources"
					isSidebarOpen={isSidebarOpen}
                    symbol={<FaBook className="text-base" />}
				/>
			</LayoutSubscriptionWrapper>
    	</div>
  );
};

export default SidebarHomeButtons;
