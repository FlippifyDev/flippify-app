"use client";

import DisabledSideBarButton from "./SidebarButtonDisabled";
import LayoutSubscriptionWrapper from "../../layout/LayoutSubscriptionWrapper";
import SidebarButton from "./SidebarButton";

import React from "react";
import { PiLegoFill } from "react-icons/pi";
import { FaLaptop } from "react-icons/fa";
import { FaParachuteBox } from "react-icons/fa6";
import { BiSolidBinoculars } from "react-icons/bi";

interface SidebaMonitorButtonsProps {
  showAlert: () => void;
}

const SidebarMonitorButtons: React.FC<SidebaMonitorButtonsProps> = ({
  showAlert,
}) => {
  return (
    <div>
      <LayoutSubscriptionWrapper anySubscriptions={["member", "electronics"]}>
        <SidebarButton
          text="Restock Info"
          redirect="monitors/restock-info"  
          symbol={<FaParachuteBox className="text-md" />}
        />
      </LayoutSubscriptionWrapper>

      {/* Electronics */}
      <LayoutSubscriptionWrapper anySubscriptions={["member", "electronics"]}>
        <SidebarButton
          text="Electronics"
          redirect="monitors/electronics" 
          symbol={<FaLaptop className="text-md" />}
        />
      </LayoutSubscriptionWrapper>

      {/* Electronics Disabled */}
      <LayoutSubscriptionWrapper requiredSubscriptions={["!electronics", "!member"]}>
        <DisabledSideBarButton
          text="Electronics"
          redirect="monitors/electronics" 
          symbol={<FaLaptop className="text-lg" />}
          showAlert={showAlert}  
        />
      </LayoutSubscriptionWrapper>

      {/* Deal Watch */}
      <LayoutSubscriptionWrapper anySubscriptions={["member", "deal watch"]}>
        <SidebarButton
          text="Deal Watch"
          redirect="monitors/deal-watch"
          symbol={<BiSolidBinoculars className="text-md" />}
        />
      </LayoutSubscriptionWrapper>

      {/* Deal Watch Disabled */}
      <LayoutSubscriptionWrapper
        requiredSubscriptions={["!deal watch", "!member"]}
      >
        <DisabledSideBarButton
          text="Deal Watch"
          redirect="monitors/deal-watch"
          symbol={<BiSolidBinoculars className="text-md" />}
          showAlert={showAlert}
        />
      </LayoutSubscriptionWrapper>

      {/* Retiring Sets */}
      <LayoutSubscriptionWrapper
        anySubscriptions={["member", "retiring sets"]}
      >
        <SidebarButton
          text="Retiring Sets"
          redirect="monitors/retiring-sets"
          symbol={<PiLegoFill className="text-md" />}
        />
      </LayoutSubscriptionWrapper>

      {/* Retiring Sets Disabled */}
      <LayoutSubscriptionWrapper
        requiredSubscriptions={["!retiring sets", "!member"]}
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
