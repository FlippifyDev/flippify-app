import { database } from "@/src/lib/firebase/client";
import { get, ref, update } from "firebase/database";
import { INotification } from "@/src/models/firebase"


interface NotificationResponse {
	notificationList: INotification[];
	unreadNotifications: number;
}

export async function fetchNotifications(customerId: string): Promise<NotificationResponse | null> {
	try {
		const notificationsRef = ref(database, "notifications");
		const snapshot = await get(notificationsRef);

		if (snapshot.exists()) {
			const notificationList: INotification[] = [];
			let unreadNotifications = 0;

			snapshot.forEach((childSnapshot) => {
				const notification: INotification = { id: childSnapshot.key || '', ...childSnapshot.val() };

				if (!notification.readBy || !notification.readBy[customerId]) {
					unreadNotifications++;
				}

				notificationList.push(notification);
			});

			return { notificationList, unreadNotifications };
		} else {
			console.log("No notifications data available.");
			return { notificationList: [], unreadNotifications: 0 };
		}
	} catch (error) {
		console.error("Error fetching notifications:", error);
		return null;
	}
}


export async function markNotificationsAsRead(notifications: INotification[], customerId: string) {
	notifications.forEach(async (notification) => {
		const notificationRef = ref(database, `notifications/${notification.id}`);

		if (!notification.readBy || !notification.readBy[customerId]) {
			await update(notificationRef, {
				[`readBy/${customerId}`]: true,
			});
		}
	});
}