import { useParams } from "react-router-dom";
import { Form } from "../components/Form";

export const Registration = () => {
  const eventId = useParams();
  return (
    <div>
      <h1>Registering for</h1>
      <div className="flex justify-center items-center h-screen">
        <Form />
      </div>
    </div>
  );
};
