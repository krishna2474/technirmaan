import { Route, Routes } from "react-router-dom";
import { Landing } from "./pages/Landing";
import { Registration } from "./pages/Registration";
import ScrollToTop from "./components/ScrollToTop";
import { Verify } from "./pages/Verify";
import { Teams } from "./pages/Teams";
import { Payment } from "./pages/Payment";
import GenerateQrPage from "./pages/GenerateQr";
import QrScanner from "./pages/Scanner";

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
        <Route path="/generate-qr" element={<GenerateQrPage />} />
        <Route path="/scanner" element={<QrScanner />} />
      </Routes>
    </>
  );
}

export default App;
