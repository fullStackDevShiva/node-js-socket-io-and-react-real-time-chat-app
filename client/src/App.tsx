import { useState } from "react";
import MsgLogin from "./components/home/MsgLogin";
import MsgMain from "./components/chat/MsgMain";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import io from "socket.io-client";

const socket = io.connect("http://localhost:5000");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");

  return (
    <Router>
      <div className="App appContainer">
        <Routes>
          <Route
            path="/"
            element={
              <MsgLogin
                username={username}
                setUsername={setUsername}
                room={room}
                setRoom={setRoom}
                socket={socket}
              />
            }
          />
          <Route
            path="/chat"
            element={
              <MsgMain username={username} room={room} socket={socket} />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
