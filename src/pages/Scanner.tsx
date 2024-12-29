import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BrowserMultiFormatReader } from "@zxing/library";
import { BACKEND_URL } from "../config";

const QrScanner = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [scanResult, setScanResult] = useState<string>("");
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanner, setScanner] = useState<BrowserMultiFormatReader | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [qrData, setQrData] = useState<any>(null);
  const [isTeamEvent, setIsTeamEvent] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Fetch events on component mount
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

  // Initialize the scanner
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

  // Start scanning
  const startScanning = async () => {
    if (scanner && videoRef.current && selectedEvent) {
      try {
        setIsScanning(true);
        await scanner.decodeFromVideoDevice(
          null,
          videoRef.current,
          (result) => {
            if (result) {
              setScanResult(result.getText());
              validateEvent(result.getText());
              stopScanning();
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

  // Stop scanning
  const stopScanning = () => {
    if (scanner) {
      scanner.reset();
      setIsScanning(false);
    }
  };

  // Validate the event ID and determine modal type
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

  // Close modals
  const closeModal = () => {
    setQrData(null);
  };

  return (
    <div className="flex flex-col justify-center items-center text-white px-4 sm:px-6 md:px-8 lg:px-16">
      {/* Event Selection */}
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

      {/* QR Scanner */}
      <div className="relative w-full max-w-[400px] h-[300px] border-4 border-green-500 rounded-xl overflow-hidden mt-5">
        <video ref={videoRef} className="w-full h-full object-cover" />
      </div>

      {/* Start/Stop Scanning */}
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

      {/* Error Modal */}
      {error && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-black p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-red-500 font-semibold text-xl">Error</h2>
            <p className="text-white mt-2">{error}</p>
            <button
              onClick={() => setError(null)}
              className="px-4 py-2 bg-gray-300 rounded-md mt-4"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Individual Registration Modal */}
      {!isTeamEvent && qrData && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-black p-6 rounded-lg shadow-lg max-w-[90%] sm:max-w-[600px] w-full">
            <h2 className="text-green-500 font-semibold text-xl mb-4">
              Individual Registration
            </h2>
            <div className="max-h-[60vh] overflow-auto">
              <ul className="text-white space-y-2">
                {Object.entries(qrData).map(([key, value]) => (
                  <li key={key}>
                    <span className="font-semibold text-green-300">{key}:</span>{" "}
                    <span className="break-words">{value + ""}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-gray-300 text-black rounded-md mt-4"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Team Registration Modal */}
      {isTeamEvent && qrData && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-black p-6 rounded-lg shadow-lg max-w-[90%] sm:max-w-[600px] w-full">
            <h2 className="text-green-500 font-semibold text-xl mb-4">
              Team Registration
            </h2>
            <div className="max-h-[60vh] overflow-auto">
              <ul className="text-white space-y-2 mb-4">
                <li>
                  <span className="font-semibold text-green-300">
                    Event Name:
                  </span>{" "}
                  <span className="break-words">{qrData.event_name}</span>
                </li>
                <li>
                  <span className="font-semibold text-green-300">
                    Event ID:
                  </span>{" "}
                  <span className="break-words">{qrData.event_id}</span>
                </li>
              </ul>
              <h3 className="text-green-400 font-semibold text-lg mb-2">
                Team Members:
              </h3>
              <ul className="text-white space-y-2">
                {qrData.team.map((member: any, index: number) => (
                  <li key={member.user_id}>
                    <span className="font-semibold text-green-300">
                      Member {index + 1}:
                    </span>{" "}
                    <span className="break-words">
                      {member.Name} ({member.email})
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={closeModal}
              className="px-4 py-2 text-black rounded-md mt-4 bg-red-700 text-white"
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
