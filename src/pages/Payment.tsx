import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";

export const UpiPaymentPage = () => {
  const [upiId, setUpiId] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const initiatePayment = async () => {
    if (!upiId) {
      alert("Please enter a valid UPI ID.");
      return;
    }

    setLoading(true);
    try {
      // Send UPI ID to backend to initiate payment request
      const response = await axios.post(
        `${BACKEND_URL}/api/payment/upi/initiate`,
        {
          upiId,
        }
      );

      const { paymentLink } = response.data;

      // Redirect the user to the UPI payment link
      window.location.href = paymentLink;
    } catch (error) {
      console.error("Failed to initiate payment", error);
      alert("Failed to initiate payment. Please try again.");
      setLoading(false);
    }
  };

  const checkPaymentStatus = async () => {
    if (!transactionId) {
      alert("Please enter a valid transaction ID.");
      return;
    }

    try {
      // Send transaction ID to backend to check payment status
      const response = await axios.get(`${BACKEND_URL}/api/payment/status`, {
        params: { transactionId },
      });

      const { status } = response.data;
      setPaymentStatus(status);

      if (status === "SUCCESS") {
        alert("Payment successful!");
        navigate("/next-step"); // Redirect to the next page
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
        <div className="mb-4">
          <label htmlFor="upiId" className="block text-lg font-semibold mb-2">
            Enter UPI ID
          </label>
          <input
            type="text"
            id="upiId"
            className="w-full px-4 py-2 border rounded-lg"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            placeholder="yourname@upi"
          />
        </div>

        <button
          className="w-full bg-indigo-600 text-white py-2 rounded-lg text-xl mb-4 hover:bg-indigo-700 transition duration-200"
          onClick={initiatePayment}
          disabled={loading}
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>

        <div className="mb-4">
          <label
            htmlFor="transactionId"
            className="block text-lg font-semibold mb-2"
          >
            Enter Transaction ID
          </label>
          <input
            type="text"
            id="transactionId"
            className="w-full px-4 py-2 border rounded-lg"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            placeholder="Transaction ID"
          />
        </div>

        <button
          className="w-full bg-green-600 text-white py-2 rounded-lg text-xl mb-4 hover:bg-green-700 transition duration-200"
          onClick={checkPaymentStatus}
        >
          Check Payment Status
        </button>

        {paymentStatus && (
          <p className="text-center mt-4 text-lg">{paymentStatus}</p>
        )}
      </div>
    </div>
  );
};
