import { useParams } from "react-router-dom";
import { OnePlayerForm } from "../components/OnePlayerForm";
import { useEffect, useState } from "react";
import Navbar from "../components/NavBar";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { TwoPlayerForm } from "../components/TwoPlayerForm";
import { TwoToFourPlayerForm } from "../components/TwoToFourPlayerForm";
import { FourPlayerForm } from "../components/FourPlayerForm";

export const Registration = () => {
  const [loading, setLoading] = useState(true);
  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState("");
  const { eventId } = useParams();
  const formsMap: Record<string, JSX.Element | null> = {
    "1": <OnePlayerForm />,
    "2": <TwoPlayerForm />,
    "2 to 4": <TwoToFourPlayerForm />,
    "4": <FourPlayerForm />,
  };
  useEffect(() => {
    const fetchName = async () => {
      const resp = await axios.get(`${BACKEND_URL}/api/v1/event/${eventId}`);
      setEventName(resp.data.name);
      setEventType(resp.data.type);
      setLoading(false);
    };
    fetchName();
  }, []);

  return (
    <>
      <Navbar />
      <h1 className="text-center font-extrabold text-xl underline mb-4 text-white">
        {loading ? (
          <div className="flex justify-center">Please Wait...</div>
        ) : (
          `Registering for ${eventName}`
        )}
      </h1>{" "}
      {/* Add margin-top if needed */}
      <div className="flex justify-center h-screen  w-full">
        {formsMap[eventType] || null}
      </div>
    </>
  );
};
