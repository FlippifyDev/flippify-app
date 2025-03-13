import React, { useState, useEffect } from "react";
import { firestore } from "@/lib/firebase/config";
import { ref, push, set, get, remove } from "firebase/database";

const AdminEventManagement = () => {
	const [eventTitle, setEventTitle] = useState("");
	const [eventDescription, setEventDescription] = useState("");
	const [eventDate, setEventDate] = useState("");
	const [eventLink, setEventLink] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	const [events, setEvents] = useState<any[]>([]);

	// Fetch events from Firebase using get (one-time fetch)
	useEffect(() => {
		const eventsRef = ref(database, "events");
		const fetchEvents = async () => {
			try {
				const snapshot = await get(eventsRef);
				if (snapshot.exists()) {
					const eventList: any[] = [];
					snapshot.forEach((childSnapshot) => {
						eventList.push({ id: childSnapshot.key, ...childSnapshot.val() });
					});
					setEvents(eventList);
				} else {
					setEvents([]); // No events found
				}
			} catch (error) {
				console.error("Error fetching events:", error);
				setSuccessMessage("Error fetching events.");
			}
		};

		fetchEvents(); // Call the function to fetch events

	}, []); // Empty dependency array to run once when component mounts

	// Add new event to Firebase and send notification
	const handleAddEvent = async () => {
		if (!eventTitle || !eventDescription || !eventDate || !eventLink) {
			alert("Please fill all fields.");
			return;
		}

		const eventsRef = ref(database, "events");
		const newEventRef = push(eventsRef);

		try {
			// Add event to Firebase
			await set(newEventRef, {
				title: eventTitle,
				description: eventDescription,
				date: eventDate,
				link: eventLink,
			});

			// Create a notification for the event
			await push(ref(database, 'notifications'), {
				title: "New Scheduled Event!",
				message: `Check Courses to find out more about ${eventTitle}`,
				timestamp: Date.now(),
				readBy: {}  // Empty object means no one has read it yet
			});

			// Reset form fields
			setEventTitle("");
			setEventDescription("");
			setEventDate("");
			setEventLink("");
			setSuccessMessage("Event and notification added successfully!");
		} catch (error) {
			console.error("Error adding event or notification:", error);
			setSuccessMessage("Error adding event or notification.");
		}
	};

	// Delete an event
	const handleDeleteEvent = async (eventId: string) => {
		try {
			await remove(ref(database, `events/${eventId}`));
			setSuccessMessage("Event deleted successfully!");
		} catch (error) {
			console.error("Error deleting event:", error);
			setSuccessMessage("Error deleting event.");
		}
	};

	return (
		<div className="w-full bg-white p-5 rounded-lg shadow-lg">
			<h2 className="text-2xl font-semibold mb-4">Add New Event</h2>

			<div className="mb-4">
				<label className="block text-gray-700">Event Title</label>
				<input
					type="text"
					value={eventTitle}
					onChange={(e) => setEventTitle(e.target.value)}
					className="input input-bordered w-full"
				/>
			</div>

			<div className="mb-4">
				<label className="block text-gray-700">Description</label>
				<textarea
					value={eventDescription}
					onChange={(e) => setEventDescription(e.target.value)}
					className="textarea textarea-bordered w-full"
				/>
			</div>

			<div className="mb-4">
				<label className="block text-gray-700">Date and Time</label>
				<input
					type="datetime-local"
					value={eventDate}
					onChange={(e) => setEventDate(e.target.value)}
					className="input input-bordered w-full"
				/>

			<div className="mb-4">
				<label className="block text-gray-700">Discord Link</label>
				<input
					type="url"
					value={eventLink}
					onChange={(e) => setEventLink(e.target.value)}
					className="input input-bordered w-full"
				/>
			</div>

			<button onClick={handleAddEvent} className="btn bg-houseBlue hover:bg-houseHoverBlue text-white w-full mb-4">
				Add Event
			</button>

			{successMessage && <p className="mt-4 text-green-500">{successMessage}</p>}

			<h2 className="text-2xl font-semibold mb-4 mt-8">Current Events</h2>
			{events.length === 0 ? (
				<p>No events available.</p>
			) : (
				<ul>
					{events.map((event) => (
						<li key={event.id} className="mb-4 bg-gray-100 p-4 rounded-lg shadow">
							<div className="flex justify-between items-center">
								<div>
									<h3 className="text-lg font-semibold">{event.title}</h3>
									<p>{event.description}</p>
									<p>{new Date(event.date).toLocaleString()}</p>
									<a href={event.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
										Event Link
									</a>
								</div>
								<button
									onClick={() => handleDeleteEvent(event.id)}
									className="btn btn-sm bg-red-500 hover:bg-red-600 text-white"
								>
									Delete
								</button>
							</div>
						</li>
					))}
				</ul>
			)}
			</div>
		</div>
	);
};

export default AdminEventManagement;
