import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import jsQR from "jsqr";
import { auth, database } from "../config/firebase";
import samplechat from '../assets/samplechat.jpg';
import samplefund from '../assets/kkr.jpg';
import {
  Box,
  Button,
  Typography,
  Container,
  Grid,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const QRUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [existingQR, setExistingQR] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const trustedGateways = ["pay.google.com", "phonepe.com", "paytm.com", "bhimupi.com"];

  useEffect(() => {
    const fetchExistingQR = async () => {
      if (!auth.currentUser) return;
      const userRef = doc(database, "Users", auth.currentUser.uid, "profileDetails", "details");
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const userDetails = docSnap.data();
        setExistingQR(userDetails.qrCode);
      }
    };
    fetchExistingQR();
  }, []);

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
      if (data.startsWith("upi://pay")) return true;
      return false;
    } catch {
      return false;
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("❌ Please select a QR code image.");
      return;
    }

    setLoading(true);
    try {
      const qrData = await decodeQR(file);
      if (!verifyQR(qrData)) {
        setMessage("❌ Unverified QR code! Only trusted payment gateways or UPI links are allowed.");
        setLoading(false);
        return;
      }

      const userRef = doc(database, "Users", auth.currentUser.uid, "profileDetails", "details");
      await updateDoc(userRef, {
        qrCode: file,
        decodedQr: qrData,
      });

      setMessage("✅ QR code uploaded successfully!");
      setFile(null);
      setExistingQR(file);
    } catch (error) {
      console.error(error);
      setMessage("⚠ Error processing QR code.");
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Upload & View Your QR Code
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Upload QR Code
            </Typography>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={handleUpload}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Upload"}
            </Button>
            {message && (
              <Alert severity={message.startsWith("✅") ? "success" : "error"} sx={{ mt: 2 }}>
                {message}
              </Alert>
            )}
            {file && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1">Preview:</Typography>
                <Box
                  component="img"
                  src={file}
                  alt="QR Preview"
                  sx={{ width: "100%", maxHeight: 300, objectFit: "contain", mt: 1 }}
                />
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6" gutterBottom>
              Current QR Code
            </Typography>
            {existingQR ? (
              <Box
                component="img"
                src={existingQR}
                alt="Current QR"
                sx={{ width: "100%", maxHeight: 300, objectFit: "contain", mt: 2 }}
              />
            ) : (
              <Typography variant="body2">No QR code uploaded yet.</Typography>
            )}
            <Typography variant="subtitle2" sx={{ mt: 2 }}>
              Uploaded by: {username || "User"}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* 🚀 Scroll Sections Below Upload */}
      <Box sx={{ mt: 10 }}>
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7 }}
      >
        <Typography variant="h5" gutterBottom>
          Why Upload Your QR Code?
        </Typography>
        <Typography variant="body1">
          Uploading your QR code allows you to accept peer-to-peer payments directly inside chat conversations.
          This makes paying and receiving money faster, easier, and safer.
        </Typography>
        <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
          <img
            src={samplechat}
            alt="Chat feature screenshot"
            style={{
              width: '100%',
              maxWidth: '280px',
              height: 'auto',
              borderRadius: '8px',
            }}
          />
        </Box>
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <Box sx={{ mt: 8 }}>
          <Typography variant="h5" gutterBottom>
            Crowdfunding Support
          </Typography>
          <Typography variant="body1">
            Athletes, coaches, and organizations can enable crowdfunding — allowing your followers to send contributions every time
            you post. Let your community support your journey with just a scan.
          </Typography>
          <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
            <img
              src={samplefund}
              alt="Crowdfunding screenshot"
              style={{
                width: '100%',
                maxWidth: '280px',
                height: 'auto',
                borderRadius: '8px',
              }}
            />
          </Box>
        </Box>
      </motion.div>
    </Box>

    </Container>
  );
};

export default QRUpload;
