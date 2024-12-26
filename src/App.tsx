import { Route, Routes } from "react-router-dom";
import { Landing } from "./pages/Landing";
import { Registration } from "./pages/Registration";
import ScrollToTop from "./components/ScrollToTop";
import { Verify } from "./pages/Verify";
import { Payment } from "./pages/Payment";
import { Teams } from "./pages/Teams";

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register/:eventId" element={<Registration />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/teams" element={<Teams />} />
      </Routes>
    </>
  );
}

export default App;
