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
    <div>
      <h2>Latest Verified QR Code</h2>
      {message && <p>{message}</p>}
      {!qrCodes ? (
        <p>No verified QR code available.</p>
      ) : (
        <div style={{ marginBottom: "20px" }}>
          <img src={qrimg} alt="QR Code" width="150" />
          <p>Uploaded by: {username || "Unknown User"}</p>
          
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
            >
              Pay Now
            </Link>
          ) : (
            <button onClick={() => window.open(qrCodes.decodedQr, "_blank")}>Scan & Go</button>
          )}
          
          {qrCodes.startsWith("upi://pay") && (
            <div style={{ marginTop: "10px" }}>
              <p>⚠ If the payment app doesn't open, copy & paste the link below manually:</p>
              <input
                type="text"
                value={qrCodes}
                readOnly
                style={{
                  width: "100%",
                  padding: "5px",
                  fontSize: "14px",
                }}
              />
              <button
                onClick={() => 
                    {
                        navigator.clipboard.writeText(qrCodes)
                        alert("Qr code url copied!")
                    }
                }
                style={{
                  marginTop: "5px",
                  padding: "5px 10px",
                  cursor: "pointer",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "3px",
                }}
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