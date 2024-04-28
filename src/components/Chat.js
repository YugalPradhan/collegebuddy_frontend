import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../style/chat.css'; // Import your CSS file for styling

const Chat = ({product}) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null); // Assuming user object is stored here
  const chatEndRef = useRef(null); // Reference to the end of the chat container

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`https://collegebuddy-backend-69y1.onrender.com/message/productmessages/${product._id}`, {
          headers: {
            "auth-token": localStorage.getItem('token')
          }
        });
        setMessages(response.data.messages);
        setCurrentUser(response.data.user); // Assuming the user object is included in the response
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [product]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    chatEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async () => {
    try {
      const response = await axios.post(`https://collegebuddy-backend-69y1.onrender.com/message/addmessage/${product._id}`, { text: newMessage }, {
        headers: {
          "auth-token": localStorage.getItem('token')
        }
      });
      console.log('Message sent:', response.data.message);
      // Update the messages state to include the new message
      setMessages([...messages, response.data.message]);
      // Optionally, reset the input field
      setNewMessage('');
      setCurrentUser(response.data.user);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim() !== '') {
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className='heading'>Chat With Seller</div>
      <div className="chat-box">
        {messages.map((message, index) => (
          <div key={index} className={message.sender === currentUser? "outgoing" : "incoming"}>
            <p className='message-sender'>{message.senderName}</p>
            <p>{message.text}</p>
          </div>
        ))}
        <div ref={chatEndRef}></div>
      </div>
      <form className="input-box" onSubmit={handleFormSubmit}>
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => { setNewMessage(e.target.value) }}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
