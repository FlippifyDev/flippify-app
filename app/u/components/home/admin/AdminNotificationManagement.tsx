// AdminNotificationManagement.tsx
import React, { useState, useEffect } from 'react';
import { database, ref, push, set, onValue, remove } from '@/app/api/auth-firebase/firebaseConfig';

const AdminNotificationManagement = () => {
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notifications, setNotifications] = useState<any[]>([]);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

  useEffect(() => {
    const notificationsRef = ref(database, 'notifications');
    onValue(notificationsRef, (snapshot) => {
      const notificationList: any[] = [];
      snapshot.forEach((childSnapshot) => {
        notificationList.push({ id: childSnapshot.key, ...childSnapshot.val() });
      });
      setNotifications(notificationList);
    });
  }, []);

  const handleAddNotification = async () => {
    if (!notificationTitle || !notificationMessage) {
      alert("Please fill in all fields.");
      return;
    }

    const notificationsRef = ref(database, 'notifications');
    const newNotificationRef = push(notificationsRef);

    try {
      await set(newNotificationRef, {
        title: notificationTitle,
        message: notificationMessage,
        read: false,
      });

      setNotificationTitle("");
      setNotificationMessage("");
      alert("Notification added!");
    } catch (error) {
      console.error("Error adding notification:", error);
      alert("Error adding notification.");
    }
  };

  const handleDeleteSelectedNotifications = async () => {
    if (selectedNotifications.length === 0) {
      alert("No notifications selected.");
      return;
    }

    try {
      for (const notificationId of selectedNotifications) {
        const notificationRef = ref(database, `notifications/${notificationId}`);
        await remove(notificationRef);
      }
      setSelectedNotifications([]);
      alert("Selected notifications deleted!");
    } catch (error) {
      console.error("Error deleting notifications:", error);
      alert("Error deleting notifications.");
    }
  };

  const handleSelectNotification = (notificationId: string) => {
    if (selectedNotifications.includes(notificationId)) {
      setSelectedNotifications(selectedNotifications.filter(id => id !== notificationId));
    } else {
      setSelectedNotifications([...selectedNotifications, notificationId]);
    }
  };

  return (
    <div className="w-full bg-white p-5 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Notification Management</h2>

      {/* Add Notification Form */}
      <div className="mb-4">
        <label className="block text-gray-700">Notification Title</label>
        <input
          type="text"
          value={notificationTitle}
          onChange={(e) => setNotificationTitle(e.target.value)}
          className="input input-bordered w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Message</label>
        <textarea
          value={notificationMessage}
          onChange={(e) => setNotificationMessage(e.target.value)}
          className="textarea textarea-bordered w-full"
        />
      </div>

      <button onClick={handleAddNotification} className="btn btn-primary w-full mb-4">
        Add Notification
      </button>

      {/* Notifications List */}
      <h3 className="text-xl font-semibold mb-4">Delete Notifications</h3>
      {notifications.length > 0 ? (
        <div>
          <ul>
            {notifications.map((notification) => (
              <li key={notification.id} className="flex items-center justify-between mb-2">
                <div>
                  <strong>{notification.title}</strong> - {notification.message}
                </div>
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  checked={selectedNotifications.includes(notification.id)}
                  onChange={() => handleSelectNotification(notification.id)}
                />
              </li>
            ))}
          </ul>

          <button
            onClick={handleDeleteSelectedNotifications}
            className="btn btn-error mt-4"
            disabled={selectedNotifications.length === 0}
          >
            Delete Selected Notifications
          </button>
        </div>
      ) : (
        <p>No notifications available for deletion.</p>
      )}
    </div>
  );
};

export default AdminNotificationManagement;
