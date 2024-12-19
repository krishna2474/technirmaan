import { Route, Routes } from "react-router-dom";
import { Landing } from "./pages/Landing";
import { Registration } from "./pages/Registration";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register/:eventId" element={<Registration />} />
      </Routes>
    </>
  );
}

export default App;
