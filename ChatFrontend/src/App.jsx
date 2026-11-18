import { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';

function App() {
  const [connection, setConnection] = useState(null);

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5139/chathub")
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      // Start Connection
      connection.start()
        .then(() => {
          console.log("Ansluten till SignalR!");
          
          // Event Listener
          connection.on("ReceiveMessage", (user, message) => {
            console.log(`Nytt meddelande från ${user}: ${message}`);
          });
        })
        .catch(error => console.error("Kunde inte ansluta: ", error));
    }
  }, [connection]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>SignalR Chat Test</h1>
    </div>
  );
}

export default App;