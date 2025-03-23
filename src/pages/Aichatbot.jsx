import React, { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import '../pages/chatbot.css'
import ReactMarkdown from 'react-markdown';
const API_KEY = import.meta.env.VITE_AI_APP_ID;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatBoxRef = useRef(null);
  
  const systemPrompt = `
  You are an AI chatbot named Rio, specialized in answering only sports and health-related questions. 
  You work for a sports content website called KOTINOS. 
  You have expert-level knowledge in:
  - Football, basketball, cricket, tennis, and other popular sports.
  - Fitness, diet, nutrition, and mental well-being.
  - Sports science and athlete performance.
  - Injury prevention and recovery.
  If a user asks about something unrelated, politely tell them you can only answer sports and health questions.

  You should response like friendly and don't elaborate widly, just answer like sensior and in a way to understanding easily.
  If user ask who are you, just say your are Rio.
  `;
  
  // Store the chat session
  const chatSession = model.startChat({
    history: messages.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.content }]
    }))
  });
  
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      // Corrected history order
      const chatHistory = [
        { role: "system", parts: [{ text: systemPrompt }] },
        ...messages.map((msg) => ({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }],
        })),
      ];

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
        { role: "model", content: `⚠ Error: ${error.message}`},
      ]);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      if (chatBoxRef.current) {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      }
    }, 100);
  }, [messages]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-white">
        <div className="chat-container w-full max-w-4xl h-5/6 bg-white rounded-lg shadow-xl border">
          <div className="chat-header bg-blue-500 text-white text-center p-5 font-semibold text-lg">
            Rio: Your AI Assistant on Kotinos
          </div>

          <div className="category-buttons flex justify-center gap-5 p-4 bg-gray-100 rounded-b-lg">
            <button
              onClick={() => setInput("Tell me about football fitness")}
              className="px-4 py-2 text-blue-500 bg-white border border-blue-500 rounded-full shadow-sm hover:bg-blue-500 hover:text-white transition"
            >
              ⚽ Football Fitness
            </button>
            <button
              onClick={() => setInput("How to recover from a sports injury?")}
              className="px-4 py-2 text-blue-500 bg-white border border-blue-500 rounded-full shadow-sm hover:bg-blue-500 hover:text-white transition"
            >
              🩹 Injury Recovery
            </button>
            <button
              onClick={() => setInput("Latest sports news")}
              className="px-4 py-2 text-blue-500 bg-white border border-blue-500 rounded-full shadow-sm hover:bg-blue-500 hover:text-white transition"
            >
              📰 Sports News
            </button>
          </div>

          <div
            className="chat-box flex-1 overflow-y-auto p-6 bg-gray-50"
            ref={chatBoxRef}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-xs p-4 rounded-xl shadow-md mb-4 ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white self-end"
                    : "bg-gray-200 text-gray-800 self-start"
                }`}
              >
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            ))}
          </div>

          <div className="input-container flex items-center p-4 bg-gray-100 border-t border-gray-300">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your doubts to Rio..."
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 p-3 rounded-l-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
        onClick={handleSend}
        className="
          send-button 
          px-6 py-3 
          bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 
          text-gray-700 
          font-semibold 
          rounded-full 
          shadow-md 
          hover:shadow-lg 
          hover:scale-105 
          hover:bg-gradient-to-r hover:from-gray-300 hover:via-gray-400 hover:to-gray-500 
          transform 
          transition-all 
          duration-300 
          ease-in-out
        "
      >
        ➤
      </button>


          </div>
        </div>
      </div>

        );
      };

export default ChatBot;