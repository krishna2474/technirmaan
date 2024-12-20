import { useParams } from "react-router-dom";
import { OnePlayerForm } from "../components/OnePlayerForm";
import { useEffect, useState } from "react";
import Navbar from "../components/NavBar";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { Skeleton } from "@mui/material";

export const Registration = () => {
  const [loading, setLoading] = useState(true);
  const [eventName, setEventName] = useState("");
  const { eventId } = useParams();

  useEffect(() => {
    const fetchName = async () => {
      const resp = await axios.get(
        `${BACKEND_URL}/api/v1/auth/event/${eventId}`
      );
      setEventName(resp.data.name);
      setLoading(false);
    };
    fetchName();
  }, []);

  return (
    <>
      <Navbar />
      <h1 className="text-center font-extrabold text-xl underline mb-4 text-white">
        {loading ? (
          <div className="flex justify-center">
            <Skeleton animation={"wave"} />
          </div>
        ) : (
          `Registering for ${eventName}`
        )}
      </h1>{" "}
      {/* Add margin-top if needed */}
      <div className="flex justify-center h-screen  w-full">
        <OnePlayerForm />
      </div>
    </>
  );
};
