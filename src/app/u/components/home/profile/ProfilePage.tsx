import React from 'react';
import ProfileOverview from './ProfileOverview';
import ProfileReferralData from './ReferralProgram/ProfileReferralData';
import ProfileSettings from './ProfileSettings/ProfileSettings';
import ProfileMarketplaceConnect from './ConnectAccounts/ProfileMarketplaceConnect';
import UpdateAccountDetails from './UpdateAccountDetails';

const ProfileContent = () => {
    return (
        <div className='flex flex-col w-full min-h-full'>
            <div className="flex flex-col md:flex-row w-full gap-4 pb-2 sm:pb-4">
                <div className='min-h-full w-full flex flex-col gap-2 sm:gap-4'>
                    <ProfileOverview />
                    <ProfileMarketplaceConnect />
                </div>
                <div className='min-h-full w-full flex flex-col gap-2 sm:gap-4'>
                    <ProfileSettings />
                    <ProfileReferralData />
                </div>
            </div>
            <div className='w-full'>
                <UpdateAccountDetails />
            </div>
        </div>
    );
};

export default ProfileContent;
