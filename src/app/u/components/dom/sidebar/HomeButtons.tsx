import DisabledSideBarButton from "./ButtonDisabled";
import LayoutSubscriptionWrapper from "../../layout/LayoutSubscriptionWrapper";
import SidebarButton from "./Button";
import { FaBalanceScaleLeft, FaBook, FaSearch } from "react-icons/fa";
import { MdStickyNote2 } from "react-icons/md";
import { HiDocumentReport } from "react-icons/hi";
import { FaGlobe } from "react-icons/fa";

interface SidebarHomeButtonsProps {
  isSidebarOpen: boolean;
  showAlert: () => void;
}

const SidebarHomeButtons: React.FC<SidebarHomeButtonsProps> = ({ isSidebarOpen, showAlert }) => {	
    const allowedAnySubscriptions = ["standard", "pro", "enterprise", "admin"];
    const unallowedRequiredSubscriptions = ["!standard", "!pro", "!enterprise", "!admin"];
	return (
		<div className="w-full flex flex-col gap-1">
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

			{/* Market Comparison - Public*/}
            <LayoutSubscriptionWrapper requiredSubscriptions={unallowedRequiredSubscriptions}>
				<DisabledSideBarButton
					text="Market Comparison"
					redirect="market-comparison"
					isSidebarOpen={isSidebarOpen}
                    symbol={<FaBalanceScaleLeft className="text-base" />}
                    tooltip="Your subscription does not include this"
				/>
			</LayoutSubscriptionWrapper>

			{/* Market Comparison - Admin*/}
            <LayoutSubscriptionWrapper anySubscriptions={allowedAnySubscriptions}>
				<SidebarButton
                    text="Market Comparison"
                    redirect="market-comparison"
					isSidebarOpen={isSidebarOpen}
                    symbol={<FaBalanceScaleLeft className="text-lg" />}
				/>
			</LayoutSubscriptionWrapper>

			{/* Reports & Insights Button - Public*/}
            <LayoutSubscriptionWrapper requiredSubscriptions={unallowedRequiredSubscriptions}>
				<DisabledSideBarButton
					text="Reports & Insights"
					redirect="reports-and-insights"
					isSidebarOpen={isSidebarOpen}
					symbol={<HiDocumentReport className="text-xl" />}
                    tooltip="Your subscription does not include this"
				/>
			</LayoutSubscriptionWrapper>

			{/* Reports & Insights Button */}
            <LayoutSubscriptionWrapper anySubscriptions={allowedAnySubscriptions}>
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
