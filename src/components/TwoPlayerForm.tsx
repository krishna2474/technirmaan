import axios from "axios";
import { useForm } from "react-hook-form";
import { BACKEND_URL } from "../config";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom

export const TwoPlayerForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({ mode: "onChange" });

  const [loading, setLoading] = useState(false); // State to manage the loader
  const [numPlayers, setNumPlayers] = useState(2); // State to handle number of players (default is 2)
  const { eventId } = useParams(); // Extract eventId from the URL path
  const navigate = useNavigate(); // Initialize the navigate function

  const onSubmit = handleSubmit(async (data) => {
    if (!isValid) return; // If the form is not valid, do not proceed

    setLoading(true); // Start loading state

    try {
      const res = await axios.post(`${BACKEND_URL}/api/v1/verify/send-otp`, {
        ...data, // Spread form data
        event: eventId, // Add eventId to the data object
      });

      console.log(res.data);

      // Reset the form or handle success here
      reset(); // Reset the form fields if necessary

      // After successful OTP sending, redirect to the /verify route
      navigate(`/verify?email=${encodeURIComponent(data.email)}`); // Redirect to the /verify route with email state
    } catch (error) {
      console.error("Error:", error);
      // Handle error here (optional)
    } finally {
      setLoading(false); // Stop loading state
    }
  });

  return (
    <>
      <div className="relative flex flex-col items-center w-full">
        <div className="w-full max-w-md rounded-lg">
          <form
            className="space-y-2 md:space-y-4 font-semibold mx-10"
            onSubmit={onSubmit}
          >
            {/* Name input for Player 1 */}
            <div>
              <input
                autoComplete="off"
                {...register("name1", {
                  required: "Full name for Player 1 is required.",
                  minLength: {
                    value: 3,
                    message:
                      "Full name for Player 1 must be at least 3 characters.",
                  },
                })}
                type="text"
                name="name1"
                id="name1"
                className={`text-white active:border-purple-500 w-full bg-transparent rounded-md border border-stroke outline-none transition b ${
                  errors["name1"]
                    ? "focus:border-red-600 focus:ring-red-600"
                    : ""
                } text-sm rounded-lg block w-full p-2.5 focus:ring-customPurple focus:border-purple-500 `}
                placeholder="Player 1 Full Name"
              />
              {errors["name1"] && (
                <p className="text-red-500 text-sm truncate">
                  {errors["name1"]?.message + ""}
                </p>
              )}
            </div>

            {/* Name input for Player 2 */}
            {numPlayers >= 2 && (
              <div>
                <input
                  autoComplete="off"
                  {...register("name2", {
                    required: "Full name for Player 2 is required.",
                    minLength: {
                      value: 3,
                      message:
                        "Full name for Player 2 must be at least 3 characters.",
                    },
                  })}
                  type="text"
                  name="name2"
                  id="name2"
                  className={`text-white active:border-purple-500 w-full bg-transparent rounded-md border border-stroke outline-none transition b ${
                    errors["name2"]
                      ? "focus:border-red-600 focus:ring-red-600"
                      : ""
                  } text-sm rounded-lg block w-full p-2.5 focus:ring-customPurple focus:border-purple-500 `}
                  placeholder="Player 2 Full Name"
                />
                {errors["name2"] && (
                  <p className="text-red-500 text-sm truncate">
                    {errors["name2"]?.message + ""}
                  </p>
                )}
              </div>
            )}

            {/* Name input for Player 3 */}
            {numPlayers >= 3 && (
              <div>
                <input
                  autoComplete="off"
                  {...register("name3", {
                    required: "Full name for Player 3 is required.",
                    minLength: {
                      value: 3,
                      message:
                        "Full name for Player 3 must be at least 3 characters.",
                    },
                  })}
                  type="text"
                  name="name3"
                  id="name3"
                  className={`text-white active:border-purple-500 w-full bg-transparent rounded-md border border-stroke outline-none transition b ${
                    errors["name3"]
                      ? "focus:border-red-600 focus:ring-red-600"
                      : ""
                  } text-sm rounded-lg block w-full p-2.5 focus:ring-customPurple focus:border-purple-500 `}
                  placeholder="Player 3 Full Name"
                />
                {errors["name3"] && (
                  <p className="text-red-500 text-sm truncate">
                    {errors["name3"]?.message + ""}
                  </p>
                )}
              </div>
            )}

            {/* Name input for Player 4 */}
            {numPlayers >= 4 && (
              <div>
                <input
                  autoComplete="off"
                  {...register("name4", {
                    required: "Full name for Player 4 is required.",
                    minLength: {
                      value: 3,
                      message:
                        "Full name for Player 4 must be at least 3 characters.",
                    },
                  })}
                  type="text"
                  name="name4"
                  id="name4"
                  className={`text-white active:border-purple-500 w-full bg-transparent rounded-md border border-stroke outline-none transition b ${
                    errors["name4"]
                      ? "focus:border-red-600 focus:ring-red-600"
                      : ""
                  } text-sm rounded-lg block w-full p-2.5 focus:ring-customPurple focus:border-purple-500 `}
                  placeholder="Player 4 Full Name"
                />
                {errors["name4"] && (
                  <p className="text-red-500 text-sm truncate">
                    {errors["name4"]?.message + ""}
                  </p>
                )}
              </div>
            )}

            {/* Player Count Selector */}
            <div>
              <label className="text-white text-sm">
                Select Number of Players (2-4)
              </label>
              <select
                value={numPlayers}
                onChange={(e) => setNumPlayers(Number(e.target.value))}
                className="w-full bg-transparent text-sm text-white border rounded-md border-stroke outline-none p-2.5 focus:ring-customPurple focus:border-purple-500"
              >
                <option value={2}>2 Players</option>
                <option value={3}>3 Players</option>
                <option value={4}>4 Players</option>
              </select>
            </div>

            {/* Email input */}
            <div>
              <input
                autoComplete="off"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "Please enter a valid email address",
                  },
                })}
                type="text"
                name="email"
                id="email"
                className={`text-white active:border-purple-500 w-full bg-transparent rounded-md border border-stroke py-[10px] outline-none transition b ${
                  errors.email ? "focus:border-red-600 focus:ring-red-600" : ""
                } text-sm rounded-lg block w-full p-2.5 focus:ring-customPurple focus:border-purple-500`}
                placeholder="Email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email?.message + ""}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="text-white bg-purple-500 hover:bg-white hover:text-black focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 transition-all duration-300 ease-in-out"
                disabled={loading} // Disable the button when loading
              >
                {loading ? (
                  <div className="spinner-border animate-spin border-4 border-t-4 border-white rounded-full w-6 h-6 mr-2"></div> // Loader spinner
                ) : (
                  "Register"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
