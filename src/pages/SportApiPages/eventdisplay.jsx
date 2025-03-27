import React, { useState, useEffect } from "react";
import axios from "axios";

const CricketMatches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = `https://api.cricapi.com/v1/cricScore?apikey=f9db8b6c-35fe-4c59-b9f9-70ae25d096f5`;

  useEffect(() => {
    fetchMatches();
    const interval = setInterval(fetchMatches, 60000); // Auto-refresh every 60 seconds
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);
  const [upcoming, setUpcoming]=useState(true);
  const [finished, setFinished]=useState(false);
  const fetchMatches = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      if (response.data && response.data.data) {
        const things = response.data;
        setMatches(things.data);
        console.log("data fetched");
      } else {
        console.error("Invalid API response:", response.data);
      }
    } catch (error) {
      console.error("Error fetching matches:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold text-center mb-4">🏏 Live & Upcoming Matches</h2>

      {loading ? (
        <p className="text-center">Loading matches...</p>
      ) : matches.length > 0 ? (
        <>
          <div style={{display:'flex', flexDirection:'row', justifyContent:'space-evenly'}}>
              <button style={{marginRight: '10px', backgroundColor: !finished ? "blue":"rgb(219 234 254)", color: !finished? "white" : "rgb(29 78 216)"}} onClick={()=> setFinished(false)} className="px-4 rounded-full text-sm py-2 transition duration-300">
                  View Upcoming Events
              </button>
              <button style={{backgroundColor: !finished ? "rgb(219 234 254)":"blue", color: !finished? "rgb(29 78 216)" : "white"}} onClick={()=> setFinished(true)} className="px-4 py-2 text-sm rounded-full transition duration-300">
                  View finished Events
              </button>
          </div>
          <br />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {!finished && (
              matches.filter((match)=>match.status==="Match not started").map((match, index) => (
                <div key={index} className="bg-white shadow-lg rounded-lg p-4 border border-gray-200">
                    <h3 className="text-lg font-semibold text-center">{match.series || "Unknown Series"}</h3>
                    
                    {/* Team Logos & Names */}
                    <div className="flex items-center justify-between my-2">
                      <div className="flex flex-col items-center">
                        {match.t1img && <img src={match.t1img} alt={match.t1} className="w-12 h-12" />}
                        <p className="text-sm font-semibold">{match.t1}</p>
                      </div>
                      <p className="text-gray-500 text-sm">vs</p>
                      <div className="flex flex-col items-center">
                        {match.t2img && <img src={match.t2img} alt={match.t2} className="w-12 h-12" />}
                        <p className="text-sm font-semibold">{match.t2}</p>
                      </div>
                    </div>

                    {/* Match Details */}
                    <p className="text-gray-700 text-center">🏏 Match Type: {match.matchType?.toUpperCase()}</p>
                    <p className="text-gray-700 text-center">📅 {match.dateTimeGMT ? new Date(match.dateTimeGMT).toLocaleString() : "N/A"}</p>
                    <p className="text-center font-bold text-blue-600">{match.status || "Match not started"}</p>

                    {/* Scores */}
                    {(match.t1s || match.t2s) ? (
                      <div className="text-center mt-2">
                        <p className="text-gray-800 font-semibold">{match.t1}: {match.t1s || "N/A"}</p>
                        <p className="text-gray-800 font-semibold">{match.t2}: {match.t2s || "N/A"}</p>
                      </div>
                    ) : (
                      <p className="text-center text-gray-500">No scores available</p>
                    )}
                  </div>
              ))
          )}
          {finished && (
              matches.filter((match)=>match.status!=="Match not started").map((match, index) => (
                <div key={index} className="bg-white shadow-lg rounded-lg p-4 border border-gray-200">
                    <h3 className="text-lg font-semibold text-center">{match.series || "Unknown Series"}</h3>
                    
                    {/* Team Logos & Names */}
                    <div className="flex items-center justify-between my-2">
                      <div className="flex flex-col items-center">
                        {match.t1img && <img src={match.t1img} alt={match.t1} className="w-12 h-12" />}
                        <p className="text-sm font-semibold">{match.t1}</p>
                      </div>
                      <p className="text-gray-500 text-sm">vs</p>
                      <div className="flex flex-col items-center">
                        {match.t2img && <img src={match.t2img} alt={match.t2} className="w-12 h-12" />}
                        <p className="text-sm font-semibold">{match.t2}</p>
                      </div>
                    </div>

                    {/* Match Details */}
                    <p className="text-gray-700 text-center">🏏 Match Type: {match.matchType?.toUpperCase()}</p>
                    <p className="text-gray-700 text-center">📅 {match.dateTimeGMT ? new Date(match.dateTimeGMT).toLocaleString() : "N/A"}</p>
                    <p className="text-center font-bold text-blue-600">{match.status || "Match not started"}</p>

                    {/* Scores */}
                    {(match.t1s || match.t2s) ? (
                      <div className="text-center mt-2">
                        <p className="text-gray-800 font-semibold">{match.t1}: {match.t1s || "N/A"}</p>
                        <p className="text-gray-800 font-semibold">{match.t2}: {match.t2s || "N/A"}</p>
                      </div>
                    ) : (
                      <p className="text-center text-gray-500">No scores available</p>
                    )}
                  </div>
              ))
          )}
        </div>
        </>
      ) : (
        <p className="text-center">No upcoming matches available.</p>
      )}
    </div>
  );
};

export default CricketMatches;
