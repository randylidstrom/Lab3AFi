import { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';

function App() {
  const [connection, setConnection] = useState(null);
  
  // Task 3: State to dynamically update the UI without page refreshes
  const [messages, setMessages] = useState([]);
  const [announcements, setAnnouncements] = useState([]); // Task 5: Separate channel for announcement
  
  const [user, setUser] = useState(""); // Task 4: User identification
  const [role, setRole] = useState("Student"); // Task 5: Role managemen
  const [message, setMessage] = useState("");
  const [announcementText, setAnnouncementText] = useState("");

  useEffect(() => {
    // Task 2: Establish connection to the backend
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5139/chathub") 
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      connection.start()
        .then(() => {
          connection.on("ReceiveMessage", (sender, text) => {
            setMessages(prev => {
              const updated = [...prev, { user: sender, text: text }];
              // Task 4: Limit the number of messages (keep the latest 20)
              return updated.slice(-20);
            });
          });

          // Task 5: Listen to the announcement channel
          connection.on("ReceiveAnnouncement", (sender, text) => {
            setAnnouncements(prev => [...prev, { user: sender, text: text }].slice(-20));
          });
        })
        .catch(error => console.error("Could not connect: ", error));
    }
  }, [connection]);

  const sendMessage = async () => {
    // Task 4: Validate input to prevent empty messages
    if (!user.trim() || !message.trim()) return;
    try {
      // Task 2: Send message in real-time
      await connection.invoke("SendMessage", user, message);
      setMessage("");
    } catch (e) {
      console.error(e);
    }
  };

  const sendAnnouncement = async () => {
    if (!user.trim() || !announcementText.trim()) return;
    try {
      // Task 5: Send announcement. The backend has a security check for the "Teacher" role
      await connection.invoke("SendAnnouncement", user, announcementText, role);
      setAnnouncementText("");
    } catch (e) {
      console.error(e);
    }
  };

  // Task 3: Simple user interface in React
  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", maxWidth: "1000px", width: "100%", margin: "0 auto", boxSizing: "border-box" }}>
      <h2>Course Chat & Announcements</h2>
      
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexWrap: "wrap", gap: "8px", marginBottom: "20px", padding: "10px", background: "#f0f0f0" }}>
        <strong>Your profile: </strong>
        <input 
          type="text" 
          placeholder="Your name..." 
          value={user} 
          onChange={e => setUser(e.target.value)} 
          style={{ width: "120px" }}
        />
        {/* Task 5: Predefined roles to choose from */}
        <select value={role} onChange={e => setRole(e.target.value)}>
          <option value="Student">Student</option>
          <option value="Teacher">Teacher</option>
        </select>
      </div>

      <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "20px" }}>
        {/* General Chat */}
        <div style={{ flex: "1 1 320px", minWidth: 0 }}>
          <h3>General Chat</h3>
          <div style={{ border: "1px solid #ccc", padding: "10px", height: "300px", overflowY: "auto", marginBottom: "10px" }}>
            {/* Task 4: Display who sent the message */}
            {/* Task 5: Students can participate in general discussions as usual */}
            {messages.map((m, index) => (
              <div key={index}><strong>{m.user}: </strong> {m.text}</div>
            ))}
          </div>
          <input 
            type="text" 
            placeholder="Type in chat..." 
            value={message} 
            onChange={e => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            style={{ width: "70%", marginRight: "5px" }}
          />
          <button onClick={sendMessage}>Send</button>
        </div>

        {/* Task 5: Separate dedicated announcement channel */}
        <div style={{ flex: "1 1 320px", minWidth: 0, backgroundColor: "#fffbea", padding: "10px", border: "1px solid #ffe58f" }}>
          <h3>Important Announcements</h3>
          <div style={{ height: "300px", overflowY: "auto", marginBottom: "10px" }}>
            {announcements.map((a, index) => (
              <div key={index} style={{ color: "red", marginBottom: "8px" }}><strong>{a.user}: </strong> {a.text}</div>
            ))}
          </div>
          
          {/* Task 5:nly teachers can post announcements. Students can only view them */}
          {role === "Teacher" ? (
            <div>
              <input 
                type="text" 
                placeholder="Write an announcement..." 
                value={announcementText} 
                onChange={e => setAnnouncementText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                style={{ width: "65%", marginRight: "5px" }}
              />
              <button onClick={sendAnnouncement}>Publish</button>
            </div>
          ) : (
            <p style={{ fontSize: "12px", color: "#666" }}>Only teachers can publish announcements.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;