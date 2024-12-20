import { Route, Routes } from "react-router-dom";
import { Landing } from "./pages/Landing";
import { Registration } from "./pages/Registration";
import ScrollToTop from "./components/ScrollToTop";
import { Verify } from "./pages/Verify";
import { Payment } from "./pages/Payment";

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register/:eventId" element={<Registration />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/payment" element={<Payment />} />
      </Routes>
    </>
  );
}

export default App;
