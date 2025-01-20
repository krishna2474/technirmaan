import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { BACKEND_URL } from "../config";
import Navbar from "../components/NavBar";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const GenerateQrPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get("email") || "";
  const event_id = searchParams.get("event_id") || "";

  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [eventName, setEventName] = useState("");
  const [showModal, setShowModal] = useState<boolean>(false);

  const whatsappLinks: Record<string, string> = {
    "Pixel Perfection": "https://chat.whatsapp.com/IHL7H4mqhS4HvnoiKMjSVb",
    "BGMI TDM Showdown": "https://chat.whatsapp.com/BXG8ahezoPbFxptly38ZyR",
    "Clash of Thoughts": "https://chat.whatsapp.com/Jxqk7dQsDAZ2gR6GzTr2bc",
    "Guess it right": "https://chat.whatsapp.com/JJ8sBD8Pdkb6ZeV4VvsHX3",
    "Brand Hunt": "https://chat.whatsapp.com/BzCjfLV2jOT97uoG2dC9WO",
    "Code in the Dark": "https://chat.whatsapp.com/FWVZt7TUAbF6kdpDsxCG5w",
    "Brain Battle": "https://chat.whatsapp.com/ISmlGSm68QB9q26dKGGKw5",
    "Bug Busters": "https://chat.whatsapp.com/HTbvSM1aNR1IdRYXZ4mnO6",
    "UI Showdown": "https://chat.whatsapp.com/HRbevOUM1ucEjp86RklC5c",
  };

  useEffect(() => {
    async function getEvent() {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/v1/event/${event_id}`);
        if (res) {
          console.log("Data", res.data.name);

          setEventName(res.data.name);
          console.log(eventName);
        } else {
          setError("Failed to fetch event details");
        }
      } catch (e) {
        console.error(e);
      }
    }
    getEvent();
  }, [event_id]);

  useEffect(() => {
    const generateQrCode = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `${BACKEND_URL}/api/v1/qr/generate?email=${email}&event_id=${event_id}`
        );

        if (response.data.qrCodeBase64) {
          setQrCode(response.data.qrCodeBase64); // Assuming qrCodeBase64 contains the Base64-encoded QR code image
          setShowModal(true); // Show modal after fetching data
        } else {
          setError(
            "Failed to generate QR code. Please try again.\nIf the error persists, please contact the support team at\ntechnirmaan25@gmail.com"
          );
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred while generating the QR code.");
      } finally {
        setLoading(false);
      }
    };

    generateQrCode();
  }, [email, event_id]);

  const downloadQrCode = () => {
    if (!qrCode) return;

    const link = document.createElement("a");
    link.href = qrCode;
    link.download = `${eventName}QR_Code.png`;
    link.click();
  };

  return (
    <>
      <Navbar />
      <div className="relative flex min-h-screen flex-col overflow-hidden py-12 mx-10">
        <div className="relative bg-white/10 backdrop-blur-3xl border border-white/50 px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
          <div className="mx-auto flex w-full max-w-md flex-col space-y-8">
            <div className="flex flex-col items-center justify-center text-center space-y-2">
              <h1 className="font-semibold text-3xl text-white">QR Code</h1>
              <p className="text-sm font-medium text-gray-400">
                Scan this QR code for your entry during the event
              </p>
            </div>

            <div className="flex justify-center items-center text-white">
              {loading ? (
                <div className="flex flex-col items-center">
                  <Skeleton
                    width={256}
                    height={256}
                    borderRadius="8px"
                    baseColor="#2d3748" // Change to your preferred base color
                    highlightColor="#4a5568" // Change to your preferred highlight color
                  />
                  <Skeleton
                    width={150}
                    height={40}
                    borderRadius="4px"
                    className="mt-4"
                    baseColor="#2d3748" // Same base color
                    highlightColor="#4a5568" // Same highlight color
                  />
                </div>
              ) : error ? (
                <p className="text-red-500 text-center">{error}</p>
              ) : qrCode ? (
                <div className="flex flex-col items-center">
                  <img
                    src={qrCode}
                    alt="Generated QR Code"
                    className="w-64 h-64 rounded-md"
                  />
                  <button
                    onClick={downloadQrCode}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                  >
                    Download QR Code
                  </button>
                </div>
              ) : (
                <p className="text-red-500">Failed to generate QR code</p>
              )}
            </div>
          </div>
        </div>

        {/* Modal */}
        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-40">
            <div className="bg-black p-6 rounded-lg shadow-lg max-w-[90%] sm:max-w-[600px] w-full relative">
              <h2 className="text-green-500 font-semibold text-xl mb-4">
                WhatsApp Group Link
              </h2>
              <div className="max-h-[60vh] overflow-auto">
                <ul className="text-white space-y-2">
                  <li className="font-semibold">
                    Join the Whatsapp group to stay updated with the event
                    details
                  </li>
                  <li>
                    <span className="font-semibold text-green-300">
                      Group Link:{" "}
                    </span>
                    <a
                      href={whatsappLinks[eventName]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 underline break-words"
                    >
                      {whatsappLinks[eventName]
                        ? "Join WhatsApp Group"
                        : "Link not available"}
                    </a>
                  </li>
                </ul>
              </div>
              {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white bg-transparent border-none text-lg"
              >
                &times;
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default GenerateQrPage;
