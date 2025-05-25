// Local Imports
import ProfileOverview from './ProfileOverview';
import ProfileSettings from './ProfileSettings/ProfileSettings';
import ProfileReferralData from './ReferralProgram/ProfileReferralData';
import ProfileMarketplaceConnect from './ConnectAccounts/ProfileMarketplaceConnect';
import DangerZone from './DangerZone';

const ProfileContent = () => {
    return (
        <div className='flex flex-col w-full min-h-full'>
            <div className="grid grid-cols-1 lg:grid-cols-2 w-full gap-4 pb-2 sm:pb-4">
                <div className='col-span-1 min-h-full w-full flex flex-col gap-2 sm:gap-4'>
                    <ProfileOverview />
                    <ProfileMarketplaceConnect />
                </div>
                <div className='col-span-1 min-h-full w-full flex flex-col gap-2 sm:gap-4'>
                    <ProfileSettings />
                    <ProfileReferralData />
                </div>
                <div className='col-span-1 lg:col-span-2'>
                    <DangerZone />
                </div>
            </div>
        </div>
    );
};

export default ProfileContent;
