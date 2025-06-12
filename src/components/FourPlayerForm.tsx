import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { BACKEND_URL } from "../config";

export const FourPlayerForm = () => {
  useEffect(() => {
    alert(
      "Ensure all details are valid as they will be printed on the Certificate"
    );
  }, []);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const [loading, setLoading] = useState(false);
  // const [registration, setRegistration] = useState(true);
  const numPlayers = 4;
  const { eventId } = useParams();
  const navigate = useNavigate();

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    // Format player data into an array of objects
    const playersData = [];
    for (let i = 1; i <= numPlayers; i++) {
      playersData.push({
        name: data[`name${i}`],
        email: data[`email${i}`],
        phone: data[`phone${i}`],
        cls: data[`class${i}`],
        department:
          data[`department${i}`] === "Other"
            ? data[`departmentCustom${i}`]
            : data[`department${i}`],
        college:
          data[`college${i}`] === "Other"
            ? data[`collegeCustom${i}`]
            : data[`college${i}`],
      });
    }

    // console.log(playersData);

    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/v1/verify/send-otp?type=4`,
        {
          players: playersData,
          event: eventId,
        }
      );
      console.log(res.data);
      // reset();
      navigate(
        `/verify?email=${encodeURIComponent(
          data.email1
        )}&event=${encodeURIComponent(eventId + "")}`
      );
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  });

  return (
    <div className="relative flex flex-col items-center w-full">
      <div className="w-full max-w-md rounded-lg">
        <form
          className="space-y-2 md:space-y-4 font-semibold mx-10"
          onSubmit={onSubmit}
        >
          {/* Dynamic Name, Email, Phone, Class, Department, and College Inputs for Each Player */}
          {[...Array(numPlayers)].map((_, index) => {
            const playerIndex = index + 1;
            return (
              <div key={playerIndex} className="space-y-2 md:space-y-4">
                {/* Player Name Input */}
                <input
                  autoComplete="off"
                  {...register(`name${playerIndex}`, {
                    required: `Full name for Player ${playerIndex} is required.`,
                    minLength: {
                      value: 3,
                      message: `Full name for Player ${playerIndex} must be at least 3 characters.`,
                    },
                  })}
                  type="text"
                  name={`name${playerIndex}`}
                  id={`name${playerIndex}`}
                  className={`text-white active:border-purple-500 w-full bg-transparent rounded-md border border-stroke outline-none transition b ${
                    errors[`name${playerIndex}`]
                      ? "focus:border-red-600 focus:ring-red-600"
                      : ""
                  } text-sm rounded-lg block w-full p-2.5 focus:ring-customPurple focus:border-purple-500`}
                  placeholder={`Player ${playerIndex} Full Name`}
                />
                {errors[`name${playerIndex}`] && (
                  <p className="text-red-500 text-sm truncate">
                    {errors[`name${playerIndex}`]?.message + ""}
                  </p>
                )}

                {/* Player Email Input */}
                <input
                  autoComplete="off"
                  {...register(`email${playerIndex}`, {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: "Please enter a valid email address",
                    },
                  })}
                  type="email"
                  name={`email${playerIndex}`}
                  id={`email${playerIndex}`}
                  className={`text-white active:border-purple-500 w-full bg-transparent rounded-md border border-stroke py-[10px] outline-none transition b ${
                    errors[`email${playerIndex}`]
                      ? "focus:border-red-600 focus:ring-red-600"
                      : ""
                  } text-sm rounded-lg block w-full p-2.5 focus:ring-customPurple focus:border-purple-500`}
                  placeholder="Email"
                />
                {errors[`email${playerIndex}`] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[`email${playerIndex}`]?.message + ""}
                  </p>
                )}

                {/* Player Phone Input */}

                <input
                  autoComplete="off"
                  {...register(`phone${playerIndex}`, {
                    required: "Phone number is required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Please enter a valid 10-digit phone number",
                    },
                  })}
                  type="number"
                  name={`phone${playerIndex}`}
                  id={`phone${playerIndex}`}
                  className={`text-white active:border-purple-500 w-full bg-transparent rounded-md border border-stroke py-[10px] outline-none transition b ${
                    errors[`phone${playerIndex}`]
                      ? "focus:border-red-600 focus:ring-red-600"
                      : ""
                  } text-sm rounded-lg block w-full p-2.5 focus:ring-customPurple focus:border-purple-500`}
                  placeholder="Contact"
                />

                {errors[`phone${playerIndex}`] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[`phone${playerIndex}`]?.message + ""}
                  </p>
                )}

                {/* Player Class Input */}
                <input
                  autoComplete="off"
                  {...register(`class${playerIndex}`, {
                    required: "Class is required",
                  })}
                  type="text"
                  name={`class${playerIndex}`}
                  id={`class${playerIndex}`}
                  className={`text-white active:border-purple-500 w-full bg-transparent rounded-md border border-stroke py-[10px] outline-none transition b ${
                    errors[`class${playerIndex}`]
                      ? "focus:border-red-600 focus:ring-red-600"
                      : ""
                  } text-sm rounded-lg block w-full p-2.5 focus:ring-customPurple focus:border-purple-500`}
                  placeholder="Class"
                />
                {errors[`class${playerIndex}`] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[`class${playerIndex}`]?.message + ""}
                  </p>
                )}

                <select
                  {...register(`department${playerIndex}`, {
                    required: "Department is required",
                  })}
                  name={`department${playerIndex}`}
                  id={`department${playerIndex}`}
                  className={`text-white active:border-purple-500 w-full bg-transparent rounded-md border border-stroke py-[10px] outline-none transition b ${
                    errors[`department${playerIndex}`]
                      ? "focus:border-red-600 focus:ring-red-600"
                      : ""
                  } text-sm rounded-lg block w-full p-1 focus:ring-customPurple focus:border-purple-500`}
                >
                  <option className="text-black" value="">
                    Select Department
                  </option>
                  <option className="text-black" value="IT">
                    IT
                  </option>
                  <option className="text-black" value="Other">
                    Other
                  </option>
                </select>
                {errors[`department${playerIndex}`] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[`department${playerIndex}`]?.message + ""}
                  </p>
                )}
                {/* Custom Department */}
                {watch(`department${playerIndex}`) === "Other" && (
                  <input
                    autoComplete="off"
                    {...register(`departmentCustom${playerIndex}`)}
                    type="text"
                    name={`departmentCustom${playerIndex}`}
                    id={`departmentCustom${playerIndex}`}
                    className="text-white bg-transparent  border border-stroke py-[10px] outline-none transition b text-sm rounded-lg block w-full p-2.5 focus:ring-customPurple focus:border-purple-500"
                    placeholder="Enter Department"
                  />
                )}

                {/* Player College Input */}
                <select
                  {...register(`college${playerIndex}`, {
                    required: "College is required",
                  })}
                  name={`college${playerIndex}`}
                  id={`college${playerIndex}`}
                  className={`text-white active:border-purple-500 w-full bg-transparent rounded-md border border-stroke py-[10px] outline-none transition b ${
                    errors[`college${playerIndex}`]
                      ? "focus:border-red-600 focus:ring-red-600"
                      : ""
                  } text-sm rounded-lg block w-full p-1 focus:ring-customPurple focus:border-purple-500`}
                >
                  <option className="text-black" value="">
                    Select College
                  </option>
                  <option className="text-black" value="CHM">
                    Smt. CHM College
                  </option>
                  <option className="text-black" value="Other">
                    Other
                  </option>
                </select>
                {errors[`college${playerIndex}`] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[`college${playerIndex}`]?.message + ""}
                  </p>
                )}
                {/* Custom College */}
                {watch(`college${playerIndex}`) === "Other" && (
                  <input
                    autoComplete="off"
                    {...register(`collegeCustom${playerIndex}`)}
                    type="text"
                    name={`collegeCustom${playerIndex}`}
                    id={`collegeCustom${playerIndex}`}
                    className="text-white bg-transparent border border-stroke py-[10px] outline-none transition b text-sm rounded-lg block w-full p-2.5 focus:ring-customPurple focus:border-purple-500"
                    placeholder="Enter College"
                  />
                )}
              </div>
            );
          })}

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="text-white bg-purple-500 hover:bg-white hover:text-black focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 transition-all duration-300 ease-in-out"
              disabled={loading}
            >
              {loading ? (
                <div className="spinner-border animate-spin border-4 border-t-4 border-white rounded-full w-6 h-6 mr-2"></div>
              ) : (
                "Register"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
