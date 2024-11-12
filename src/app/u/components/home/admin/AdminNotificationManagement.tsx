import React, { useState, useEffect } from 'react';
import { database, ref, push, set, onValue, remove } from '@/src/lib/firebase/client';
import { useSession } from 'next-auth/react';

const AdminNotificationManagement = () => {
	const [notificationTitle, setNotificationTitle] = useState("");
	const [notificationMessage, setNotificationMessage] = useState("");
	const [redirectPath, setRedirectPath] = useState(""); // Path to append after the username
	const [notifications, setNotifications] = useState<any[]>([]);
	const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

	const { data: session } = useSession();  // Use session to get username

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

		if (!session?.user?.name) {
			alert("Unable to retrieve username.");
			return;
		}

		const notificationsRef = ref(database, 'notifications');
		const newNotificationRef = push(notificationsRef);

		try {
			const redirectUrl = redirectPath
				? `/u/${session.user.name}/${redirectPath}`  // Create URL using username and custom redirect path
				: null;  // If no redirect path is provided, set it to null

			// Add notification, including optional redirectUrl if provided
			await set(newNotificationRef, {
				title: notificationTitle,
				message: notificationMessage,
				redirectUrl: redirectUrl, // Use dynamic URL with username
				read: false,
				timestamp: Date.now(),
			});

			setNotificationTitle("");
			setNotificationMessage("");
			setRedirectPath(""); // Reset redirect path
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

			<div className="mb-4">
				<label className="block text-gray-700">Optional Redirect Path</label>
				<input
					type="text"
					value={redirectPath}
					onChange={(e) => setRedirectPath(e.target.value)}
					className="input input-bordered w-full"
					placeholder="e.g., events/123"
				/>
				<small className="text-gray-600">
					This will generate the redirect URL: <strong>/u/{session?.user?.name}/{redirectPath || "..."}</strong>
				</small>
			</div>

			<button onClick={handleAddNotification} className="btn bg-houseBlue hover:bg-houseHoverBlue text-white w-full mb-4">
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
									className="checkbox checkbox-houseBlue"
									checked={selectedNotifications.includes(notification.id)}
									onChange={() => handleSelectNotification(notification.id)}
								/>
							</li>
						))}
					</ul>

					<button
						onClick={handleDeleteSelectedNotifications}
						className="btn bg-gray-300 text-black hover:bg-red-600 hover:text-white transition-colors duration-200 mt-4"
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
