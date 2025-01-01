import { Route, Routes } from "react-router-dom";
import React, { Suspense } from "react";
import ScrollToTop from "./components/ScrollToTop";

// Lazy-loaded components
const Landing = React.lazy(() => import("./pages/Landing"));
const Registration = React.lazy(() => import("./pages/Registration"));
const Verify = React.lazy(() => import("./pages/Verify"));
const Teams = React.lazy(() => import("./pages/Teams"));
const GenerateQrPage = React.lazy(() => import("./pages/GenerateQr"));
const QrScanner = React.lazy(() => import("./pages/Scanner"));
const PrivacyPolicy = React.lazy(() => import("./pages/PrivacyPolicy"));
const TermsAndConditions = React.lazy(
  () => import("./pages/TermsAndConditions")
);
const CancellationAndRefund = React.lazy(
  () => import("./pages/CancellationAndRefund")
);
const ShippingAndDelivery = React.lazy(
  () => import("./pages/ShippingAndDelivery")
);
const ContactUs = React.lazy(() => import("./pages/ContactUs"));
const PaymentPage = React.lazy(() => import("./pages/Payment"));

function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/register/:eventId" element={<Registration />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/generate-qr" element={<GenerateQrPage />} />
          <Route path="/scanner" element={<QrScanner />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route
            path="/terms-and-conditions"
            element={<TermsAndConditions />}
          />
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
      </Suspense>
    </>
  );
}

export default App;
