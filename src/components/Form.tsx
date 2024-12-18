import { useForm } from "react-hook-form";
export const Form = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
  });
  return (
    <>
      <div className={`relative flex flex-col items-center w-full`}>
        <div className="w-full max-w-md rounded-lg">
          <form
            className="space-y-2 md:space-y-4 font-semibold mx-10"
            onSubmit={onSubmit}
          >
            <div>
              <input
                autoComplete="off"
                {...register("name", {
                  required: true,
                  minLength: 3,
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
                  Full name is required.
                </p>
              )}
            </div>

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

            <div>
              <div className="relative">
                <input
                  autoComplete="off"
                  {...register("phone", {
                    required: true,
                    minLength: {
                      value: 10,
                      message: "Please enter a Valid Phone Number",
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
                />{" "}
                {errors["phone"] && (
                  <p className="text-red-500 text-sm">
                    {errors["phone"]?.message + "" ||
                      "Phone Number is required."}
                  </p>
                )}
              </div>
            </div>
            <div>
              <input
                autoComplete="off"
                {...register("class", {
                  required: true,
                  minLength: 3,
                })}
                type="text"
                name="class"
                id="class"
                className={`text-white active:border-purple-500 w-full bg-transparent rounded-md border border-stroke py-[10px] outline-none transition b ${
                  errors["class"]
                    ? "focus:border-red-600 focus:ring-red-600"
                    : ""
                } text-sm rounded-lg block w-full p-2.5 focus:ring-customPurple focus:border-purple-500 `}
                style={{ width: "100%" }}
                placeholder="Class"
              />
              {errors["class"] && (
                <p className="text-red-500 text-sm">
                  {errors["class"]?.message + "" || "Class is required."}
                </p>
              )}
            </div>
            <div>
              <input
                autoComplete="off"
                {...register("department", {
                  required: true,
                  minLength: 2,
                })}
                type="text"
                name="department"
                id="department"
                className={`text-white active:border-purple-500 w-full bg-transparent rounded-md border border-stroke py-[10px] outline-none transition b ${
                  errors["department"]
                    ? "focus:border-red-600 focus:ring-red-600"
                    : ""
                } text-sm rounded-lg block w-full p-2.5 focus:ring-customPurple focus:border-purple-500 `}
                style={{ width: "100%" }}
                placeholder="Department"
              />
              {errors["department"] && (
                <p className="text-red-500 text-sm truncate">
                  Department is required.
                </p>
              )}
            </div>
            <div>
              <input
                {...register("college", {
                  required: true,
                  minLength: 3,
                })}
                type="text"
                name="college"
                id="college"
                className={`text-white active:border-purple-500 w-full bg-transparent rounded-md border border-stroke py-[10px] outline-none transition b ${
                  errors["college"]
                    ? "focus:border-red-600 focus:ring-red-600"
                    : ""
                } text-sm rounded-lg block w-full p-2.5 focus:ring-customPurple focus:border-purple-500 `}
                style={{ width: "100%" }}
                placeholder="College"
              />
              {errors["college"] && (
                <p className="text-red-500 text-sm truncate">
                  College is required.
                </p>
              )}
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="text-white bg-purple-500 hover:bg-white hover:text-black focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 transition-all duration-300 ease-in-out"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
