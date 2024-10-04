"use client";

import React, { useState, useEffect } from "react";
import { database, ref, push, set, onValue, remove } from "@/app/api/auth-firebase/firebaseConfig";

const AdminEventManagement = () => {
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventLink, setEventLink] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

  // Fetch events from Firebase
  useEffect(() => {
    const eventsRef = ref(database, "events");
    onValue(eventsRef, (snapshot) => {
      const eventList: any[] = [];
      snapshot.forEach((childSnapshot) => {
        eventList.push({ id: childSnapshot.key, ...childSnapshot.val() });
      });
      setEvents(eventList);
    });
  }, []);

  // Add new event to Firebase
  const handleAddEvent = async () => {
    if (!eventTitle || !eventDescription || !eventDate || !eventLink) {
      alert("Please fill all fields.");
      return;
    }

    const eventsRef = ref(database, "events");
    const newEventRef = push(eventsRef);

    try {
      await set(newEventRef, {
        title: eventTitle,
        description: eventDescription,
        date: eventDate,
        link: eventLink,
      });

      setEventTitle("");
      setEventDescription("");
      setEventDate("");
      setEventLink("");
      setSuccessMessage("Event added successfully!");
    } catch (error) {
      console.error("Error adding event:", error);
      setSuccessMessage("Error adding event.");
    }
  };

  // Handle selecting events for deletion
  const handleSelectEvent = (eventId: string) => {
    if (selectedEvents.includes(eventId)) {
      setSelectedEvents(selectedEvents.filter(id => id !== eventId));
    } else {
      setSelectedEvents([...selectedEvents, eventId]);
    }
  };

  // Delete selected events
  const handleDeleteSelectedEvents = async () => {
    if (selectedEvents.length === 0) {
      alert("No events selected.");
      return;
    }

    try {
      for (const eventId of selectedEvents) {
        const eventRef = ref(database, `events/${eventId}`);
        await remove(eventRef);
      }

      setSelectedEvents([]);
      setSuccessMessage("Selected events deleted successfully!");
    } catch (error) {
      console.error("Error deleting events:", error);
      setSuccessMessage("Error deleting events.");
    }
  };

  return (
    <div className="w-full bg-white p-5 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Add New Event</h2>

      {/* Add Event Form */}
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
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Discord Link</label>
        <input
          type="url"
          value={eventLink}
          onChange={(e) => setEventLink(e.target.value)}
          className="input input-bordered w-full"
        />
      </div>

      <button onClick={handleAddEvent} className="btn btn-primary w-full mb-4">
        Add Event
      </button>

      {/* Success Message */}
      {successMessage && <p className="mt-4 text-green-500">{successMessage}</p>}

      {/* Events List with Deletion Option */}
      <h3 className="text-xl font-semibold mb-4 mt-6">Delete Events</h3>
      {events.length > 0 ? (
        <div>
          <ul>
            {events.map((event) => (
              <li key={event.id} className="flex items-center justify-between mb-2">
                <div>
                  <strong>{event.title}</strong> - {new Date(event.date).toLocaleString()}
                </div>
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  checked={selectedEvents.includes(event.id)}
                  onChange={() => handleSelectEvent(event.id)}
                />
              </li>
            ))}
          </ul>

          <button
            onClick={handleDeleteSelectedEvents}
            className="btn btn-error mt-4"
            disabled={selectedEvents.length === 0}
          >
            Delete Selected Events
          </button>
        </div>
      ) : (
        <p>No events available for deletion.</p>
      )}
    </div>
  );
};

export default AdminEventManagement;
