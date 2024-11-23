import React from 'react';
import ProfileOverview from './ProfileOverview';
import ProfileReferralData from './ProfileReferralData';
import ProfileSettings from './ProfileSettings';
import ProfileMarketplaceConnect from './ProfileMarketplaceConnect';

const ProfileContent = () => {
	return (
		<div className="flex flex-col md:flex-row w-full min-h-full gap-4 pb-2 sm:pb-4">
			<div className='min-h-full w-full flex flex-col gap-2 sm:gap-4'>
				<ProfileOverview />
				<ProfileMarketplaceConnect />
			</div>
			<div className='min-h-full w-full flex flex-col gap-2 sm:gap-4'>
				<ProfileSettings />
				<ProfileReferralData />
			</div>
		</div>
	);
};

export default ProfileContent;
