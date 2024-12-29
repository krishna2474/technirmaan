import { Route, Routes } from "react-router-dom";
import { Landing } from "./pages/Landing";
import { Registration } from "./pages/Registration";
import ScrollToTop from "./components/ScrollToTop";
import { Verify } from "./pages/Verify";
import { Teams } from "./pages/Teams";
// import { Payment } from "./pages/Payment";
import GenerateQrPage from "./pages/GenerateQr";
import QrScanner from "./pages/Scanner";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import CancellationAndRefund from "./pages/CancellationAndRefund";
import ShippingAndDelivery from "./pages/ShippingAndDelivery";
import ContactUs from "./pages/ContactUs";

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register/:eventId" element={<Registration />} />
        <Route path="/verify" element={<Verify />} />
        {/* <Route path="/payment" element={<Payment />} /> */}
        <Route path="/teams" element={<Teams />} />
        <Route path="/generate-qr" element={<GenerateQrPage />} />
        <Route path="/scanner" element={<QrScanner />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route
          path="/cancellation-and-refund"
          element={<CancellationAndRefund />}
        />
        <Route
          path="/shipping-and-delivery"
          element={<ShippingAndDelivery />}
        />
        <Route path="/contact-us" element={<ContactUs />} />
      </Routes>
    </>
  );
}

export default App;
