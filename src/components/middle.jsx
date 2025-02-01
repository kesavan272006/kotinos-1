import React, { useRef } from 'react'
import profileicon from '../assets/profileicon.svg'
import galleryicon from '../assets/gallery.svg'
import videoicon from '../assets/videoicon.svg'
import eventicon from '../assets/eventicon.svg'
import sachin from '../assets/sachin.jpg'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { database, auth } from '../config/firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import Posts from './posts'
const Middle = ({userData}) => {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const navigate = useNavigate();
  const postRef = useRef(null);
  const [posts, setPosts]=useState([]);
  useEffect(()=>{
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;

      if (currentUser) {
          const userRef = doc(database, "Users", currentUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
              const userData = userSnap.data();
              setUsername(userData.username || 'No Username');
              setRole(userData.role || 'No Role');
          } else {
              navigate("/signin");
          }
      } else {
          navigate("/signin");
      }
  };

  fetchUserData();
  }, [navigate]);
  const getPost =  ()=>{
    setTimeout(async() => {
      const postDocument = doc(database, "Users", `${auth.currentUser?.uid}`)
      const postRef = collection(postDocument, "Posts")
      try {
        const data = await getDocs(postRef );
        const filteredData = data.docs.map((doc)=>({
          ...doc.data(),
          id: doc.id,
        }))
        setPosts(filteredData);
      } catch (err) {
        console.error(err);
      }
    }, 1000);
  }
  useEffect(()=>{
    getPost();
  })
  return (
    <>
      <div style={{width:'50vw', height:'100%', marginTop:'50px', }}>
        <div style={{backgroundColor:'white'}}>
          <div style={{display:'flex', paddingTop:'20px', flexDirection:'row', justifyContent:'space-evenly'}}>
            <img src={profileicon} alt="Profile" style={{height:'70px', width:'70px', borderRadius:'50%',backgroundColor:'gray'}} />
            <input onClick={()=> postRef.current?.click()} type="text" placeholder='start a post' style={{borderRadius:'10px', height: '70px', width: '600px', backgroundColor:'whitesmoke'}} />
            <Posts ref={postRef}/>
          </div>
          <div style={{height:'50px', marginTop:'10px', display:'flex', flexDirection:'row', justifyContent:'space-evenly'}}>
            <div style={{display:'flex', flexDirection:'row', justifyContent:'center'}}>
                <img src={galleryicon} alt="photos" style={{height:'30px', width:'30px', borderRadius:'50%'}} />
                <h3>Photo</h3>
            </div>
            <div style={{display:'flex', flexDirection:'row', justifyContent:'center'}}>
                <img src={videoicon} alt="photos" style={{height:'30px', width:'30px', borderRadius:'50%'}} />
                <h3>Video</h3>
            </div>
            <div style={{display:'flex', flexDirection:'row', justifyContent:'center'}}>
                <img src={eventicon} alt="photos" style={{height:'30px', width:'30px', borderRadius:'50%'}} />
                <h3>Events</h3>
            </div>
          </div>
        </div>
        <div style={{height: '100%', width:'50vw', marginTop:'20px', marginBottom:'30px'}}>
            {posts.map((post)=>{
              return(
                <div style={{backgroundColor:'white',borderBottomWidth:'1px', borderBottomStyle:'solid', borderBottomColor:'black', marginBottom:'20px'}}>
                  <div style={{paddingLeft:'20px'}}>
                      <div style={{display:'flex', flexDirection:'row'}}>
                        <img src={profileicon} alt="Icon" style={{height:'80px', width:'80px', borderRadius:'50%', backgroundColor:'gray', marginRight:'20px'}} />
                        <div style={{display:'flex', flexDirection:'column', justifyContent:'center'}}>
                          <h1>{post.username}</h1>
                          <h1>{post.role}</h1>
                        </div>
                      </div>
                      <br />
                      <h1>{post.textPost}</h1>
                    </div>
                    <br />
                    <br />
                    {post.photo && 
                      <div style={{width:'50vw', height:'100%', paddingLeft:'10px', paddingRight:'10px'}}>
                        <img src={sachin} alt="sachin image" style={{width:'100%'}} />
                      </div>
                    }
                    <br />
                    <br />
                </div>
              )
            })}
        </div>
      </div>
    </>
  )
}

export default Middle
