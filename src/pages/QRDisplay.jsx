import React, { useState, useEffect } from "react";
import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import { auth, database } from "../config/firebase";
import { Alert } from "@mui/material";
import { Link, useParams } from "react-router-dom";

const QRDisplay = () => {
    const {userId} = useParams();
  const [qrCodes, setQrCode] = useState(null);
  const [message, setMessage] = useState("");
  const [username, setUsername]=useState("");
  const [role, setRole]=useState("");
  const [qrimg, setqrimg]=useState("");
  const user = auth.currentUser;
  useEffect(() => {
    const fetchProfile2 = async () => {
        
        const docRef = doc(database, "Users", userId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const reference = docSnap.data();
                setUsername(reference.username)
                setRole(reference.role);
            }
    };
    
    fetchProfile2();
}, [user, role]);
  useEffect(() => {
    const fetchLatestQRCode = async () => {
      try {
        const qrDocref = doc(database, "Users", userId);
        const qrDoc2ref = doc(qrDocref, "profileDetails", "details");
        const querySnapshot = await getDoc(qrDoc2ref);

        if (querySnapshot.exists()) {
          const latestQR = querySnapshot.data();
          setQrCode(latestQR.decodedQr);
          setqrimg(latestQR.qrCode);
        }
      } catch (error) {
        console.error("Error fetching QR code:", error);
        setMessage("⚠ Failed to load QR code.");
      }
    };

    fetchLatestQRCode();
  }, []);

  return (
    <div style={{marginTop:'40px'}} className="qr-display-container">
      <h2 className="title">Latest Verified QR Code</h2>
      {message && <p className="error-message">{message}</p>}
      {!qrCodes ? (
        <p>No verified QR code available. <br />{username} has not uploaded any verified qr code.</p>
      ) : (
        <div className="qr-content">
          <img src={qrimg} alt="QR Code" width="150" className="qr-image" />
          <p className="uploaded-by">Uploaded by: {username || "Unknown User"}</p>
          
          {qrCodes.startsWith("upi://pay") ? (
            <Link
              to={qrCodes}
              style={{
                display: "inline-block",
                padding: "10px 20px",
                backgroundColor: "#4CAF50",
                color: "white",
                textDecoration: "none",
                borderRadius: "5px",
                marginTop: "10px",
              }}
              className="pay-now-button"
            >
              Pay Now
            </Link>
          ) : (
            <button className="scan-go-button" onClick={() => window.open(qrCodes.decodedQr, "_blank")}>Scan & Go</button>
          )}
          
          {qrCodes.startsWith("upi://pay") && (
            <div className="qr-copy-section">
              <p className="copy-text">⚠ If the payment app doesn't open, copy & paste the link below manually:</p>
              <input
                type="text"
                value={qrCodes}
                readOnly
                className="qr-link-input"
              />
              <button
                onClick={() => 
                    {
                        navigator.clipboard.writeText(qrCodes)
                        alert("Qr code url copied!")
                    }
                }
                className="copy-button"
              >
                Copy UPI Link
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QRDisplay;