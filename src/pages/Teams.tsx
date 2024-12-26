import { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

export const Teams = () => {
  const [events, setEvents] = useState([]); // List of events
  const [selectedEvent, setSelectedEvent] = useState(""); // Currently selected event
  const [participants, setParticipants] = useState([]); // List of participants or teams

  // Fetch events on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/event/events`); // Your API to fetch events
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  // Fetch participants or teams based on the selected event
  useEffect(() => {
    if (selectedEvent) {
      const fetchParticipants = async () => {
        try {
          const response = await axios.get(
            `${BACKEND_URL}/api/v1/event/participants/${selectedEvent}`
          );
          setParticipants(response.data);
        } catch (error) {
          console.error("Error fetching participants:", error);
        }
      };
      fetchParticipants();
    }
  }, [selectedEvent]);

  return (
    <div>
      {/* Event Dropdown */}
      <div className="flex justify-center m-0 p-0">
        <label htmlFor="event-select">Select Event:</label>
        <select
          id="event-select"
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
        >
          <option value="">Select an event</option>
          {events.map((event: { event_id: string; name: string }) => (
            <option value={event.event_id}>{event.name}</option>
          ))}
        </select>
      </div>
      Participants Table
      {participants}
    </div>
  );
};
