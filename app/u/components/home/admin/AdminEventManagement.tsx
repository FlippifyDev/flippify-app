"use client";

import React, { useState } from "react";
import { database, ref, push, set } from "@/app/api/auth-firebase/firebaseConfig";

const AdminEventManagement = () => {
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventLink, setEventLink] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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

      <button onClick={handleAddEvent} className="btn btn-primary w-full">
        Add Event
      </button>

      {successMessage && <p className="mt-4 text-green-500">{successMessage}</p>}
    </div>
  );
};

export default AdminEventManagement;
