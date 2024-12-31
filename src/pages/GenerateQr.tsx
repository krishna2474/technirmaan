import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { BACKEND_URL } from "../config";
import Navbar from "../components/NavBar";

const GenerateQrPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get("email") || "";
  const event_id = searchParams.get("event_id") || "";

  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [eventName, setEventName] = useState("");
  useEffect(() => {
    async function getEvent() {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/v1/event/${event_id}`);
        if (res) {
          setEventName(res.data.name);
        } else {
          setError("Failed to fetch event details");
        }
      } catch (e) {}
    }
    getEvent();
  }, []);
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
                <div className="spinner-border animate-spin border-4 border-t-4 border-white rounded-full w-6 h-6"></div>
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
      </div>
    </>
  );
};

export default GenerateQrPage;
