import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";

const QrScanner = () => {
  console.log("Scanner");

  const [scanResult, setScanResult] = useState<string>("");
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanner, setScanner] = useState<BrowserMultiFormatReader | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    // Initialize ZXing scanner
    const initScanner = async () => {
      const newScanner = new BrowserMultiFormatReader();
      setScanner(newScanner);
    };

    initScanner();

    return () => {
      // Cleanup scanner when component is unmounted
      if (scanner) {
        scanner.reset();
      }
    };
  }, []);

  const startScanning = async () => {
    if (scanner && videoRef.current) {
      try {
        setIsScanning(true);
        await scanner.decodeFromVideoDevice(
          null,
          videoRef.current,
          (result) => {
            if (result) {
              setScanResult(result.getText());
              stopScanning(); // Stop scanning once the QR code is found
              setShowModal(true); // Show the modal with the scan result
            }
          }
        );
      } catch (error) {
        console.error(error);
      }
    }
  };

  const stopScanning = () => {
    if (scanner) {
      scanner.reset();
      setIsScanning(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <h2>QR Code Scanner</h2>
      <video ref={videoRef} style={{ width: "100%", maxWidth: 400 }} />
      <div>
        {isScanning ? (
          <button onClick={stopScanning}>Stop Scanning</button>
        ) : (
          <button onClick={startScanning}>Start Scanning</button>
        )}
      </div>

      <div>
        <p>Scan Result: {scanResult}</p>
      </div>

      {/* Modal for showing scan result */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "8px",
              width: "300px",
              textAlign: "center",
            }}
          >
            <h3>QR Code Data</h3>
            <p>{scanResult}</p>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QrScanner;
