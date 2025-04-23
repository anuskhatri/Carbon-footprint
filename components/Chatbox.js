import { useState } from "react";

export const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      text: "🤖 Hi there! How can I help you with your carbon footprint today?",
      type: "bot"
    }
  ]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!userInput.trim()) return;

    const newMessages = [
      ...messages,
      { text: userInput, type: "user" },
      { text: "🤖 I'm analyzing your carbon footprint...", type: "bot" }
    ];
    setMessages(newMessages);
    setUserInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userInput })
      });

      const data = await res.json();
      const botReply = data.reply || "🤖 Sorry, I didn't get that.";
      
      setMessages([
        ...newMessages.slice(0, -1), // remove the loading message
        { text: botReply, type: "bot" }
      ]);
    } catch (error) {
      setMessages([
        ...newMessages.slice(0, -1),
        { text: "🤖 Oops! Something went wrong.", type: "bot" }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="flex-1 overflow-y-auto mb-4 space-y-2">
        {messages.map((message, index) => (
          <p
            key={index}
            className={`p-2 rounded ${
              message.type === "bot"
                ? "bg-gray-100 text-gray-800"
                : "bg-green-100 text-green-900 self-end"
            }`}
          >
            {message.text}
          </p>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          placeholder="Ask me about your carbon footprint..."
          className="flex-1 border rounded-l px-3 py-2"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={!userInput.trim() || isLoading}
          className="bg-green-600 text-white px-4 py-2 rounded-r"
        >
          {isLoading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
};
