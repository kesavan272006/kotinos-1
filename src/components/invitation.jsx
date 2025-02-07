import React, { useEffect, useState } from "react";
import { Paper, ListItem, Avatar, ListItemText, List } from "@mui/material";
import profileicon from "../assets/profileicon.svg";
import { Button } from "@mui/material";
import { collection, doc, getDocs, deleteDoc, setDoc } from "firebase/firestore";
import { auth, database } from "../config/firebase";
import Loading from "./Loading";
import { useLocation } from "react-router-dom";
import { useRequestContext } from '../context/RequestContext';
const Invitation = () => {
  const [user, setuser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { oppUserId } = useRequestContext();
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
        setIsAuthenticated(true);
      } else {
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
      showrequest();
    } catch (err) {
      console.error("Error deleting request:", err);
    }
  };

  if (loading) {
    return <Loading />;
  }
  const location = useLocation();
  const acceptReq = async (user) => {
    const acceptDoc = doc(database, "Users", `${auth.currentUser?.uid}`);
    const connectionDoc = doc(acceptDoc, "RequestIn", `${user.id}`); 
    
    try {
      await setDoc(connectionDoc, {
        role: user.role,
        username: user.username,
        id: user.id,
        status: 'connected',
      });
      alert(`Accepted the request from ${user.username}`);
      showrequest();
      addConnect(user.id, user); 
    } catch (err) {
      console.log(err);
    }
  };
  
  const addConnect = async (userid, user) => {
    const acceptDoc = doc(database, "Users", `${userid}`);
    const connectionDoc = doc(acceptDoc, "RequestIn", `${auth.currentUser?.uid}`);
    
    try {
      await setDoc(connectionDoc, {
        id: auth.currentUser?.uid,
        role: location.state.role,
        username: location.state.username,
        status: 'connected',
      });
      alert(`Accepted the request from ${user.username}`);
      showrequest();
    } catch (err) {
      console.log(err);
    }
  };
  
  

  return (
    <div>
      {user.length === 0 ? (
        <div
          style={{
            width: "100%",
            height: "40vw",
            backgroundColor: "#F1F8F9",
            textAlign: "center",
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
            display: "flex",
            flexDirection: "row",
            fontWeight: "bolder",
            fontSize: "40px",
          }}
        >
          <span style={{ color: "red", marginRight: "10px" }}>No </span>invitations
          available!
        </div>
      ) : (
        user
          .filter((user) => user.status === "pending")
          .map((eachuser) => (
            <Paper key={eachuser.id}>
              <List>
                <ListItem
                  style={{ display: "flex", flexDirection: "row", justifyContent: "start" }}
                >
                  <Avatar src={profileicon} />
                  <div style={{ marginLeft: "10px" }}>
                    <ListItemText primary={eachuser.username} secondary={eachuser.role} />
                  </div>
                  <Button
                    style={{
                      backgroundColor: "red",
                      color: "white",
                      fontSize: "20px",
                      marginLeft: "auto",
                    }}
                    onClick={() => deleteRequest(eachuser.id)}
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
                    onClick={() => acceptReq(eachuser)}
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
