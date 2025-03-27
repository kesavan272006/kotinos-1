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
  const [isLoading, setIsLoading] = useState(false);
  const chatBoxRef = useRef(null);

  const systemPrompt = `
  You are an AI chatbot named Rio, specialized in answering only sports and health-related questions. 
  You are the chat bot for Kotinos, a sports management app. 
  Make your answers informative and engaging.
  If a user asks about something unrelated, politely tell them you can only answer sports and health questions. But u may also answer some general questions.
  If user asks who you are, just say you are Rio.
  `;

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", parts: [{ text: input }] };
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setInput("");
    setIsLoading(true);

    try {
      const chatHistory = [
        { role: "user", parts: [{ text: systemPrompt }] },
        ...messages.map((msg) => ({
          role: msg.role,
          parts: [{ text: msg.content }],
        })),
        userMessage,
      ];

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
      setIsLoading(false);
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
      {/* <Navbar /> */}
      <div className="flex flex-col justify-center items-center ">
        {/* Chat Container */}
        <div className="w-full h-[100vh] overflow-hidden flex flex-col backdrop-blur-xl bg-opacity-20">
          {/* Chat Header */}
          <div className="p-5 text-center font-bold text-4xl text-[beige] bg-[#0A0F38]">
            🏆 Rio - Your AI Sports Buddy
          </div>

          {/* Chat Messages */}
          <div
            className="flex-1 flex flex-col items-center overflow-y-auto p-5 space-y-3 bg-[#0A0F38] custom-scrollbar"
            ref={chatBoxRef}
          >
            <div className="md:w-1/2 w-full">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-2xl shadow-lg ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-[#0057D9] to-[#002F6C] text-white self-end ml-auto w-fit"
                      : " text-[beige] w-full"
                  }`}
                >
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ))}
            </div>

            {/* Bot Typing Animation */}
            {isLoading && (
              <div className="self-start p-4 rounded-2xl w-full text-gray-400 animate-pulse">
                <div className="flex w-1/2 ml-7 justify-center items-center space-x-1">
                <span className="animate-bounce">●</span>
                <span className="animate-bounce delay-200">●</span>
                <span className="animate-bounce delay-500">●</span>
                </div>
              </div>
            )}
          </div>

          {/* Input & Send Button */}
          <div className="flex items-center p-4 bg-[#001F54] border-t border-gray-600">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 p-3 rounded-full border border-gray-500 bg-[#002F6C] text-white focus:outline-none focus:ring-2 focus:ring-[#0057D9] shadow-md"
            />
            <button
              onClick={handleSend}
              className="ml-3 bg-gradient-to-r from-[#003B8B] to-[#007BFF] text-white px-4 py-2 rounded-full shadow-lg hover:scale-110 transition-all duration-300"
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
