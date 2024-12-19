import Navbar from "../components/NavBar";
import { OtpScreen } from "../components/OtpScreen";

export const Verify = () => {
  return (
    <>
      <Navbar /> <OtpScreen email={"kk@gmail.com"} />
    </>
  );
};
