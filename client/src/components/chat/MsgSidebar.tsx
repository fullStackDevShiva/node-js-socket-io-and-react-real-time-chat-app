import styles from "./styles.module.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MsgSidebar = ({ socket, username, room }) => {
  const [roomUsers, setRoomUsers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    socket.on("chatroom_users", (data) => {
      console.log(data);
      setRoomUsers(data);
    });

    return () => socket.off("chatroom_users");
  }, [socket]);

  const leaveRoom = () => {
    const __createdtime__ = Date.now();
    socket.emit("leave_room", { username, room, __createdtime__ });
    // To redirect to the home page
    navigate("/", { replace: true });
  };

  return (
    <div className={styles.msgSidebarCol}>
      {roomUsers.length > 0 ? (
        <>
          <div className={styles.sideBarTop}>
            <h4 className={styles.roomTitle}>{room}</h4>
          </div>

          <div className={styles.sidebarMid}>
            <div className={styles.userListHeader}>
              <h5 className={styles.headerText}>Users joined</h5>
            </div>
            <ul className={styles.usersList}>
              {roomUsers.map((user) => (
                <li
                  style={{
                    fontWeight: `${
                      user.username === username ? "bold" : "normal"
                    }`,
                  }}
                  key={user.id}
                >
                  {user.username}
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <div className="no-data-msg">
          <p style={{ textAlign: "center" }}>Users not found!</p>
        </div>
      )}
      <div className={styles.msgSidebarBtn}>
        <button className="btn btn-outline" onClick={leaveRoom}>
          Leave
        </button>
      </div>
    </div>
  );
};

export default MsgSidebar;
