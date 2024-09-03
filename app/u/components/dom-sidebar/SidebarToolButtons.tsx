'use client';

import DisabledSideBarButton from './SidebarButtonDisabled';
import LayoutSubscriptionWrapper from '../layout/LayoutSubscriptionWrapper';
import SidebarButton from './SidebarButton';

import React from 'react';
import { MdManageAccounts } from 'react-icons/md';
import { AiOutlineStock } from 'react-icons/ai';
import { FaRegNewspaper } from 'react-icons/fa6';
import { GiPointySword } from "react-icons/gi";


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
 

      <LayoutSubscriptionWrapper anySubscriptions={['server', 'admin']}>
        <SidebarButton
          text="Manage Servers"
          redirect="manage-servers"
          symbol={<MdManageAccounts className="text-md" />}
        />
      </LayoutSubscriptionWrapper>

      <LayoutSubscriptionWrapper anySubscriptions={['standard', 'admin']}>
        <SidebarButton
          text="Sales & Profits"
          redirect="sales-tracker"
          symbol={<AiOutlineStock className="text-md" />}
        />
      </LayoutSubscriptionWrapper>

      <LayoutSubscriptionWrapper requiredSubscriptions={['admin']}>
        <SidebarButton
          text="Admin"
          redirect="asldf0987asDa230fDs"
          symbol={<GiPointySword className="text-md" />}
        />
      </LayoutSubscriptionWrapper>

      <LayoutSubscriptionWrapper requiredSubscriptions={['!standard', '!server']}>
        <DisabledSideBarButton
          text="Manage Servers"
          redirect="manage-servers"
          symbol={<MdManageAccounts className="text-md" />}
          showAlert={showAlert}
        />
      </LayoutSubscriptionWrapper>

      <LayoutSubscriptionWrapper requiredSubscriptions={['!standard', '!server']}>
        <DisabledSideBarButton
          text="Sales & Profits"
          redirect="sales-tracker"
          symbol={<AiOutlineStock className="text-md" />}
          showAlert={showAlert}
        />
      </LayoutSubscriptionWrapper>
    </div>
  );
};

export default SidebarToolButtons;
