import React, { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, database } from "../config/firebase";
import {
  Alert,
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Paper,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import samplechat from "../assets/samplechat.jpg";
import samplefund from "../assets/kkr.jpg"; 
import Footer from "../components/footer";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const QRDisplay = () => {
  const { userId } = useParams();
  const [qrCodes, setQrCode] = useState(null);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [qrimg, setQrImg] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const docRef = doc(database, "Users", userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUsername(data.username);
        setRole(data.role);
      }
    };
    fetchProfile();
  }, [userId]);

  useEffect(() => {
    const fetchLatestQRCode = async () => {
      try {
        const qrDocRef = doc(database, "Users", userId, "profileDetails", "details");
        const docSnap = await getDoc(qrDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setQrCode(data.decodedQr);
          setQrImg(data.qrCode);
        }
      } catch (error) {
        console.error("Error fetching QR code:", error);
        setMessage("⚠ Failed to load QR code.");
      }
    };
    fetchLatestQRCode();
  }, [userId]);

  return (
    <>
        <Container maxWidth="lg" sx={{ mt: 6 }}>
      <Typography variant="h4" align="center" gutterBottom color="primary">
        Support via Verified QR Code
      </Typography>

      {message && <Alert severity="error" sx={{ mb: 2 }}>{message}</Alert>}

      {!qrCodes ? (
        <Paper sx={{ p: 3, textAlign: "center", backgroundColor: "#e3f2fd" }}>
          <Typography variant="body1">
            No verified QR code available. <br />
            {username ? `${username} has not uploaded any verified QR code.` : "Loading..."}
          </Typography>
        </Paper>
      ) : (
        <Grid container justifyContent="center">
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 4, textAlign: "center", backgroundColor: "#e3f2fd" }}>
              <img src={qrimg} alt="QR Code" width="150" />
              <Typography variant="body2" sx={{ mt: 2 }}>
                Uploaded by: <strong>{username || "Unknown User"}</strong>
              </Typography>

              {qrCodes.startsWith("upi://pay") ? (
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  component={Link}
                  to={qrCodes}
                >
                  Pay Now
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  color="secondary"
                  sx={{ mt: 2 }}
                  onClick={() => window.open(qrCodes, "_blank")}
                >
                  Scan & Go
                </Button>
              )}

              {qrCodes.startsWith("upi://pay") && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="body2" color="textSecondary">
                    ⚠ If your payment app doesn't open, copy and paste the link:
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <input
                      type="text"
                      value={qrCodes}
                      readOnly
                      style={{
                        flex: 1,
                        padding: "8px",
                        marginRight: "8px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                      }}
                    />
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => {
                        navigator.clipboard.writeText(qrCodes);
                        alert("QR code URL copied!");
                      }}
                    >
                      Copy Link
                    </Button>
                  </Box>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Animated Scroll Info */}
      <Box sx={{ mt: 10 }}>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
        >
          <Typography variant="h5" gutterBottom color="primary">
            Why Make a Payment?
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Whether you're tipping a creator, supporting an athlete, or donating to an organization —
            your payment goes directly to the user through their verified QR code.
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <img
              src={samplechat}
              alt="Chat payment screenshot"
              style={{
                width: '100%',
                maxWidth: '280px',
                height: 'auto',
                borderRadius: '8px',
                display: 'block',
              }}
            />
          </Box>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <Box sx={{ mt: 8 }}>
            <Typography variant="h5" gutterBottom color="primary">
              Safe. Verified. Instant.
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              All QR codes on our platform are reviewed and verified. Your payment is sent directly through UPI to their linked
              account — no middleman involved.
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <img
                src={samplefund}
                alt="Crowdfunding screenshot"
                style={{
                  width: '100%',
                  maxWidth: '280px',
                  height: 'auto',
                  borderRadius: '8px',
                  display: 'block',
                }}
              />
            </Box>
          </Box>
        </motion.div>
      </Box>
    </Container>
    <br />
    <Footer />
    </>
  );
};

export default QRDisplay;
