import styles from "./styles.module.css";
import { useState, useEffect, useRef, Fragment } from "react";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

const MsgList = ({ socket, username }) => {
  const [messagesRecieved, setMessagesReceived] = useState([]);
  const messagesColumnRef = useRef(null);

  // Runs whenever a socket event is recieved from the server
  useEffect(() => {
    socket.on("get_message", (data) => {
      console.log(data);
      setMessagesReceived((state) => [
        ...state,
        {
          message: data.message,
          username: data.username,
          __createdtime__: data.__createdtime__,
        },
      ]);
    });
    // To remove event listener on component unmount
    return () => socket.off("get_message");
  }, [socket]);

  // To scroll to the most recent message
  useEffect(() => {
    messagesColumnRef.current.scrollTop =
      messagesColumnRef.current.scrollHeight;
  }, [messagesRecieved]);

  // dd/mm/yyyy, hh:mm:ss
  function formatDateFromTimestamp(timestamp) {
    // time-ago library to format the timestamp
    // To create formatter (English)
    TimeAgo.addLocale(en);
    const timeAgo = new TimeAgo("en-US");
    return timeAgo.format(new Date(timestamp));
  }

  return (
    <div className={styles.messagesColumn} ref={messagesColumnRef}>
      {messagesRecieved?.length > 0 ? (
        <>
          {messagesRecieved.map((msg, i) => (
            <Fragment key={i}>
              {msg?.username === username ? (
                <div
                  className={styles.message}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "right",
                    textAlign: "left",
                    width: "60%",
                    float: "right",
                    alignSelf: "end",
                    backgroundColor: "#ACD793",
                  }}
                >
                  <span className={styles.msgSender} style={{ color: "#fff" }}>
                    You
                  </span>
                  <p className={styles.msgText}>{msg.message}</p>
                  <span className={styles.msgTimestamp}>
                    {formatDateFromTimestamp(msg.__createdtime__)}
                  </span>
                </div>
              ) : msg?.username === "Admin" ? (
                <div className={styles.adminMsg}>
                  <p className={styles.adminMsgText}>{msg.message}</p>
                </div>
              ) : (
                <div
                  className={styles.message}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "left",
                    textAlign: "left",
                    backgroundColor: "transparent",
                    border: "1px solid #dfdfdf",
                    width: "60%",
                    float: "left",
                    alignSelf: "start",
                  }}
                >
                  <span
                    className={styles.msgSender}
                    style={{ color: "#3887BE" }}
                  >
                    {msg.username}
                  </span>
                  <p className={styles.msgText}>{msg.message}</p>
                  <span className={styles.msgTimestamp}>
                    {formatDateFromTimestamp(msg.__createdtime__)}
                  </span>
                </div>
              )}
            </Fragment>
          ))}
        </>
      ) : (
        <div className="no-data-msg">
          <p style={{ textAlign: "center" }}>Messages not found!</p>
        </div>
      )}
    </div>
  );
};

export default MsgList;
