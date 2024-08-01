import React from 'react';

const ProfileSettings = () => {
  return (
    <div className="card bg-white shadow-md rounded-lg p-4 h-full flex flex-col">
      <h2 className="card-title text-lightModeText text-xl font-semibold">
        Profile Settings
      </h2>
      <p className="text-base font-normal text-gray-500 dark:text-gray-400">
        Here you can update your profile settings.
      </p>
      {/* Add more profile settings details here */}
    </div>
  );
};

export default ProfileSettings;
