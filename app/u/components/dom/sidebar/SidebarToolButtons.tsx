'use client';

import DisabledSideBarButton from './SidebarButtonDisabled';
import LayoutSubscriptionWrapper from '../../layout/LayoutSubscriptionWrapper';
import SidebarButton from './SidebarButton';

import React from 'react';
import { AiOutlineStock } from 'react-icons/ai';
import { FaRegNewspaper } from 'react-icons/fa6';
import { FaServer, FaBoxOpen } from "react-icons/fa6";


interface SidebarToolButtonsProps {
  showAlert: () => void;
}

const SidebarToolButtons: React.FC<SidebarToolButtonsProps> = ({ showAlert }) => {
  return (
    <div>
      <DisabledSideBarButton
        text="Reseller News"
        redirect="reseller-news"
        symbol={<FaRegNewspaper className="text-md" />}
        tooltip="Coming Soon"
      />

      {/* Manage Servers Tab */}
      <LayoutSubscriptionWrapper anySubscriptions={['server', 'admin']}>
          <SidebarButton
              text="Server Management"
              redirect="manage-servers#monitors"
              symbol={<FaServer className="text-base" />}
          />
      </LayoutSubscriptionWrapper>

      {/* Manage Servers Tab */}
      <LayoutSubscriptionWrapper requiredSubscriptions={['!server', '!admin']}>
          <DisabledSideBarButton
              text="Server Management"
              redirect="manage-servers#monitors"
              symbol={<FaServer className="text-base" />}
              showAlert={showAlert}
          />
      </LayoutSubscriptionWrapper>


      <DisabledSideBarButton
        text="Financial Hub"
        redirect="sales-tracker"
        symbol={<AiOutlineStock className="text-md" />}
        tooltip="Coming Soon"
      />


      {/* Inventory & Orders */}
      <DisabledSideBarButton
        text="Inventory & Orders"
        redirect="inventory-orders"
        symbol={<FaBoxOpen className="text-md" />}
        tooltip="Coming Soon"
      />
    </div>
  );
};

export default SidebarToolButtons;
