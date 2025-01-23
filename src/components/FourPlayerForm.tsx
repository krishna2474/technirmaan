import { useState } from "react";
import { useForm } from "react-hook-form";
// import { useParams } from "react-router-dom";

export const FourPlayerForm = () => {
  // useEffect(() => {
  //   alert(
  //     "Ensure all details are valid as they will be printed on the Certificate"
  //   );
  // }, []);

  const {
    register,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const [registrationOpen] = useState(false); // Set to false to show "Registrations Closed"
  const numPlayers = 4;

  return (
    <div className="relative flex flex-col items-center w-full">
      <div className="w-full max-w-md rounded-lg">
        {registrationOpen ? (
          <form className="space-y-2 md:space-y-4 font-semibold mx-10">
            {[...Array(numPlayers)].map((_, index) => {
              const playerIndex = index + 1;
              return (
                <div key={playerIndex} className="space-y-2 md:space-y-4">
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
                    className={`text-white bg-transparent rounded-md border ${
                      errors[`name${playerIndex}`] ? "border-red-600" : ""
                    } text-sm p-2.5`}
                    placeholder={`Player ${playerIndex} Full Name`}
                  />
                  {errors[`name${playerIndex}`] && (
                    <p className="text-red-500 text-sm truncate">
                      {errors[`name${playerIndex}`]?.message + ""}
                    </p>
                  )}
                </div>
              );
            })}
            <div className="flex justify-center">
              <button
                type="submit"
                className="text-white bg-purple-500 hover:bg-white hover:text-black focus:outline-none font-medium rounded-full text-sm px-5 py-2.5"
              >
                Register
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center text-red-600 font-bold text-lg">
            Registrations are now closed!
          </div>
        )}
      </div>
    </div>
  );
};
