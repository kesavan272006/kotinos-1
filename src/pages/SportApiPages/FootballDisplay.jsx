import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion"; // For animations
const API = "Plnlcb8kGYRYHmhhNw4bIfBPViHoKLrliEF0VjcGfLEx2QJRFMYFgdKcPl4Q";
const API_URL = `https://cors-anywhere.herokuapp.com/https://api.sportmonks.com/v3/football/schedules/teams/83?api_token=${API}`;

const FootballMatches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("upcoming");

  useEffect(() => {
    fetchMatches();
    const interval = setInterval(fetchMatches, 60000); 
    return () => clearInterval(interval);
  }, []);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      if (response.data?.data) {
        setMatches(response.data.data[0]?.fixtures || []);
      }
    } catch (error) {
      console.error("Error fetching matches:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMatches = matches.filter((match) => {
    if (filter === "upcoming") return match.state_id === 1;
    if (filter === "live") return match.state_id === 2;
    if (filter === "finished") return match.state_id === 5;
    return true;
  });

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-6 text-blue-700">⚽ Football Matches</h2>

      {/* Filter Buttons with Animation */}
      <div className="flex justify-center space-x-4 mb-6">
        {["upcoming", "live", "finished"].map((type) => (
          <motion.button
            key={type}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 ${
              filter === type ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setFilter(type)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </motion.button>
        ))}
      </div>

      {loading ? (
        <p className="text-center text-lg font-semibold">Loading matches...</p>
      ) : filteredMatches.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredMatches.map((match, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white shadow-lg rounded-lg p-6 border border-gray-300"
            >
              <h3 className="text-xl font-semibold text-center text-blue-600">{match.name || "Unknown Match"}</h3>

              {/* Teams */}
              <div className="flex items-center justify-between my-4">
                {match.participants.map((team, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <img src={team.image_path} alt={team.name} className="w-14 h-14 object-cover" />
                    <p className="text-sm font-semibold mt-2">{team.name}</p>
                  </div>
                ))}
              </div>

              {/* Match Details */}
              <p className="text-center text-gray-700">
                🏟 {match.venue_id ? `Venue ID: ${match.venue_id}` : "Venue Unavailable"}
              </p>
              <p className="text-center text-gray-700">
                📅 {match.starting_at ? new Date(match.starting_at).toLocaleString() : "N/A"}
              </p>
              <p className="text-center font-bold text-green-600">{match.result_info || "Match Info Unavailable"}</p>

              {/* Scores */}
              {match.scores.length > 0 ? (
                <div className="text-center mt-4">
                  {match.scores.map((score, i) => (
                    <p key={i} className="text-gray-800 font-semibold">
                      {score.participant_id}: {score.score.goals} Goals
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500">No scores available</p>
              )}
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <p className="text-center text-lg font-semibold">No matches available.</p>
      )}
    </div>
  );
};

export default FootballMatches;
