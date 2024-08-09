import styles from "./styles.module.css";
import { useNavigate } from "react-router-dom"; // Add this

const MsgLogin = ({ username, setUsername, room, setRoom, socket }) => {
  const navigate = useNavigate(); // Add this

  const joinRoom = () => {
    if (room !== "" && username !== "") {
      socket.emit("join_room", { username, room });
    }

    // Redirect to /chat
    navigate("/chat", { replace: true });
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h1>Join a chat room</h1>

        <input
          className={styles.inputField}
          placeholder="Username..."
          onChange={(e) => setUsername(e.target.value)}
        />
        <select
          className={styles.inputField}
          onChange={(e) => setRoom(e.target.value)}
        >
          <option>-- Select Room --</option>
          <option value="Development">Development</option>
          <option value="Testing">Testing</option>
          <option value="Product">Product</option>
          <option value="Support">Support</option>
        </select>

        <button
          className="btn btn-secondary"
          style={{ width: "100%" }}
          onClick={joinRoom}
        >
          Join Room
        </button>
      </div>
    </div>
  );
};

export default MsgLogin;
