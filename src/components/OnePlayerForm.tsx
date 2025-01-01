import axios from "axios";
import { useForm } from "react-hook-form";
import { BACKEND_URL } from "../config";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export const OnePlayerForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
  } = useForm({ mode: "onChange" });

  const [loading, setLoading] = useState(false);
  const [departmentInputVisible, setDepartmentInputVisible] = useState(false);
  const [collegeInputVisible, setCollegeInputVisible] = useState(false);

  const { eventId } = useParams();
  const navigate = useNavigate();

  // Handle department dropdown change
  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDepartmentInputVisible(e.target.value === "Other");
    setValue("department", e.target.value); // Update the form value for department
  };

  // Handle college dropdown change
  const handleCollegeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCollegeInputVisible(e.target.value === "Other");
    setValue("college", e.target.value); // Update the form value for college
  };

  const onSubmit = handleSubmit(async (data) => {
    if (!isValid) return;

    setLoading(true);

    try {
      const playersData = [];
      playersData.push({
        name: data.name,
        email: data.email,
        phone: data.phone,
        cls: data.class,
        department:
          data.department === "Other" ? data.departmentCustom : data.department,
        college: data.college === "Other" ? data.collegeCustom : data.college,
        event: eventId,
      });

      const res = await axios.post(
        `${BACKEND_URL}/api/v1/verify/send-otp?type=1`,
        {
          players: playersData,
          event: eventId,
        }
      );

      console.log(res.data);

      if (res.status === 200) {
        navigate(
          `/verify?email=${encodeURIComponent(
            data.email
          )}&event=${encodeURIComponent(eventId + "")}`
        );
      } else if (res.status === 400) {
        alert("User is already registered for the event");
      } else {
        alert("Error in registering. Please try again later.");
      }
    } catch (error: any) {
      alert(error.response.data.error);
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
                errors["name"] ? "focus:border-red-600 focus:ring-red-600" : ""
              } text-sm rounded-lg block w-full p-2.5 focus:ring-customPurple focus:border-purple-500`}
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
              type="number"
              name="phone"
              id="phone"
              placeholder="Contact"
              className={`text-white active:border-purple-500 w-full bg-transparent rounded-md border border-stroke py-[10px] outline-none transition b ${
                errors["phone"] ? "focus:border-red-600 focus:ring-red-600" : ""
              } text-sm rounded-lg block w-full p-2.5 focus:ring-customPurple focus:border-purple-500`}
            />
            {errors["phone"] && (
              <p className="text-red-500 text-sm">
                {errors["phone"]?.message + ""}
              </p>
            )}
          </div>
          {/* Class Input */}
          <div>
            <input
              autoComplete="off"
              {...register("class", { required: "Class is required" })}
              type="text"
              name="class"
              id="class"
              className={`text-white active:border-purple-500 w-full bg-transparent rounded-md border border-stroke py-[10px] outline-none transition b ${
                errors.class ? "focus:border-red-600 focus:ring-red-600" : ""
              } text-sm rounded-lg block w-full p-2.5 focus:ring-customPurple focus:border-purple-500`}
              placeholder="Class"
            />
            {errors.class && (
              <p className="text-red-500 text-sm mt-1">
                {errors.class?.message + ""}
              </p>
            )}
          </div>
          {/* Department dropdown */}
          <div>
            <select
              {...register("department", {
                required: "Department is required.",
              })}
              onChange={handleDepartmentChange}
              className={`text-white active:border-purple-500 w-full bg-transparent rounded-md border border-stroke py-[10px] outline-none transition b ${
                errors["department"]
                  ? "focus:border-red-600 focus:ring-red-600"
                  : ""
              }`}
            >
              <option value="">Select Department</option>
              <option value="IT">IT</option>
              <option value="Other">Other</option>
            </select>
            {departmentInputVisible && (
              <input
                {...register("departmentCustom", {
                  required: "Please specify your department",
                })}
                type="text"
                placeholder="Enter Department"
                className={`mt-4 text-white active:border-purple-500 w-full bg-transparent rounded-md border border-stroke py-[10px] outline-none transition b ${
                  errors.departmentCustom
                    ? "focus:border-red-600 focus:ring-red-600"
                    : ""
                } text-sm rounded-lg block w-full p-2.5 focus:ring-customPurple focus:border-purple-500`}
              />
            )}
            {errors["department"] && (
              <p className="text-red-500 text-sm">
                {errors["department"]?.message + ""}
              </p>
            )}
          </div>

          {/* College dropdown */}
          <div>
            <select
              {...register("college", { required: "College is required." })}
              onChange={handleCollegeChange}
              className={`text-white active:border-purple-500 w-full bg-transparent rounded-md border border-stroke py-[10px] outline-none transition b ${
                errors["college"]
                  ? "focus:border-red-600 focus:ring-red-600"
                  : ""
              }`}
            >
              <option value="">Select College</option>
              <option value="CHM">Smt. CHM College</option>
              <option value="Other">Other</option>
            </select>
            {collegeInputVisible && (
              <input
                {...register("collegeCustom", {
                  required: "Please specify your college",
                })}
                type="text"
                placeholder="Enter College"
                className={`mt-4 text-white active:border-purple-500 w-full bg-transparent rounded-md border border-stroke py-[10px] outline-none transition b ${
                  errors.collegeCustom
                    ? "focus:border-red-600 focus:ring-red-600"
                    : ""
                } text-sm rounded-lg block w-full p-2.5 focus:ring-customPurple focus:border-purple-500`}
              />
            )}
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
