'use client';

import SidebarButtonDisabled from './SidebarButtonDisabled';
import LayoutSubscriptionWrapper from '../layout/LayoutSubscriptionWrapper';
import SidebarButton from './SidebarButton';

import React from 'react';
import { PiLegoFill } from "react-icons/pi";
import { FaLaptop } from "react-icons/fa";


interface SidebaMonitorButtonsProps {
  showAlert: () => void;
}

const SidebarMonitorButtons: React.FC<SidebaMonitorButtonsProps> = ({ showAlert }) => {
  return (
    <div>
      {/* Electronics */}
      <LayoutSubscriptionWrapper anySubscriptions={['standard', 'electronics', 'admin']}>
        <SidebarButton
          text="Electronics"
          redirect="monitor-electronics"
          symbol={<FaLaptop className="text-md" />}
        />
      </LayoutSubscriptionWrapper>

      <LayoutSubscriptionWrapper requiredSubscriptions={['!standard', '!electronics', '!admin']}>
        <SidebarButtonDisabled
          text="Electronics"
          redirect="monitor-electronics"
          symbol={<FaLaptop className="text-md" />}
          showAlert={showAlert}
        />
      </LayoutSubscriptionWrapper>

      {/* Retiring Sets Deals */}
      <LayoutSubscriptionWrapper anySubscriptions={['standard', 'retiring sets', 'admin']}>
        <SidebarButton
          text="Retiring Sets"
          redirect="monitor-retiring-sets"
          symbol={<PiLegoFill className="text-md" />}
        />
      </LayoutSubscriptionWrapper>

      <LayoutSubscriptionWrapper requiredSubscriptions={['!standard', '!retiring sets', '!admin']}>
        <SidebarButtonDisabled
          text="Retiring Sets"
          redirect="monitor-retiring-sets"
          symbol={<PiLegoFill className="text-md" />}
          showAlert={showAlert}
        />
      </LayoutSubscriptionWrapper>
    </div>
  );
};

export default SidebarMonitorButtons;
