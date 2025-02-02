'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Chat({ userName }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState(null);
  const [groupID, setGroupID] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem("session"));
    if (session) {
      setUser(session);
    } else {
      router.push("/login");
    }
  }, []);

  useEffect(() => {
    const queryGroupID = router.query.groupID;
    setGroupID(queryGroupID || null);
    fetchMessages(queryGroupID);
  }, [router.query.groupID]);

  const fetchMessages = async (groupID) => {
    try {
      const res = await fetch(`/api/chat/messages${groupID ? `?groupID=${groupID}` : ''}`);
      if (!res.ok) {
        throw new Error('Failed to fetch messages');
      }
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const res = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender: user?.fullName, content: newMessage, groupID }) // Ensure sender is defined
      });
      if (!res.ok) {
        let errorData;
        try {
          errorData = await res.json();
        } catch (jsonError) {
          console.error('Error parsing error response:', jsonError);
          throw new Error('Failed to send message');
        }
        console.error('Error response from server:', errorData);
        throw new Error(errorData.message || 'Failed to send message');
      }
      const data = await res.json();
      setMessages([...messages, data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen p-5 bg-gray-100">
      <h1 className="text-2xl font-bold text-center mb-4">Chat Room</h1>
      <div>
        <p>Sender: {userName}</p>
      </div>
      <div className="flex-1 overflow-y-auto bg-white shadow p-4 rounded">
        {messages.length === 0 ? (
          <p>No message found</p>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === user?.fullName ? "justify-end" : "justify-start"}`}>
              <div
              className={`mb-2 p-2 rounded max-w-xs ${
                msg.sender === user?.fullName ? "bg-green-200" : "bg-blue-200"
              }`}
              >
                <strong>{msg.sender}:</strong> {msg.content}
                <div className="text-xs text-gray-500">{new Date(msg.createdAt).toLocaleString()}</div>
                </div>
            </div>
          ))
        )}
      </div>
      <div className="flex mt-4">
        <textarea
          className="flex-1 p-2 border rounded mr-2"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={3}
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-2 rounded">Send</button>
      </div>
    </div>
  );
}
