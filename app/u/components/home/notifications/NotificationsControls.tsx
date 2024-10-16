"use client";

import React from "react";

const NotificationsControls: React.FC = () => {
  return (
    <div className="w-full p-4 bg-gray-100 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Discord Notification Controls</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span>Enable Discord Notifications</span>
          <input type="checkbox" className="form-checkbox" />
        </div>

        <div className="flex items-center justify-between">
          <span>Enable Email Notifications</span>
          <input type="checkbox" className="form-checkbox" />
        </div>

        <div className="flex items-center justify-between">
          <span>Enable SMS Notifications</span>
          <input type="checkbox" className="form-checkbox" />
        </div>

        <div className="flex items-center justify-between">
          <span>Daily Summary Email</span>
          <input type="checkbox" className="form-checkbox" />
        </div>

        <button className="mt-4 bg-blue-500 text-white p-2 rounded">
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default NotificationsControls;
