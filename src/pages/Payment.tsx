import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { BACKEND_URL } from "../config";

export const Payment = () => {
  const [amount, setAmount] = useState(null); // Default to null until fetched
  const [transactionId, setTransactionId] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  console.log(paymentStatus);

  const [email, setEmail] = useState("");
  const [eventId, setEventId] = useState("");

  // Parse query parameters from the URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailFromUrl = params.get("email");
    const eventIdFromUrl = params.get("event_id");

    if (!emailFromUrl || !eventIdFromUrl) {
      navigate("/register"); // Redirect to registration if email or event_id is missing
    } else {
      setEmail(emailFromUrl);
      setEventId(eventIdFromUrl);
      fetchEventAmount(eventIdFromUrl); // Fetch the amount based on eventId
    }
  }, [location.search, navigate]);

  // Fetch the amount for the event from the database
  const fetchEventAmount = async (eventId: string) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/event/${eventId}`);
      setAmount(response.data.amount); // Assuming response contains the 'amount'
    } catch (error) {
      console.error("Failed to fetch event amount", error);
      alert("Failed to load event details. Please try again.");
    }
  };

  const initiatePayment = async () => {
    if (!amount) {
      alert("Amount not available for this event.");
      return;
    }

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/vi/payment/initiate`,
        { email, eventId, amount },
        { headers: { "Content-Type": "application/json" } }
      );

      const { transactionId, paymentUrl } = response.data;
      setTransactionId(transactionId);

      // Redirect to the payment gateway
      window.location.href = paymentUrl;
    } catch (error) {
      console.error("Payment initiation failed", error);
      alert("Failed to initiate payment. Please try again.");
    }
  };

  const checkPaymentStatus = async () => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/payment/status?transactionId=${transactionId}`
      );
      setPaymentStatus(response.data.status);

      if (response.data.status === "SUCCESS") {
        alert("Payment successful!");
        navigate(`/generate-qr?email=${email}&event_id=${eventId}`); // Redirect to QR Code page
      } else {
        alert("Payment failed or pending. Please try again.");
      }
    } catch (error) {
      console.error("Failed to fetch payment status", error);
      alert("Error while checking payment status. Please contact support.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">
          Complete Your Payment
        </h1>
        {amount !== null ? (
          <>
            <p className="text-center text-lg mb-6">Amount to Pay: ₹{amount}</p>
            <button
              className="w-full bg-indigo-600 text-white py-2 rounded-lg text-xl mb-4 hover:bg-indigo-700 transition duration-200"
              onClick={initiatePayment}
            >
              Pay Now
            </button>

            {transactionId && (
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Transaction ID: {transactionId}
                </p>
                <button
                  className="w-full bg-green-600 text-white py-2 rounded-lg text-xl mt-4 hover:bg-green-700 transition duration-200"
                  onClick={checkPaymentStatus}
                >
                  Check Payment Status
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-lg mb-6">Loading event details...</p>
        )}
      </div>
    </div>
  );
};
