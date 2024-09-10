"use client";

import DisabledSideBarButton from "./SidebarButtonDisabled";
import LayoutSubscriptionWrapper from "../../layout/LayoutSubscriptionWrapper";
import SidebarButton from "./SidebarButton";

import React from "react";
import { PiLegoFill } from "react-icons/pi";
import { FaLaptop } from "react-icons/fa";
import { FaParachuteBox } from "react-icons/fa6";

interface SidebaMonitorButtonsProps {
  showAlert: () => void;
}

const SidebarMonitorButtons: React.FC<SidebaMonitorButtonsProps> = ({
  showAlert,
}) => {
  return (
    <div>
      {/* Electronics */}
      <LayoutSubscriptionWrapper anySubscriptions={["electronics"]}>
        <SidebarButton
          text="Electronics"
          redirect="monitors/electronics"  // Correct redirect path for Electronics
          symbol={<FaLaptop className="text-md" />}
        />
      </LayoutSubscriptionWrapper>

      {/* Electronics Disabled */}
      <LayoutSubscriptionWrapper requiredSubscriptions={["!electronics"]}>
        <DisabledSideBarButton
          text="Electronics"
          redirect="monitors/electronics"  // Updated the redirect path
          symbol={<FaLaptop className="text-lg" />}
          showAlert={showAlert}  // Ensuring alert is triggered correctly
        />
      </LayoutSubscriptionWrapper>

      {/* Deal Watch */}
      <LayoutSubscriptionWrapper anySubscriptions={["deal watch"]}>
        <SidebarButton
          text="Deal Watch"
          redirect="monitors/deal-watch"
          symbol={<FaParachuteBox className="text-md" />}
        />
      </LayoutSubscriptionWrapper>

      {/* Deal Watch Disabled */}
      <LayoutSubscriptionWrapper
        requiredSubscriptions={["!deal watch"]}
      >
        <DisabledSideBarButton
          text="Deal Watch"
          redirect="monitors/deal-watch"
          symbol={<FaParachuteBox className="text-md" />}
          showAlert={showAlert}
        />
      </LayoutSubscriptionWrapper>

      {/* Retiring Sets */}
      <LayoutSubscriptionWrapper
        anySubscriptions={["retiring sets"]}
      >
        <SidebarButton
          text="Retiring Sets"
          redirect="monitors/retiring-sets"
          symbol={<PiLegoFill className="text-md" />}
        />
      </LayoutSubscriptionWrapper>

      {/* Retiring Sets Disabled */}
      <LayoutSubscriptionWrapper
        requiredSubscriptions={["!retiring sets"]}
      >
        <DisabledSideBarButton
          text="Retiring Sets"
          redirect="monitors/retiring-sets"
          symbol={<PiLegoFill className="text-md" />}
          showAlert={showAlert}
        />
      </LayoutSubscriptionWrapper>
    </div>
  );
};

export default SidebarMonitorButtons;
