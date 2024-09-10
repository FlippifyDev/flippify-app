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
      <LayoutSubscriptionWrapper anySubscriptions={["electronics", "admin"]}>
        <SidebarButton
          text="Electronics"
          redirect="monitors/electronics"
          symbol={<FaLaptop className="text-md" />}
        />
      </LayoutSubscriptionWrapper>

      {/* Electronics Disabled */}
      <LayoutSubscriptionWrapper anySubscriptions={["!electronics", "!admin"]}>
        <DisabledSideBarButton
          text="Electronics"
          redirect="monitor-electronics"
          symbol={<FaLaptop className="text-lg" />}
          tooltip="Coming Soon"
        />
      </LayoutSubscriptionWrapper>

      {/* Deal Watch */}
      <LayoutSubscriptionWrapper anySubscriptions={["deal watch", "admin"]}>
        <SidebarButton
          text="Deal Watch"
          redirect="monitors/deal-watch"
          symbol={<FaParachuteBox className="text-md" />}
        />
      </LayoutSubscriptionWrapper>

      {/* Deal Watch Disabled */}
      <LayoutSubscriptionWrapper
        requiredSubscriptions={["!deal watch", "!admin"]}
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
        anySubscriptions={["retiring sets", "admin"]}
      >
        <SidebarButton
          text="Retiring Sets"
          redirect="monitors/retiring-sets"
          symbol={<PiLegoFill className="text-md" />}
        />
      </LayoutSubscriptionWrapper>

      {/* Retiring Sets Disabled */}
      <LayoutSubscriptionWrapper
        requiredSubscriptions={["!retiring sets", "!admin"]}
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
