import React, { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";
import Navbar from "../components/navbar";

const API_KEY = import.meta.env.VITE_AI_APP_ID;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading State
  const chatBoxRef = useRef(null);

  const systemPrompt = `
  You are an AI chatbot named Rio, specialized in answering only sports and health-related questions. 
  You are the chat bot for KOTINOS, a sports management app. 
  Make your answers informative and engaging.
  If a user asks about something unrelated, politely tell them you can only answer sports and health questions.
  If user asks who you are, just say you are Rio.
  `;

  const chatSession = model.startChat({
    history: messages.map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.content }],
    })),
  });

  const handleSend = async () => {
    if (!input.trim()) return;
  
    const userMessage = { role: "user", parts: [{ text: input }] };
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setInput("");
    setIsLoading(true); // Show loading animation
  
    try {
      // Ensure the system prompt is included at the start
      const chatHistory = [
        { role: "user", parts: [{ text: systemPrompt }] }, // System prompt as first user message
        ...messages.map((msg) => ({
          role: msg.role,
          parts: [{ text: msg.content }],
        })),
        userMessage, // Append latest user message
      ];
  
      // Create a new chat session
      const chatSession = model.startChat({ history: chatHistory });
  
      const result = await chatSession.sendMessage(input);
      const responseText = result.response.text
        ? await result.response.text()
        : result.response.candidates[0]?.content || "No response";
  
      const botMessage = { role: "model", content: responseText };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetching Gemini response:", error);
      setMessages((prev) => [
        ...prev,
        { role: "model", content: `⚠ Error: ${error.message}` },
      ]);
    } finally {
      setIsLoading(false); // Hide loading animation
    }
  };
  

  useEffect(() => {
    setTimeout(() => {
      if (chatBoxRef.current) {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      }
    }, 100);
  }, [messages, isLoading]);

  return (
    <>
    <Navbar />
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-[#E0F7FA] to-[#BBDEFB]">
      

      {/* Chat Container */}
      <div className="chat-container w-full max-w-3xl h-[85vh] bg-white shadow-xl rounded-2xl border border-gray-200 overflow-hidden flex flex-col backdrop-blur-md bg-opacity-80">
        
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-[#2196F3] to-[#64B5F6] text-white p-5 text-center font-semibold text-lg shadow-md">
          💬 Rio - Your AI Sports Buddy
        </div>

        {/* Chat Messages */}
        <div
          className="flex-1 overflow-y-auto p-5 space-y-3 bg-[#E3F2FD] custom-scrollbar"
          ref={chatBoxRef}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`w-fit max-w-xs p-4 rounded-2xl shadow-md ${
                msg.role === "user"
                  ? "bg-gradient-to-r from-blue-400 to-blue-300 text-white self-end ml-auto"
                  : "bg-gradient-to-r from-[#90CAF9] to-[#64B5F6] text-gray-900 self-start"
              } transform transition-all duration-300 hover:scale-105`}
            >
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          ))}

          {/* Bot Typing Animation */}
          {isLoading && (
            <div style={{width:'20%'}} className="self-start p-4 rounded-2xl bg-gradient-to-r from-[#90CAF9] to-[#64B5F6] text-white flex space-x-1">
              <span className="animate-bounce">●</span>
              <span className="animate-bounce delay-150">●</span>
              <span className="animate-bounce delay-300">●</span>
              <span style={{color:'white', marginLeft:'2%', fontWeight:'bolder', fontSize:'20px'}}>thinking</span>
            </div>
          )}
        </div>

        {/* Quick Response Buttons */}
        <div className="flex justify-center gap-4 p-4 bg-[#E1F5FE] border-t border-gray-300">
          {[
            { text: "⚽ Football Fitness", message: "Tell me about football fitness" },
            { text: "🩹 Injury Recovery", message: "How to recover from a sports injury?" },
            { text: "📰 Sports News", message: "Latest sports news" },
          ].map((btn, idx) => (
            <button
              key={idx}
              onClick={() => setInput(btn.message)}
              className="px-5 py-2 text-white bg-gradient-to-r from-[#1E88E5] to-[#42A5F5] rounded-lg shadow-md hover:scale-110 transition-all duration-300"
            >
              {btn.text}
            </button>
          ))}
        </div>

        {/* Input & Send Button */}
        <div className="flex items-center p-4 bg-[#E1F5FE] border-t border-gray-300">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 p-3 rounded-full border border-gray-400 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1E88E5] shadow-md"
          />
          <button
            onClick={handleSend}
            className="ml-3 bg-gradient-to-r from-[#0D47A1] to-[#1976D2] text-white px-4 py-2 rounded-full shadow-lg hover:scale-110 transition-all duration-300"
          >
            🚀
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default ChatBot;
