import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import MessageNav from "../components/navbar2";
import { useLocation } from "react-router-dom";
const Messages = () => {
    const location = useLocation();
  return (
    <div>
        <MessageNav username={location.state.username} role={location.state.role} />
        <div
        style={{
            display: "flex",
            flexDirection: "column",
            position: "fixed",
            bottom: "0",
            left: "0",
            width: "100%",
            padding: "10px",
            backgroundColor: "#fff",
            boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.1)",
        }}
        >
        <div
            style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            width: "100%", 
            }}
        >
            <TextField
            label="Start a conversation"
            style={{
                width: "400px",
                marginRight: "10px",
            }}
            />
            <Button
            style={{
                backgroundColor: "#28a745",
                color: "#fff",
                padding: "12px 24px",
                fontSize: "16px",
                fontWeight: "bold",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                textAlign: "center",
                transition: "background-color 0.3s ease",
            }}
            >
            Send
            </Button>
        </div>
        </div>
    </div>
  );
};

export default Messages;
