import React, { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import '../pages/chatbot.css'
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
    <div className="chat-container">
      <div className="chat-header">Rio: Your AI Assistant on Kotinos</div>

      <div className="category-buttons">
      <button onClick={() => setInput("Tell me about football fitness")}>⚽ Football Fitness</button>
      <button onClick={() => setInput("How to recover from a sports injury?")}>🩹 Injury Recovery</button>
      <button onClick={() => setInput("Latest sports news")}>📰 Sports News</button>
      </div> 

      <div className="chat-box" ref={chatBoxRef}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.role === "user" ? "user-message" : "bot-message"}
          >
            {msg.content}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your doubts to Rio..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button className="send-button" onClick={handleSend}>
          <i>➤</i>
        </button>
      </div>
    </div>
  );
};

export default ChatBot;