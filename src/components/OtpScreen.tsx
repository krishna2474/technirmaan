import { useRef, useState } from "react";

export const OtpScreen = ({ email }: { email: string }) => {
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const [loading, setLoading] = useState(false); // Loading state

  const handleInputChange = (index: number, value: string) => {
    if (value.length === 1 && index < inputRefs.current.length - 1) {
      // Move focus to the next input
      inputRefs.current[index + 1]?.focus();
    }
    if (value.length === 0 && index > 0) {
      // Move focus to the previous input if deleting
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyClick = async () => {
    setLoading(true); // Start loading

    // Simulating a delay (for example, an API call)
    setTimeout(() => {
      setLoading(false); // Stop loading after 2 seconds
      alert("Account Verified");
    }, 2000);
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
              <p>We have sent a code to your email {email}</p>
            </div>
          </div>

          <div>
            <form>
              <div className="flex flex-col space-y-10">
                <div className="flex justify-between mx-auto w-full max-w-xs">
                  {[0, 1, 2, 3].map((_, index) => (
                    <div className="w-16 h-16" key={index}>
                      <input
                        ref={(el) => (inputRefs.current[index] = el!)}
                        className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white/10 focus:bg-gray-50 ring-purple-500"
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
                      onClick={handleVerifyClick}
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
