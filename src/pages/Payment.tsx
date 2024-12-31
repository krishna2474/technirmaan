import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";
import Navbar from "../components/NavBar";

interface Payment {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const PaymentPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [eventPrice, setEventPrice] = useState("");
  const [eventName, setEventName] = useState("");

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const event_id = queryParams.get("event_id");
  const email = queryParams.get("email");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/api/v1/event/${event_id}`
        );
        setEventPrice(response.data.price);
        setEventName(response.data.name);
      } catch (error) {
        console.error("Error fetching event details:", error);
        setPaymentStatus("Error fetching event details. Please try again.");
      } finally {
        setLoadingData(false);
      }
    };

    if (event_id) fetchEventDetails();
  }, [event_id]);

  const handlePaymentSuccess = async (payment: Payment) => {
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/api/v1/payment/verify`,
        {
          razorpay_payment_id: payment.razorpay_payment_id,
          razorpay_order_id: payment.razorpay_order_id,
          razorpay_signature: payment.razorpay_signature,
          email,
          event_id,
        }
      );

      if (data.success) {
        setPaymentStatus("Payment captured successfully!");
        const newRegistration = await axios.post(
          `${BACKEND_URL}/api/v1/register/new?email=${email}&event_id=${event_id}`
        );
        if (newRegistration.data.error) {
          setPaymentStatus("Error registering for event. Please try again.");
          return;
        } else navigate(`/generate-qr?email=${email}&event_id=${event_id}`);
      } else {
        setPaymentStatus("Payment verification failed. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      setPaymentStatus("Error verifying payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentFailure = (error: any) => {
    console.error("Payment failed:", error);
    setPaymentStatus("Payment failed. Please try again.");
  };

  const initiatePayment = async () => {
    if (!eventPrice || !email || !event_id) {
      setPaymentStatus("Error: Missing required payment details.");
      return;
    }

    const numericPrice = Number(eventPrice);
    if (isNaN(numericPrice)) {
      setPaymentStatus("Error: Invalid event price format.");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/api/v1/payment/initiate`,
        {
          event_id,
          email,
          amount: numericPrice,
        }
      );

      const { orderId } = data;
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      const RAZORPAY_API_KEY = process.env.RAZORPAY_API_KEY;
      script.onload = () => {
        const options = {
          key: RAZORPAY_API_KEY,
          amount: numericPrice * 100,
          currency: "INR",
          name: "TechNirmaan",
          description: "Payment for Event",
          order_id: orderId,
          handler: handlePaymentSuccess,
          theme: { color: "#b74ab2" },
          prefill: { email },
          modal: {
            ondismiss: () => console.log("Payment modal dismissed"),
          },
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.on("payment.failed", handlePaymentFailure);
        rzp1.open();
      };

      document.body.appendChild(script);
    } catch (error) {
      console.error("Error initiating payment:", error);
      setPaymentStatus("Error initiating payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center min-h-screen text-white pt-24 px-4 sm:px-8 md:px-16">
        <h2 className="text-3xl font-bold mb-6 text-center">
          {loadingData ? (
            <div className="animate-pulse bg-gray-600 rounded w-3/4 h-6"></div>
          ) : (
            `Complete Your Payment for Registering in ${eventName}`
          )}
        </h2>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md text-center">
          {loadingData ? (
            <div className="animate-pulse bg-gray-600 rounded w-full h-6 mb-4"></div>
          ) : (
            <p className="text-xl mb-4">Event Price: ₹{eventPrice}</p>
          )}

          <button
            className="bg-purple-500 hover:bg-purple-400 text-white py-2 px-6 rounded-lg w-full transition duration-300"
            onClick={initiatePayment}
            disabled={loading || loadingData}
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </div>

        {paymentStatus && (
          <p className="mt-6 text-lg text-center">{paymentStatus}</p>
        )}
      </div>
    </>
  );
};
