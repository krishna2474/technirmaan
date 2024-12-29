import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";

const QrScanner = () => {
  console.log("Scanner");

  const [scanResult, setScanResult] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanner, setScanner] = useState<BrowserMultiFormatReader | null>(null);

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
    </div>
  );
};

export default QrScanner;
