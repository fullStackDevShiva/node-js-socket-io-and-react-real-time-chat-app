import styles from "./styles.module.css";
import MsgSidebar from "./MsgSidebar";
import MsgEditor from "./MsgEditor";
import MsgList from "./MsgList";

const MsgMain = ({ username, room, socket }) => {
  return (
    <div className={styles.msgRoomContainer}>
      <MsgSidebar socket={socket} username={username} room={room} />

      <div className={styles.msgBody}>
        <MsgList socket={socket} username={username} />
        <MsgEditor socket={socket} username={username} room={room} />
      </div>
    </div>
  );
};

export default MsgMain;
