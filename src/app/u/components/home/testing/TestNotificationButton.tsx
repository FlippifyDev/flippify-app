// app/profile/TestNotificationButton.tsx (or wherever you place the button)
"use client";

import { useState } from 'react';

const TestNotificationButton = () => {
	const [isNotificationSupported, setIsNotificationSupported] = useState(false);

	const handleNotification = async () => {
		console.log('Notification button clicked');

		// Check if the browser supports notifications
		if (!('Notification' in window)) {
			console.error('This browser does not support notifications.');
			alert('This browser does not support notifications.');
			return;
		}

		// Request notification permission from the user
		const permission = await Notification.requestPermission();
		console.log(`Notification permission: ${permission}`);

		if (permission === 'granted') {
			console.log('Permission granted, checking Service Worker registration...');

			// Ensure the service worker is ready
			navigator.serviceWorker.ready.then((registration) => {
				console.log('Service Worker is ready:', registration);

				// Trigger the notification
				registration.showNotification('Flippify', {
					body: 'Deal Found: £34.90 Profit!',
					icon: '/flippify-logo.png', // Ensure the icon is correctly placed in public folder
					badge: '/flippify-badge.png',
				});

				console.log('Notification should now be visible.');
			}).catch(err => {
				console.error('Service Worker not ready:', err);
			});
		} else {
			console.log('Notification permission denied.');
		}
	};

	return (
		<div className="flex items-center justify-center">
			<button
				onClick={handleNotification}
				className="px-4 py-2 text-white bg-blue-500 rounded-md"
			>
				Test Notification
			</button>
		</div>
	);
};

export default TestNotificationButton;
