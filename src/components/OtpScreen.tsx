import { useRef, useState } from "react";
import axios from "axios"; // Make sure axios is installed
import { BACKEND_URL } from "../config";
import { useLocation, useNavigate } from "react-router-dom";

export const OtpScreen = () => {
  const nav = useNavigate();
  const location = useLocation();

  // Retrieve the email from the query string
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get("email") || "";
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const [loading, setLoading] = useState(false); // Loading state
  const [otp, setOtp] = useState<string>(""); // State to hold the OTP

  const handleInputChange = (index: number, value: string) => {
    if (value.length === 1 && index < inputRefs.current.length - 1) {
      // Move focus to the next input
      inputRefs.current[index + 1]?.focus();
    }
    if (value.length === 0 && index > 0) {
      // Move focus to the previous input if deleting
      inputRefs.current[index - 1]?.focus();
    }

    // Update OTP state when any input changes
    setOtp(inputRefs.current.map((input) => input.value).join(""));
  };

  const handleVerifyClick = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 4) {
      alert("Please enter a valid 4-digit OTP.");
      return;
    }

    setLoading(true); // Start loading

    try {
      // Send OTP and email to the backend for verification
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/verify/verify-otp`,
        {
          email,
          otp,
        }
      );

      if (response.data.success) {
        alert("Account Verified");
        nav("/payment");
      } else {
        alert(response.data.error || "Failed to verify OTP");
      }
    } catch (error) {
      console.error(error);
      alert("Error while verifying OTP");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden py-12 mx-10">
      <div className="relative bg-white/10 backdrop-blur-3xl border border-white/50 px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
        <div className="mx-auto flex w-full max-w-md flex-col space-y-8">
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <div className="font-semibold text-3xl text-white">
              <p>Email Verification</p>
            </div>
            <div className="flex flex-row text-sm font-medium text-gray-400">
              <p>
                We have sent a code to your email <u>{email}</u>
              </p>
            </div>
          </div>

          <div>
            <form onSubmit={handleVerifyClick}>
              <div className="flex flex-col space-y-10">
                <div className="flex justify-between mx-auto w-full max-w-xs">
                  {[0, 1, 2, 3].map((_, index) => (
                    <div className="w-16 h-16" key={index}>
                      <input
                        ref={(el) => (inputRefs.current[index] = el!)}
                        className="text-white w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white/10 ring-purple-500"
                        type="text"
                        maxLength={1}
                        onChange={(e) =>
                          handleInputChange(index, e.target.value)
                        }
                        onKeyDown={(e) => {
                          if (
                            e.key === "Backspace" &&
                            e.currentTarget.value === ""
                          ) {
                            handleInputChange(index, "");
                          }
                        }}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex flex-col space-y-4">
                  <div>
                    <button
                      className="flex flex-row items-center justify-center text-center w-full border rounded-xl outline-none py-5 bg-purple-500 border-none text-white text-sm shadow-sm h-12"
                      type="submit" // Use "submit" to trigger the form submission
                      disabled={loading} // Disable button while loading
                    >
                      {loading ? (
                        <div className="spinner-border animate-spin border-4 border-t-4 border-white rounded-full w-6 h-6 mr-2"></div> // Loader spinner
                      ) : (
                        "Verify Account"
                      )}
                    </button>
                  </div>

                  <div className="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-white">
                    <p>Didn't receive code?</p>{" "}
                    <a
                      className="flex flex-row items-center text-purple-500"
                      href="http://"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Resend
                    </a>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
