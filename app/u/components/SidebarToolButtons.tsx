'use client';

import SidebarButtonDisabled from './SidebarButtonDisabled';
import LayoutSubscriptionWrapper from './LayoutSubscriptionWrapper';
import SidebarButton from './SidebarButton';

import React from 'react';
import { MdManageAccounts } from 'react-icons/md';
import { AiOutlineStock } from 'react-icons/ai';
import { FaRegNewspaper } from 'react-icons/fa6';


interface SidebarToolButtonsProps {
  showAlert: () => void;
}

const SidebarToolButtons: React.FC<SidebarToolButtonsProps> = ({ showAlert }) => {
  return (
    <div>
      <LayoutSubscriptionWrapper requiredSubscriptions={['']}>
        <SidebarButtonDisabled
          text="Reseller News"
          redirect="reseller-news"
          symbol={<FaRegNewspaper className="text-md" />}
          tooltip="Coming Soon"
          showAlert={showAlert}
        />
      </LayoutSubscriptionWrapper>

      <LayoutSubscriptionWrapper requiredSubscriptions={['server']}>
        <SidebarButton
          text="Manage Servers"
          redirect="manage-servers"
          symbol={<MdManageAccounts className="text-md" />}
        />
      </LayoutSubscriptionWrapper>

      <LayoutSubscriptionWrapper requiredSubscriptions={['standard']}>
        <SidebarButton
          text="Sales & Profits"
          redirect="sales-tracker"
          symbol={<AiOutlineStock className="text-md" />}
        />
      </LayoutSubscriptionWrapper>

      <LayoutSubscriptionWrapper requiredSubscriptions={['!standard', '!server']}>
        <SidebarButtonDisabled
          text="Reseller News"
          redirect="reseller-news"
          symbol={<FaRegNewspaper className="text-md" />}
          tooltip="Coming Soon"
          showAlert={showAlert}
        />
      </LayoutSubscriptionWrapper>

      <LayoutSubscriptionWrapper requiredSubscriptions={['!standard', '!server']}>
        <SidebarButtonDisabled
          text="Manage Servers"
          redirect="manage-servers"
          symbol={<MdManageAccounts className="text-md" />}
          showAlert={showAlert}
        />
      </LayoutSubscriptionWrapper>

      <LayoutSubscriptionWrapper requiredSubscriptions={['!standard', '!server']}>
        <SidebarButtonDisabled
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
