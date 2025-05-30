import DisabledSideBarButton from "./ButtonDisabled";
import LayoutSubscriptionWrapper from "../../layout/LayoutSubscriptionWrapper";
import SidebarButton from "./Button";
import { AiFillProduct } from "react-icons/ai";
import { FaBoxOpen } from "react-icons/fa6";
import { FaStore, FaChartPie, FaDatabase } from "react-icons/fa";
import { MdLocalShipping } from "react-icons/md";

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
			{/* Financial Hub Button - Public */}
            <LayoutSubscriptionWrapper requiredSubscriptions={["!admin", "!member"]}>
				<DisabledSideBarButton
					text="Financial Hub"
					redirect="tools/sales-tracker"
					isSidebarOpen={isSidebarOpen}
                    symbol={<FaChartPie className="text-base" />}
                    tooltip="Subscription Required"
				/>
			</LayoutSubscriptionWrapper>

			{/* Financial Hub Button - Admin */}
			<LayoutSubscriptionWrapper anySubscriptions={["admin", "member"]}>
				<SidebarButton
					text="Financial Hub"
					redirect="tools/financial-hub"
					isSidebarOpen={isSidebarOpen}
                    symbol={<FaChartPie className="text-base" />}
				/>
			</LayoutSubscriptionWrapper>

			{/* Inventory & Orders Button - Public */}
            <LayoutSubscriptionWrapper requiredSubscriptions={["!admin", "!member"]}>
				<DisabledSideBarButton
					text="Inventory & Orders"
					redirect="tools/inventory-and-orders"
					isSidebarOpen={isSidebarOpen}
					symbol={<FaBoxOpen className="text-lg" />}
					tooltip="Subscription Required"
				/>
			</LayoutSubscriptionWrapper>

			{/* Inventory & Orders Button */}
			<LayoutSubscriptionWrapper anySubscriptions={["admin", "member"]}>
				<SidebarButton
					text="Inventory & Orders"
					redirect="tools/inventory-and-orders"
					isSidebarOpen={isSidebarOpen}
					symbol={<FaBoxOpen className="text-lg" />}
				/>
			</LayoutSubscriptionWrapper>


            {/* Expenses Button - Public */}
            <LayoutSubscriptionWrapper requiredSubscriptions={["!admin", "!member"]}>
                <DisabledSideBarButton
                    text="Expenses"
                    redirect="tools/expenses"
                    isSidebarOpen={isSidebarOpen}
                    symbol={<FaDatabase className="text-base" />}
                    tooltip="Subscription Required"
                />
            </LayoutSubscriptionWrapper>

            { }
            <LayoutSubscriptionWrapper anySubscriptions={["admin", "member"]}>
                <SidebarButton
                    text="Expenses"
                    redirect="tools/expenses"
                    isSidebarOpen={isSidebarOpen}
                    symbol={<FaDatabase className="text-base" />}
                />
            </LayoutSubscriptionWrapper>

			{/* Listings Manager Button - Public*/}
			<LayoutSubscriptionWrapper requiredSubscriptions={["!admin"]}>
				<DisabledSideBarButton
					text="Listings Manager"
					redirect="tools/listings"
					isSidebarOpen={isSidebarOpen}
					symbol={<AiFillProduct className="text-lg" />}
					tooltip="Coming Soon"
				/>
			</LayoutSubscriptionWrapper>

			{/* Listings Manager Button - Admin */}
			<LayoutSubscriptionWrapper requiredSubscriptions={["admin"]}>
				<SidebarButton
					text="Listings Manager"
					redirect="tools/listings"
					isSidebarOpen={isSidebarOpen}
					symbol={<AiFillProduct className="text-lg" />}
				/>
			</LayoutSubscriptionWrapper>

			{/* Shipping & Fulfillment Button - Public */}
            <LayoutSubscriptionWrapper requiredSubscriptions={["!admin", "!member"]}>
				<DisabledSideBarButton
					text="Shipping & Fulfillment"
					redirect="tools/shipping-and-fulfillment"
					isSidebarOpen={isSidebarOpen}
					symbol={<MdLocalShipping className="text-lg" />}
					tooltip="Coming Soon"
				/>
			</LayoutSubscriptionWrapper>

			{/* Shipping & Fulfillment Button - Admin */}
            <LayoutSubscriptionWrapper anySubscriptions={["admin", "member"]}>
				<SidebarButton
					text="Shipping & Fulfillment"
					redirect="tools/shipping-and-fulfillment"
					isSidebarOpen={isSidebarOpen}
                    symbol={<MdLocalShipping className="text-lg" />}
				/>
			</LayoutSubscriptionWrapper>

			{/* Account Management Button - Public*/}
			<LayoutSubscriptionWrapper requiredSubscriptions={["!admin"]}>
				<DisabledSideBarButton
					text="Account Center"
					redirect="tools/account-center"
					isSidebarOpen={isSidebarOpen}
                    symbol={<FaStore className="text-lg" />}
					tooltip="Coming Soon"
				/>
			</LayoutSubscriptionWrapper>

			{/* Account Management Button - Admin */}
			<LayoutSubscriptionWrapper requiredSubscriptions={["admin"]}>
				<SidebarButton
					text="Account Center"
					redirect="tools/account-center"
					isSidebarOpen={isSidebarOpen}
                    symbol={<FaStore className="text-lg" />}
				/>
			</LayoutSubscriptionWrapper>
		</div>
	);
};

export default SidebarToolButtons;
