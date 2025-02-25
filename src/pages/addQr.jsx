import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import jsQR from "jsqr";
import { auth, database } from "../config/firebase";

const QRUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [existingQR, setExistingQR] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState("");
  const trustedGateways = ["pay.google.com", "phonepe.com", "paytm.com", "bhimupi.com"];

  useEffect(() => {
    const fetchExistingQR = async () => {
      if (!auth.currentUser) return;

      const userRef = doc(database, "Users", auth.currentUser?.uid, "profileDetails", "details");
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const userDetails = docSnap.data();
        setExistingQR(userDetails.qrCode); // Retrieve the existing QR code
      }
    };

    fetchExistingQR();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFile(reader.result);
        setMessage("");
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const decodeQR = async (imageBase64) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = imageBase64;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);

        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const qrCode = jsQR(imageData.data, img.width, img.height);

        qrCode ? resolve(qrCode.data) : reject("QR code not detected");
      };

      img.onerror = () => reject("Error loading image");
    });
  };

  const verifyQR = (data) => {
    try {
      if (data.startsWith("http")) {
        const qrUrl = new URL(data);
        return trustedGateways.some((gateway) => qrUrl.hostname.includes(gateway));
      }
      if (data.startsWith("upi://pay")) {
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;

      if (user) {
        try {
          const docRef = doc(database, "Users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setUsername(userData.username || "");
            setEmail(userData.email || "");
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
    };

    fetchProfile();
  }, [auth.currentUser]);

  const handleUpload = async () => {
    if (!file) {
      setMessage("❌ Please select a QR code image.");
      return;
    }

    setLoading(true);

    try {
      const qrData = await decodeQR(file);
      console.log("Decoded QR Data:", qrData);

      if (!verifyQR(qrData)) {
        setMessage("❌ Unverified QR code! Only trusted payment gateways or UPI links are allowed.");
        setLoading(false);
        return;
      }

      const userRef = doc(database, "Users", auth.currentUser?.uid, "profileDetails", "details");

      // Update only the qrCode field in the existing document
      await updateDoc(userRef, {
        qrCode: file, // Update only the qrCode field
      });

      setMessage("✅ QR code uploaded successfully!");
      setFile(null);
    } catch (error) {
      console.error(error);
      setMessage("⚠ Error processing QR code.");
    }

    setLoading(false);
  };

  return (
    <div className="qr-upload-container">
      <h2>Upload QR Code</h2>
      <div className="upload-section">
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button onClick={handleUpload} disabled={loading} className="upload-btn">
          {loading ? "Uploading..." : "Upload"}
        </button>
        <p>{message}</p>
      </div>
      
      {file && (
        <div className="qr-preview">
          <h3>Uploaded QR Code:</h3>
          <img src={file} alt="QR Code Preview" className="qr-image" />
        </div>
      )}
    </div>
  );
};

export default QRUpload;
