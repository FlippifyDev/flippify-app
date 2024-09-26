import React from "react";
import ControlNotificationsButton from "./ControlNotificationsButton";
import TestNotificationButton from "./TestNotificationButton";
import EbayConnect from "./EbayConnect"

const testContent = () => {
  return (
    <div className="w-full mb-4">
      <div className="mb-4">Notifications Testing</div>
      <div className="w-full mb-10 flex justify-start gap-4">
        <ControlNotificationsButton />
        <TestNotificationButton />
      </div>
      <div className="mb-4">
        eBay and Amazon Connection Testing here
      </div>
      <div className="w-full mb-10 flex justify-start">
        <EbayConnect />
      </div>
    </div>
  );
};

export default testContent;
