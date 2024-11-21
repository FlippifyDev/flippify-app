import React from 'react';
import ProfileOverview from './ProfileOverview';
import ProfileReferralData from './ProfileReferralData';
import ProfileSettings from './ProfileSettings';
import ProfileMarketplaceConnect from './ProfileMarketplaceConnect';

const ProfileContent = () => {
	return (
		<div className="flex flex-row w-full h-full gap-4">
			<div className='w-full flex flex-col gap-4'>
				<ProfileOverview />
				<ProfileMarketplaceConnect />
			</div>
			<div className='w-full flex flex-col gap-4'>
				<ProfileSettings />
				<ProfileReferralData />
			</div>
		</div>
	);
};

export default ProfileContent;
