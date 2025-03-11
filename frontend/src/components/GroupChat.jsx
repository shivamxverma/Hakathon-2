import React, { useState, useEffect, useRef } from "react";
// import "../"; 

const GroupChat = () => {
  const [userId, setUserId] = useState("john123");
  const [groupId, setGroupId] = useState("chatroom1");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [ws, setWs] = useState(null);
  const messagesEndRef = useRef(null);

  const connect = () => {
    if (!userId || !groupId) {
      alert("Please enter both User ID and Group ID");
      return;
    }

    if (ws) {
      ws.close();
    }

    const websocket = new WebSocket("ws://localhost:8080", [], {
      headers: {
        Cookie: `userId=${userId}; groupId=${groupId}`,
      },
    });

    websocket.onopen = () => {
      setMessages((prev) => [...prev, "Connected to the server"]);
    };

    websocket.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };

    websocket.onerror = (error) => {
      setMessages((prev) => [...prev, "Error: " + error.message]);
    };

    websocket.onclose = (event) => {
      setMessages((prev) => [
        ...prev,
        `Disconnected: ${event.code} - ${event.reason}`,
      ]);
      setWs(null);
    };

    setWs(websocket);
  };

  // Function to send message
  const sendMessage = () => {
    if (ws && ws.readyState === WebSocket.OPEN && message.trim()) {
      ws.send(message);
      setMessage(""); // Clear input
    } else {
      alert("Not connected or empty message");
    }
  };

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="group-chat">
      <h2>WebSocket Group Chat</h2>
      <div className="connection-form">
        <label>
          User ID:
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            disabled={ws !== null} // Disable input if connected
          />
        </label>
        <label>
          Group ID:
          <input
            type="text"
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
            disabled={ws !== null}
          />
        </label>
        <button onClick={connect} disabled={ws !== null}>
          Connect
        </button>
        <button
          onClick={() => ws?.close()}
          disabled={ws === null}
          className="disconnect-btn"
        >
          Disconnect
        </button>
      </div>

      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            {msg}
          </div>
        ))}
        <div ref={messagesEndRef} /> {/* For scrolling */}
      </div>

      <div className="message-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message"
          disabled={ws === null}
        />
        <button onClick={sendMessage} disabled={ws === null}>
          Send
        </button>
      </div>
    </div>
  );
};

export default GroupChat;