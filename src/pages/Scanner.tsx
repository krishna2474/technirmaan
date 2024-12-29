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

  // Format scan result to make it more readable (e.g., pretty print JSON if it's JSON)
  const formatScanResult = (result: string) => {
    try {
      const parsed = JSON.parse(result);
      return <pre>{JSON.stringify(parsed, null, 2)}</pre>; // Pretty print JSON
    } catch (e) {
      return <p>{result}</p>; // If it's not JSON, return as plain text
    }
  };

  return (
    <div className="flex flex-col items-center p-5 space-y-6 text-white">
      <h2 className="text-2xl font-semibold">QR Code Scanner</h2>

      {/* QR scanner frame */}
      <div className="relative w-full max-w-[400px] h-[300px] border-4 border-green-500 rounded-xl overflow-hidden">
        <video ref={videoRef} className="w-full h-full object-cover" />
      </div>

      <div className="mt-4">
        {isScanning ? (
          <button
            onClick={stopScanning}
            className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg"
          >
            Stop Scanning
          </button>
        ) : (
          <button
            onClick={startScanning}
            className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg"
          >
            Start Scanning
          </button>
        )}
      </div>

      <div>
        <p>Scan Result: {scanResult}</p>
      </div>

      {/* Modal for showing scan result */}
      {showModal && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-gray-800 text-white p-6 rounded-lg w-4/5 max-w-lg text-center">
            <h3 className="text-xl font-semibold">QR Code Data</h3>
            {formatScanResult(scanResult)} {/* Show formatted scan result */}
            <button
              onClick={closeModal}
              className="mt-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QrScanner;
