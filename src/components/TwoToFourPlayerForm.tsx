import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { BACKEND_URL } from "../config";

export const TwoToFourPlayerForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({ mode: "onChange" });

  const [loading, setLoading] = useState(false);
  const [numPlayers, setNumPlayers] = useState(2);
  const [isSameForLastPlayers, setIsSameForLastPlayers] = useState(false);
  const { eventId } = useParams();
  const navigate = useNavigate();

  const onSubmit = handleSubmit(async (data) => {
    // Format player data into an array of objects
    const playersData = [];
    for (let i = 1; i <= numPlayers; i++) {
      playersData.push({
        name: data[`name${i}`],
        email: data[`email${i}`],
        phone: data[`phone${i}`],
        cls: data[`class${i}`],
        department: data[`department${i}`],
        college: data[`college${i}`],
      });
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/v1/verify/send-otp?type=2-4`,
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
    } catch (error: any) {
      alert(error.response.data.error);
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  });

  const handleCheckboxChange = () => {
    setIsSameForLastPlayers((prev) => !prev);
  };

  // Watch the first player's class, department, and college fields
  const watchedClass1 = watch("class1");
  const watchedPhone1 = watch("phone1");
  const watchedDepartment1 = watch("department1");
  const watchedCollege1 = watch("college1");

  // Automatically update other players' fields if checkbox is checked
  useEffect(() => {
    // Watch the first player's class, department, and college fields
    setValue("phone2", watchedPhone1);
    if (numPlayers >= 3) {
      setValue("phone3", watchedPhone1);
    }
    if (numPlayers >= 4) {
      setValue("phone4", watchedPhone1);
    }

    if (isSameForLastPlayers) {
      // Sync the class, department, and college for players 2 to 4 based on the selected number of players
      if (numPlayers >= 2) {
        setValue("class2", watchedClass1);
        setValue("department2", watchedDepartment1);
        setValue("college2", watchedCollege1);
      }
      if (numPlayers >= 3) {
        setValue("class3", watchedClass1);
        setValue("department3", watchedDepartment1);
        setValue("college3", watchedCollege1);
      }
      if (numPlayers === 4) {
        setValue("class4", watchedClass1);
        setValue("department4", watchedDepartment1);
        setValue("college4", watchedCollege1);
      }
    }
  }, [
    watchedPhone1,
    watchedClass1,
    watchedDepartment1,
    watchedCollege1,
    isSameForLastPlayers,
    numPlayers, // Depend on numPlayers to ensure this logic is reevaluated
    setValue,
  ]);

  return (
    <div className="relative flex flex-col items-center w-full">
      <div className="w-full max-w-md rounded-lg">
        <form
          className="space-y-2 md:space-y-4 font-semibold mx-10"
          onSubmit={onSubmit}
        >
          {/* Number of Players Dropdown */}
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
                {playerIndex === 1 && (
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
                )}
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

                {/* Player Department Input */}
                <input
                  autoComplete="off"
                  {...register(`department${playerIndex}`, {
                    required: "Department is required",
                  })}
                  type="text"
                  name={`department${playerIndex}`}
                  id={`department${playerIndex}`}
                  className={`text-white active:border-purple-500 w-full bg-transparent rounded-md border border-stroke py-[10px] outline-none transition b ${
                    errors[`department${playerIndex}`]
                      ? "focus:border-red-600 focus:ring-red-600"
                      : ""
                  } text-sm rounded-lg block w-full p-2.5 focus:ring-customPurple focus:border-purple-500`}
                  placeholder="Department"
                />
                {errors[`department${playerIndex}`] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[`department${playerIndex}`]?.message + ""}
                  </p>
                )}

                {/* Player College Input */}
                <input
                  autoComplete="off"
                  {...register(`college${playerIndex}`, {
                    required: "College is required",
                  })}
                  type="text"
                  name={`college${playerIndex}`}
                  id={`college${playerIndex}`}
                  className={`text-white active:border-purple-500 w-full bg-transparent rounded-md border border-stroke py-[10px] outline-none transition b ${
                    errors[`college${playerIndex}`]
                      ? "focus:border-red-600 focus:ring-red-600"
                      : ""
                  } text-sm rounded-lg block w-full p-2.5 focus:ring-customPurple focus:border-purple-500`}
                  placeholder="College"
                />
                {errors[`college${playerIndex}`] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[`college${playerIndex}`]?.message + ""}
                  </p>
                )}
              </div>
            );
          })}

          {/* Checkbox for automatic filling */}
          <div className="flex items-center justify-start">
            <input
              type="checkbox"
              id="sameForLastPlayers"
              checked={isSameForLastPlayers}
              onChange={handleCheckboxChange}
              className="text-white focus:ring-purple-500"
            />
            <label
              htmlFor="sameForLastPlayers"
              className="text-white text-sm ml-2"
            >
              All players have the same class, department, and college
            </label>
          </div>

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
