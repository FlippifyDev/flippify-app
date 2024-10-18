import React from "react";
import ControlNotificationsButton from "./ControlNotificationsButton";
import TestNotificationButton from "./TestNotificationButton";
import EbayConnectAndStatus from "./EbayConnectAndStatus";

const testContent = () => {
  return (
    <div className="w-full mb-4">
      <div className="mb-4">Notifications Testing</div>
      <div className="w-full mb-10 flex justify-start gap-4">
        <ControlNotificationsButton />
        <TestNotificationButton />
      </div>
      <div className="mb-4">
        eBay Account Connection Testing
      </div>
      <div className="w-full mb-10 flex justify-start">
        <EbayConnectAndStatus />
      </div>
    </div>
  );
};

export default testContent;
