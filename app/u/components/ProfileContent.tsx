import React from 'react';
import ProfileOverview from './ProfileOverview';
import ProfileReferralData from './ProfileReferralData';
import ProfileSettings from './ProfileSettings';

const ProfileContent = () => {
  return (
    <div className="flex flex-col w-full h-full">
      <div className="w-full mb-4">
        <ProfileOverview />
      </div>
      <div className="flex w-full gap-4">
        <div className="w-full lg:w-1/2">
          <ProfileReferralData />
        </div>
        <div className="w-full lg:w-1/2">
          <ProfileSettings />
        </div>
      </div>
    </div>
  );
};

export default ProfileContent;
