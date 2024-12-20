import axios from "axios";
import { useForm } from "react-hook-form";
import { BACKEND_URL } from "../config";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom

export const Form = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({ mode: "onChange" });

  const [loading, setLoading] = useState(false); // State to manage the loader
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
            {/* Name input */}
            <div>
              <input
                autoComplete="off"
                {...register("name", {
                  required: "Full name is required.",
                  minLength: {
                    value: 3,
                    message: "Full name must be at least 3 characters.",
                  },
                })}
                type="text"
                name="name"
                id="name"
                className={`text-white active:border-purple-500 w-full bg-transparent rounded-md border border-stroke outline-none transition b ${
                  errors["name"]
                    ? "focus:border-red-600 focus:ring-red-600"
                    : ""
                } text-sm rounded-lg block w-full p-2.5 focus:ring-customPurple focus:border-purple-500 `}
                style={{ width: "100%" }}
                placeholder="Full Name"
              />
              {errors["name"] && (
                <p className="text-red-500 text-sm truncate">
                  {errors["name"]?.message + ""}
                </p>
              )}
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

            {/* Phone input */}
            <div>
              <input
                autoComplete="off"
                {...register("phone", {
                  required: "Phone Number is required.",
                  minLength: {
                    value: 10,
                    message: "Phone number must be at least 10 digits.",
                  },
                })}
                name="phone"
                id="phone"
                placeholder="+91 1234567890"
                className={`text-white active:border-purple-500 w-full bg-transparent rounded-md border border-stroke py-[10px] outline-none transition b ${
                  errors["phone"]
                    ? "focus:border-red-600 focus:ring-red-600"
                    : ""
                } text-sm rounded-lg block w-full p-2.5 focus:ring-customPurple focus:border-purple-500`}
              />
              {errors["phone"] && (
                <p className="text-red-500 text-sm">
                  {errors["phone"]?.message + ""}
                </p>
              )}
            </div>

            {/* Class input */}
            <div>
              <input
                autoComplete="off"
                {...register("cls", {
                  required: "Class is required.",
                  minLength: {
                    value: 3,
                    message: "Class must be at least 3 characters.",
                  },
                })}
                type="text"
                name="cls"
                id="cls"
                className={`text-white active:border-purple-500 w-full bg-transparent rounded-md border border-stroke py-[10px] outline-none transition b ${
                  errors["cls"] ? "focus:border-red-600 focus:ring-red-600" : ""
                } text-sm rounded-lg block w-full p-2.5 focus:ring-customPurple focus:border-purple-500`}
                placeholder="Class"
              />
              {errors["cls"] && (
                <p className="text-red-500 text-sm">
                  {errors["cls"]?.message + ""}
                </p>
              )}
            </div>

            {/* Department input */}
            <div>
              <input
                autoComplete="off"
                {...register("department", {
                  required: "Department is required.",
                  minLength: {
                    value: 2,
                    message: "Department must be at least 2 characters.",
                  },
                })}
                type="text"
                name="department"
                id="department"
                className={`text-white active:border-purple-500 w-full bg-transparent rounded-md border border-stroke py-[10px] outline-none transition b ${
                  errors["department"]
                    ? "focus:border-red-600 focus:ring-red-600"
                    : ""
                } text-sm rounded-lg block w-full p-2.5 focus:ring-customPurple focus:border-purple-500`}
                placeholder="Department"
              />
              {errors["department"] && (
                <p className="text-red-500 text-sm">
                  {errors["department"]?.message + ""}
                </p>
              )}
            </div>

            {/* College input */}
            <div>
              <input
                autoComplete="off"
                {...register("college", {
                  required: "College is required.",
                  minLength: {
                    value: 3,
                    message: "College must be at least 3 characters.",
                  },
                })}
                type="text"
                name="college"
                id="college"
                className={`text-white active:border-purple-500 w-full bg-transparent rounded-md border border-stroke py-[10px] outline-none transition b ${
                  errors["college"]
                    ? "focus:border-red-600 focus:ring-red-600"
                    : ""
                } text-sm rounded-lg block w-full p-2.5 focus:ring-customPurple focus:border-purple-500`}
                placeholder="College"
              />
              {errors["college"] && (
                <p className="text-red-500 text-sm">
                  {errors["college"]?.message + ""}
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
