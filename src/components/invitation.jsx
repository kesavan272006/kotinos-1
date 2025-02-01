import React, { useEffect, useState } from "react";
import { Paper, ListItem, Avatar, ListItemText, List } from "@mui/material";
import profileicon from "../assets/profileicon.svg";
import { Button } from "@mui/material";
import { collection, doc, getDocs, deleteDoc } from "firebase/firestore";
import { auth, database } from "../config/firebase";
import Loading from "./Loading";

const Invitation = () => {
  const [user, setuser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const requestref = doc(database, "Users", `${auth.currentUser?.uid}`);
  const requestInRef = collection(requestref, "RequestIn");

  const showrequest = async () => {
    try {
      const data = await getDocs(requestInRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setuser(filteredData);
    } catch (err) {
      console.error("Error fetching requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("User is logged in:", user);
        setIsAuthenticated(true);
      } else {
        console.log("No user is logged in.");
        setIsAuthenticated(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      showrequest();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const deleteRequest = async (id) => {
    const requestDoc = doc(database, "Users", `${auth.currentUser?.uid}`, "RequestIn", id);
    try {
      await deleteDoc(requestDoc);
      // Refresh data after deletion
      showrequest();
    } catch (err) {
      console.error("Error deleting request:", err);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      {user.length === 0 ? (
        <div style={{width:'100%', height:'40vw', backgroundColor:'#F1F8F9', textAlign:'center', justifyContent:'center', alignItems:'center', alignSelf:'center', display:'flex', flexDirection:'column', fontWeight:'bolder', fontSize:'40px'}}>No invitations available!</div>
      ) : (
        user.map((eachuser) => (
          <Paper key={eachuser.id}>
            <List>
              <ListItem
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "start",
                }}
              >
                <Avatar src={profileicon} />
                <div style={{ marginLeft: "10px" }}>
                  <ListItemText
                    primary={eachuser.username}
                    secondary={eachuser.role}
                  />
                </div>
                <Button
                  style={{
                    backgroundColor: "red",
                    color: "white",
                    fontSize: "20px",
                    marginLeft: "auto",
                  }}
                  onClick={() => deleteRequest(eachuser.id)} // Added onClick handler
                >
                  Reject
                </Button>
                <Button
                  style={{
                    backgroundColor: "#01D836",
                    color: "white",
                    fontSize: "20px",
                    marginLeft: "15px",
                  }}
                >
                  Connect
                </Button>
              </ListItem>
            </List>
          </Paper>
        ))
      )}
    </div>
  );
};

export default Invitation;
