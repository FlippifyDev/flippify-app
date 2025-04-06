// Local Imports
import ProfileOverview from './ProfileOverview';
import ProfileSettings from './ProfileSettings/ProfileSettings';
import ProfileReferralData from './ReferralProgram/ProfileReferralData';
import ProfileMarketplaceConnect from './ConnectAccounts/ProfileMarketplaceConnect';

const ProfileContent = () => {
    return (
        <div className='flex flex-col w-full min-h-full'>
            <div className="flex flex-col lg:flex-row w-full gap-4 pb-2 sm:pb-4">
                <div className='min-h-full w-full flex flex-col gap-2 sm:gap-4'>
                    <ProfileOverview />
                    <ProfileMarketplaceConnect />
                </div>
                <div className='min-h-full w-full flex flex-col gap-2 sm:gap-4'>
                    <ProfileSettings />
                    <ProfileReferralData />
                </div>
            </div>
        </div>
    );
};

export default ProfileContent;
