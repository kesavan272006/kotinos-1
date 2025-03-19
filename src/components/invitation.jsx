import React, { useEffect, useState } from "react";
import Navbar from '../components/navbar';

import { Paper, ListItem, Avatar, ListItemText, List } from "@mui/material";
import profileicon from "../assets/profileicon.svg";
import { Button } from "@mui/material";
import { collection, doc, getDocs, deleteDoc, setDoc } from "firebase/firestore";
import { auth, database } from "../config/firebase";
import Loading from "./Loading";
import { Link, useLocation } from "react-router-dom";
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


  const addConnect = async (requestId, user) => {
    const acceptDoc = doc(database, "Users", `${requestId}`);
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
    <div className="bg-gray-50 h-screen">
      <Navbar />
      {user.filter((eachuser) => eachuser.status === "pending").length === 0 ? (
        <div
          className="bg-gray-50"
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
          <span className="lexend hidden md:block" style={{ color: "#2BCEE0", marginRight: "10px" }}>No </span><p className="lexend"><span className="md:hidden text-[#2BCEE0]">No </span>invitations
            available!</p>
        </div>
      ) : (
        user
          .filter((user) => user.status === "pending")
          .map((eachuser) => (
            <>
              <div className="md:flex justify-center">
                <div className="md:w-1/2 ">
                <h1 className="text-2xl md:ml-1 ml-3 mb-5 font-bold text-gray-800 mt-10">
                  Incoming Invitations
                </h1>
                </div>
              </div>
              <div className="flex justify-center w-full">

                <div key={eachuser.id} className=" w-[95%] md:w-[50%] bg-white m-0.5">
                  <List>
                    <ListItem
                      style={{ display: "flex", flexDirection: "row", justifyContent: "start" }}
                    >
                      <Link to={`/otherprofile/${eachuser.id}`}>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'start', alignItems: 'center' }}>
                          <Avatar src={profileicon} className="bg-gray-100" sx={{ width: 48, height: 48,}} />
                          <div style={{ marginLeft: "10px" }}>
                            <ListItemText primary={eachuser.username} secondary={eachuser.role} />
                          </div>
                        </div>
                      </Link>
                      <button className="ml-auto rounded-full bg-gray-100 px-5 py-1 border border-gray-100 hover:border-gray-400"

                        onClick={() => deleteRequest(eachuser.id)}
                      >
                        Reject
                      </button>
                      <button className="border border-blue-300 hover:border-blue-700 rounded-full px-4 py-1 hover:scale- ml-2 "

                        onClick={() => acceptReq(eachuser)}
                      >
                        Connect
                      </button>
                    </ListItem>
                  </List>
                </div>
              </div>
            </>
          ))
      )}

    </div>
  );
};

export default Invitation;
