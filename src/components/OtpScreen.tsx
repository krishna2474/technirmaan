import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useLocation, useNavigate } from "react-router-dom";

export const OtpScreen = () => {
  const nav = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get("email") || "";
  const event_id = searchParams.get("event") || "";
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState<string>("");
  const [timer, setTimer] = useState<number>(30); // Timer state for 30 seconds
  const [resendDisabled, setResendDisabled] = useState<boolean>(true); // Resend button disabled state

  // Timer logic
  useEffect(() => {
    if (timer === 0) {
      setResendDisabled(false); // Enable resend button when timer hits 0
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleInputChange = (index: number, value: string) => {
    if (value.length === 1 && /^[0-9]$/.test(value)) {
      // Update the current field
      inputRefs.current[index].value = value;

      // Move focus to the next input if it exists
      if (index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }

    if (value.length === 0 && index > 0) {
      // Move focus to the previous input if deleting
      inputRefs.current[index - 1]?.focus();
    }

    // Update OTP state
    setOtp(inputRefs.current.map((input) => input.value).join(""));
  };

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    index: number
  ) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 4);
    const values = pastedData.split("");

    values.forEach((char, i) => {
      if (index + i < inputRefs.current.length) {
        const input = inputRefs.current[index + i];
        if (input && /^[0-9]$/.test(char)) {
          input.value = char;
          handleInputChange(index + i, char);
        }
      }
    });

    if (index + values.length < inputRefs.current.length) {
      inputRefs.current[index + values.length]?.focus();
    }
  };

  const handleVerifyClick = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 4) {
      alert("Please enter a valid 4-digit OTP.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/verify/verify-otp`,
        {
          email,
          otp,
          event_id,
        }
      );

      if (response.data.success) {
        alert("Account Verified");
        const resp = await axios.get(`${BACKEND_URL}/api/v1/user/${email}`);
        if (resp.data.department === "IT" && resp.data.college === "CHM") {
          const newRegistration = await axios.post(
            `${BACKEND_URL}/api/v1/register/new?email=${email}&event_id=${event_id}`
          );
          if (newRegistration.data.error) {
            return;
          }
          nav(`/generate-qr?email=${email}&event_id=${event_id}`);
        } else {
          const newRegistration = await axios.post(
            `${BACKEND_URL}/api/v1/register/new?email=${email}&event_id=${event_id}`
          );
          if (newRegistration.data.error) {
            return;
          } else nav(`/generate-qr?email=${email}&event_id=${event_id}`);
        }
      } else {
        alert(response.data.error || "Failed to verify OTP");
      }
    } catch (error) {
      console.error(error);
      alert("Error while verifying OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendDisabled(true);
    setTimer(30); // Reset the timer to 30 seconds
    setLoading(true);
    try {
      // Call the backend to resend OTP
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/verify/resend-otp`,
        {
          email,
          event_id,
        }
      );

      if (response.data.success) {
        alert("OTP sent to your email!");
      } else {
        alert("Failed to resend OTP");
      }
    } catch (error) {
      console.error(error);
      alert("Error while resending OTP");
    } finally {
      setLoading(false);
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
                        type="number"
                        maxLength={1}
                        onChange={(e) =>
                          handleInputChange(index, e.target.value)
                        }
                        onPaste={(e) => handlePaste(e, index)}
                        onFocus={(e) => e.target.select()}
                        onKeyDown={(e) => {
                          if (
                            e.key === "Backspace" &&
                            !inputRefs.current[index].value &&
                            index > 0
                          ) {
                            inputRefs.current[index - 1]?.focus();
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
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="spinner-border animate-spin border-4 border-t-4 border-white rounded-full w-6 h-6 mr-2"></div>
                      ) : (
                        "Verify Account"
                      )}
                    </button>
                  </div>

                  <div className="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-white">
                    <p>Didn't receive code?</p>{" "}
                    <button
                      className="flex flex-row items-center text-purple-500"
                      onClick={handleResendOtp}
                      disabled={resendDisabled}
                    >
                      {resendDisabled ? (
                        <span>{`Resend in ${timer}s`}</span>
                      ) : (
                        "Resend"
                      )}
                    </button>
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
