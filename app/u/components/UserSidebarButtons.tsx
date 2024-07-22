'use client';

import React from 'react';
import SideBarButton from './SideBarButton';
import { MdManageAccounts } from 'react-icons/md';
import { AiOutlineStock } from 'react-icons/ai';
import { FaRegNewspaper } from 'react-icons/fa6';
import SubscriptionWrapper from './SubscriptionWrapper';
import DisabledSideBarButton from './DisabledSideBarButton';

interface UserSidebarButtonsProps {
  showAlert: () => void;
}

const UserSidebarButtons: React.FC<UserSidebarButtonsProps> = ({ showAlert }) => {
  return (
    <div>
      <SubscriptionWrapper requiredSubscriptions={['']}>
        <DisabledSideBarButton
          text="Reseller News"
          redirect="reseller-news"
          symbol={<FaRegNewspaper className="text-md" />}
          tooltip="Coming Soon"
          showAlert={showAlert}
        />
      </SubscriptionWrapper>

      <SubscriptionWrapper requiredSubscriptions={['server']}>
        <SideBarButton
          text="Manage Servers"
          redirect="manage-servers"
          symbol={<MdManageAccounts className="text-md" />}
        />
      </SubscriptionWrapper>

      <SubscriptionWrapper requiredSubscriptions={['standard']}>
        <SideBarButton
          text="Sales & Profits"
          redirect="sales-tracker"
          symbol={<AiOutlineStock className="text-md" />}
        />
      </SubscriptionWrapper>

      <SubscriptionWrapper requiredSubscriptions={['!standard', '!server']}>
        <DisabledSideBarButton
          text="Reseller News"
          redirect="reseller-news"
          symbol={<FaRegNewspaper className="text-md" />}
          tooltip="Coming Soon"
          showAlert={showAlert}
        />
      </SubscriptionWrapper>

      <SubscriptionWrapper requiredSubscriptions={['!standard', '!server']}>
        <DisabledSideBarButton
          text="Manage Servers"
          redirect="manage-servers"
          symbol={<MdManageAccounts className="text-md" />}
          showAlert={showAlert}
        />
      </SubscriptionWrapper>

      <SubscriptionWrapper requiredSubscriptions={['!standard', '!server']}>
        <DisabledSideBarButton
          text="Sales & Profits"
          redirect="sales-tracker"
          symbol={<AiOutlineStock className="text-md" />}
          showAlert={showAlert}
        />
      </SubscriptionWrapper>
    </div>
  );
};

export default UserSidebarButtons;
