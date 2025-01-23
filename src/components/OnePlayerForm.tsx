import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

export const OnePlayerForm = () => {
  // State to control registration availability
  const [registrationOpen] = useState(false);

  useEffect(() => {
    if (registrationOpen) {
      alert(
        "Ensure all details are valid as they will be printed on the Certificate"
      );
    }
  }, [registrationOpen]);

  const {
    register,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  // const [departmentInputVisible, setDepartmentInputVisible] = useState(false);
  // const [collegeInputVisible, setCollegeInputVisible] = useState(false);

  // // Handle department dropdown change
  // const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   setDepartmentInputVisible(e.target.value === "Other");
  //   setValue("department", e.target.value);
  // };

  // // Handle college dropdown change
  // const handleCollegeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   setCollegeInputVisible(e.target.value === "Other");
  //   setValue("college", e.target.value);
  // };

  // On form submission
  // const onSubmit = handleSubmit((data) => {
  //   if (!isValid) {
  //     alert("Please fill all the fields correctly.");
  //     return;
  //   }
  //   alert("Form submitted (simulated for registration).");
  // });

  return (
    <div className="relative flex flex-col items-center w-full">
      <div className="w-full max-w-md rounded-lg">
        {/* Registration Closed Message */}
        {!registrationOpen ? (
          <div className="text-center text-red-600 font-bold text-lg">
            Registrations are now closed!
          </div>
        ) : (
          <form className="space-y-2 md:space-y-4 font-semibold mx-10">
            {/* Name Input */}
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
                className={`text-white active:border-purple-500 w-full bg-transparent rounded-md border border-stroke outline-none transition b ${
                  errors["name"]
                    ? "focus:border-red-600 focus:ring-red-600"
                    : ""
                } text-sm rounded-lg block w-full p-2.5 focus:ring-customPurple focus:border-purple-500`}
                placeholder="Full Name"
              />
              {errors["name"] && (
                <p className="text-red-500 text-sm truncate">
                  {errors["name"]?.message + ""}
                </p>
              )}
            </div>

            {/* Email Input */}
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

            {/* Additional fields like phone, class, department, and college can be added similarly */}

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="text-white bg-purple-500 hover:bg-white hover:text-black focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 transition-all duration-300 ease-in-out"
              >
                Register
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
