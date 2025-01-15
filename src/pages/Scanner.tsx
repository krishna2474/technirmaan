import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BrowserMultiFormatReader } from "@zxing/library";
import { BACKEND_URL } from "../config";

const QrScanner = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanner, setScanner] = useState<BrowserMultiFormatReader | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [qrData, setQrData] = useState<any>(null);
  const [isTeamEvent, setIsTeamEvent] = useState<boolean>(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false); // New loading state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lastDecodedRef = useRef<number>(0); // Track the last decode time for debouncing

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/event/events`);
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
        setError("Failed to fetch events.");
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const initScanner = async () => {
      const newScanner = new BrowserMultiFormatReader();
      setScanner(newScanner);
    };
    initScanner();

    return () => {
      if (scanner) {
        scanner.reset();
      }
    };
  }, []);

  const startScanning = async () => {
    if (scanner && videoRef.current && selectedEvent) {
      try {
        setIsScanning(true);
        await scanner.decodeFromVideoDevice(
          null,
          videoRef.current,
          (result) => {
            // Add debouncing logic to avoid excessive decoding attempts
            const currentTime = Date.now();
            if (currentTime - lastDecodedRef.current > 200) {
              // 200 ms debounce
              if (result) {
                lastDecodedRef.current = currentTime; // Update the last decoded timestamp
                validateEvent(result.getText());
                stopScanning();
              }
            }
          }
        );
      } catch (error) {
        console.error(error);
      }
    } else {
      setError("Please select an event before scanning.");
    }
  };

  const stopScanning = () => {
    if (scanner) {
      scanner.reset();
      setIsScanning(false);
    }
  };

  const validateEvent = (qrData: string) => {
    const qrDataObj = JSON.parse(qrData);
    if (qrDataObj.event_id === selectedEvent) {
      setQrData(qrDataObj);
      setIsTeamEvent(qrDataObj.team ? true : false);
      setError(null);
    } else {
      setError("The selected event does not match the QR code.");
    }
  };

  const handleCheckboxChange = (email: string) => {
    setSelectedMembers((prevSelectedMembers) =>
      prevSelectedMembers.includes(email)
        ? prevSelectedMembers.filter((member) => member !== email)
        : [...prevSelectedMembers, email]
    );
  };

  const closeModal = () => {
    setQrData(null);
    setSelectedMembers([]);
  };

  const handleTeamEventSubmission = async () => {
    if (selectedMembers.length === 0) {
      setError("Please select at least one team member.");
      return;
    }

    setLoading(true); // Start loading when submitting
    try {
      await axios.post(`${BACKEND_URL}/api/v1/attendance/mark`, {
        event_id: qrData.event_id,
        emails: selectedMembers,
      });
      setIsSuccess(true); // Show success modal
      setError(null);
      closeModal();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Error submitting attendance.";
      setError(errorMessage);
    } finally {
      setLoading(false); // Stop loading once the request is complete
    }
  };

  const handleIndividualEventSubmission = async () => {
    if (!qrData) {
      setError("Invalid QR data.");
      return;
    }

    setLoading(true); // Start loading when submitting
    try {
      await axios.post(`${BACKEND_URL}/api/v1/attendance/mark`, {
        user_id: qrData.user_id,
        event_id: qrData.event_id,
        emails: [qrData.email],
      });
      setIsSuccess(true); // Show success modal
      setError(null);
      closeModal();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Error submitting attendance.";
      setError(errorMessage);
    } finally {
      setLoading(false); // Stop loading once the request is complete
    }
  };

  const closeSuccessModal = () => {
    setIsSuccess(false);
  };
  const [password, setPassword] = useState<string>("");
  const [accessGranted, setAccessGranted] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const correctPassword = "technirmaan"; // Replace this with your desired password
  useEffect(() => {
    const storedAccess = localStorage.getItem("scannerAccess");
    const storedTimestamp = localStorage.getItem("scannerAccessTimestamp");

    if (storedAccess === "true" && storedTimestamp) {
      const currentTime = Date.now();
      const timestamp = parseInt(storedTimestamp, 10);

      // Check if 10 minutes (600,000 ms) have passed
      if (currentTime - timestamp < 600000) {
        setAccessGranted(true);
      } else {
        localStorage.removeItem("scannerAccess");
        localStorage.removeItem("scannerAccessTimestamp");
      }
    }
  }, []);

  const handlePasswordSubmit = () => {
    if (password === correctPassword) {
      setAccessGranted(true);
      localStorage.setItem("scannerAccess", "true");
      localStorage.setItem("scannerAccessTimestamp", Date.now().toString()); // Store current timestamp
      setPasswordError(null);
    } else {
      setPasswordError("Incorrect password. Please try again.");
    }
  };

  if (!accessGranted) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-white">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Enter Password
        </h2>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 mb-2 rounded-md border border-gray-300 text-black"
          placeholder="Enter password"
        />
        <button
          onClick={handlePasswordSubmit}
          className="px-4 py-2 bg-green-500 text-white rounded-lg"
        >
          Submit
        </button>
        {passwordError && <p className="mt-2 text-red-500">{passwordError}</p>}
      </div>
    );
  }
  return (
    <div className="flex flex-col justify-center items-center text-white px-4 sm:px-6 md:px-8 lg:px-16">
      <div className="flex justify-center mt-5">
        <label htmlFor="event-select">Select Event:</label>
        <select
          className="text-black ml-2 py-2 px-4 rounded-md"
          id="event-select"
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
        >
          <option value="">Select an event</option>
          {events.map((event) => (
            <option key={event.event_id} value={event.event_id}>
              {event.name}
            </option>
          ))}
        </select>
      </div>

      <div className="relative w-full max-w-[400px] h-[300px] border-4 border-green-500 rounded-xl overflow-hidden mt-5">
        <video ref={videoRef} className="w-full h-full object-cover" />
      </div>

      <div className="mt-4">
        {isScanning ? (
          <button
            onClick={stopScanning}
            className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg"
          >
            Stop Scanning
          </button>
        ) : (
          <button
            onClick={startScanning}
            className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg"
          >
            Start Scanning
          </button>
        )}
      </div>

      {error && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-black p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-red-500 font-semibold text-xl">Error</h2>
            <p className="text-white mt-2">{error}</p>
            <button
              onClick={() => setError(null)}
              className="px-4 py-2 bg-red-600 text-white rounded-md mt-4"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {isSuccess && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-black p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-green-500 font-semibold text-xl">Success</h2>
            <p className="text-white mt-2">Attendance marked successfully!</p>
            <button
              onClick={closeSuccessModal}
              className="px-4 py-2 bg-white text-green-500 rounded-md mt-4"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {!isTeamEvent && qrData && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-40">
          <div className="bg-black p-6 rounded-lg shadow-lg max-w-[90%] sm:max-w-[600px] w-full">
            <h2 className="text-green-500 font-semibold text-xl mb-4">
              Individual Registration
            </h2>
            <div className="max-h-[60vh] overflow-auto">
              <ul className="text-white space-y-2">
                <li>
                  <span className="font-semibold text-green-300">
                    Registration ID:{" "}
                  </span>
                  <span className="break-words">{qrData.registration_id}</span>
                </li>
                <li>
                  <span className="font-semibold text-green-300">Name: </span>
                  <span className="break-words">{qrData.Name}</span>
                </li>
                <li>
                  <span className="font-semibold text-green-300">
                    User ID:{" "}
                  </span>
                  <span className="break-words">{qrData.user_id}</span>
                </li>

                <li>
                  <span className="font-semibold text-green-300">
                    Email Address:{" "}
                  </span>
                  <span className="break-words">{qrData.email}</span>
                </li>
                <li>
                  <span className="font-semibold text-green-300">
                    Phone Number:{" "}
                  </span>
                  <span className="break-words">{qrData.phone}</span>
                </li>
                <li>
                  <span className="font-semibold text-green-300">Event: </span>
                  <span className="break-words">{qrData.event_name}</span>
                </li>
              </ul>
            </div>

            <button
              onClick={handleIndividualEventSubmission}
              className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg mt-4 w-full"
              disabled={loading} // Disable the button when loading
            >
              {loading ? "Submitting..." : "Mark Attendance"}
            </button>

            <button
              onClick={closeModal}
              className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg mt-4 w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {isTeamEvent && qrData && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-40">
          <div className="bg-black p-6 rounded-lg shadow-lg max-w-[90%] sm:max-w-[600px] w-full">
            <h2 className="text-green-500 font-semibold text-xl mb-4">
              Team Event Registration
            </h2>
            <div className="max-h-[60vh] overflow-auto">
              <ul className="text-white space-y-2">
                <li>
                  <span className="font-semibold text-green-300">
                    Registration ID:{" "}
                  </span>
                  <span className="break-words">{qrData.registration_id}</span>
                </li>

                <li>
                  <span className="font-semibold text-green-300">Event: </span>
                  <span className="break-words">{qrData.event_name}</span>
                </li>
                <li>
                  <span className="font-semibold text-green-300">
                    Team Members:
                  </span>
                  <span className="break-words">
                    {qrData.team?.map((member: any) => (
                      <div key={member.email}>
                        <input
                          type="checkbox"
                          checked={selectedMembers.includes(member.email)}
                          onChange={() => handleCheckboxChange(member.email)}
                        />
                        {member.Name} - {member.email}
                      </div>
                    ))}
                  </span>
                </li>
              </ul>
            </div>

            <button
              onClick={handleTeamEventSubmission}
              className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg mt-4 w-full"
              disabled={loading} // Disable the button when loading
            >
              {loading ? "Submitting..." : "Submit Team Attendance"}
            </button>

            <button
              onClick={closeModal}
              className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg mt-4 w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QrScanner;
