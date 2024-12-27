import { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

interface Member {
  user_id: string;
  name: string;
  email: string;
  phone: string;
  class: string;
  department: string;
  college: string;
  otp: string | null;
  otpExpiresAt: string | null;
  verified: boolean;
  created_at: string;
  updated_at: string;
}

interface Team {
  team: string;
  members: Member[];
}

interface ParticipantsResponse {
  participants: (Team | Member)[];
}

export const Teams = () => {
  const [events, setEvents] = useState<any[]>([]); // List of events
  const [selectedEvent, setSelectedEvent] = useState<string>(""); // Currently selected event
  const [participants, setParticipants] = useState<(Team | Member)[]>([]); // List of teams or members
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  // Fetch events on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/event/events`);
        console.log("Fetched events:", response.data);
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
        setError("Failed to fetch events.");
      }
    };
    fetchEvents();
  }, []);

  // Fetch participants when the selected event changes
  useEffect(() => {
    if (selectedEvent) {
      const fetchParticipants = async () => {
        setLoading(true); // Set loading to true before fetching
        try {
          const response = await axios.get(
            `${BACKEND_URL}/api/v1/event/participants/${selectedEvent}`
          );
          console.log("Fetched participants:", response.data);

          if (response.data && Array.isArray(response.data.participants)) {
            // Update participants state with both teams and individual members
            setParticipants(response.data.participants);
          } else {
            console.error("Participants are not in the expected format.");
            setError("Unexpected participants format.");
          }
        } catch (error) {
          console.error("Error fetching participants:", error);
          setError("Failed to fetch participants.");
        } finally {
          setLoading(false); // Set loading to false after fetching
        }
      };
      fetchParticipants();
    }
  }, [selectedEvent]);

  // Group participants by team
  const groupByTeam = (participants: (Team | Member)[]) => {
    const teams: { [key: string]: Member[] } = {};

    participants.forEach((participant) => {
      if ("members" in participant) {
        teams[participant.team] = participant.members;
      } else {
        // Individual members will be placed in a 'No Team' category
        if (!teams["No Team"]) teams["No Team"] = [];
        teams["No Team"].push(participant);
      }
    });

    return teams;
  };

  // Group the participants by team
  const groupedTeams = groupByTeam(participants);

  return (
    <div className="flex flex-col justify-center items-center text-white">
      {/* Event Dropdown */}
      <div className="flex justify-center mt-5">
        <label htmlFor="event-select">Select Event:</label>
        <select
          className="text-black ml-2"
          id="event-select"
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
        >
          <option value="">Select an event</option>
          {events.map((event: any) => (
            <option key={event.event_id} value={event.event_id}>
              {event.name}
            </option>
          ))}
        </select>
      </div>

      {/* Check if participants data is available */}
      {loading ? (
        <p>Loading participants...</p>
      ) : error ? (
        <p>{error}</p>
      ) : Object.keys(groupedTeams).length === 0 ? (
        <p>No participants found.</p>
      ) : (
        <div className="mt-5">
          {Object.entries(groupedTeams).map(([teamName, teamMembers]) => (
            <div key={teamName} className="mb-8">
              <h2 className="text-xl font-bold text-center mb-4">
                {teamName === "No Team"
                  ? "Individual Participants"
                  : `Team: ${teamName}`}
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-800">
                  <thead>
                    <tr>
                      {teamMembers.length > 0 && (
                        <>
                          <th className="py-2 px-4">Name</th>
                          <th className="py-2 px-4">Email</th>
                          <th className="py-2 px-4">Phone</th>
                          <th className="py-2 px-4">Class</th>
                          <th className="py-2 px-4">Department</th>
                          <th className="py-2 px-4">College</th>
                          <th className="py-2 px-4">Verified</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {teamMembers.map((member: Member) => (
                      <tr key={member.user_id} className="hover:bg-gray-700">
                        <td className="border py-2 px-4">{member.name}</td>
                        <td className="border py-2 px-4">{member.email}</td>
                        <td className="border py-2 px-4">{member.phone}</td>
                        <td className="border py-2 px-4">{member.class}</td>
                        <td className="border py-2 px-4">
                          {member.department}
                        </td>
                        <td className="border py-2 px-4">{member.college}</td>
                        <td className="border py-2 px-4">
                          {member.verified ? "Yes" : "No"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
