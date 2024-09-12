"use client";

import React, { useState, useEffect } from 'react';

const ProfileNotificationsButton: React.FC = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isManuallyDisabled, setIsManuallyDisabled] = useState(false);

  useEffect(() => {
    navigator.serviceWorker.ready.then((registration) => {
      registration.pushManager.getSubscription().then((subscription) => {
        setIsSubscribed(!!subscription);
        if (!subscription) {
          console.log('No active push subscription.');
        } else {
          console.log('Push subscription active:', subscription);
        }
      });
    });

    checkSystemNotificationPermissions();
  }, []);

  // Check if system-level notifications are blocked
  const checkSystemNotificationPermissions = async () => {
    const permission = Notification.permission;
    if (permission === 'denied') {
      setIsManuallyDisabled(true);
      console.log('Notifications are disabled at the system level.');
    } else {
      setIsManuallyDisabled(false);
    }
  };

  // Enable notifications
  const enableNotifications = async () => {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const registration = await navigator.serviceWorker.ready;
      const pushSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array('YOUR_VAPID_KEY'),
      });
      console.log('User subscribed:', pushSubscription);
      setIsSubscribed(true);
    } else if (permission === 'denied') {
      setIsManuallyDisabled(true);
    } else {
      console.log('Notification permission not granted.');
    }
  };

  // Disable notifications
  const disableNotifications = async () => {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      await subscription.unsubscribe();
      console.log('User unsubscribed.');
      setIsSubscribed(false);
    }
  };

  const handleToggleNotifications = async () => {
    if (isManuallyDisabled) {
      alert('Please enable notifications in your system settings.');
      return;
    }

    if (isSubscribed) {
      await disableNotifications();
    } else {
      await enableNotifications();
    }
  };

  return (
    <div className="flex items-center">
      <button
        onClick={handleToggleNotifications}
        className={`px-4 py-2 text-white rounded-md ${isSubscribed ? 'bg-green-500' : 'bg-gray-500'}`}
      >
        {isSubscribed ? 'Disable Notifications' : 'Enable Notifications'}
      </button>
    </div>
  );
};

// Utility function to handle VAPID key conversion
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default ProfileNotificationsButton;
