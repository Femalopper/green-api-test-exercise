import classNames from "classnames";
import "./Chat.css";
import { useDispatch, useSelector } from "react-redux";
import {
  selectApiTokenInstance,
  selectFormStatus,
  selectIdInstance,
} from "../../store/formSlice";
import axios from "axios";
import {
  selectChatId,
  selectChatStatus,
  selectCurrentMessage,
  selectReceivedMessages,
  selectSentMessages,
  setChatStatus,
  setCurrentMessage,
  setReceivedMessages,
  setSentMessages,
} from "../../store/chatSlice";
import { uniqueId } from "lodash";
import { useEffect, useRef } from "react";

const Chat = () => {
  const idInstance = useSelector(selectIdInstance);
  const apiTokenInstance = useSelector(selectApiTokenInstance);
  const formStatus = useSelector(selectFormStatus);
  const chatId = useSelector(selectChatId);
  const message = useSelector(selectCurrentMessage);
  const sentMessages = useSelector(selectSentMessages);
  const receivedMessages = useSelector(selectReceivedMessages);
  const chatStatus = useSelector(selectChatStatus);
  const chatBody = useRef();
  const lastMes = useRef();
  const dispatch = useDispatch();

  const scrollToBottom = () => {
    if (lastMes.current) {
      console.log(lastMes.current.offsetHeight);
      chatBody.current.scrollTop =
        chatBody.current.scrollHeight + lastMes.current.offsetHeight;
    }
  };

  useEffect(() => {
    const runLoop = () => {
      console.log("run");
      const headers = {
        "Content-Type": "application/json",
      };

      try {
        let response;
        const recF = async () => {
          response = await axios.get(
            `https://api.green-api.com/waInstance${idInstance}/receiveNotification/${apiTokenInstance}`,
            { headers }
          );
          console.log(response);

          let webhookBody;

          if (response.data) {
            webhookBody = response.data.body;
          }
          console.log(response.data);

          if (
            webhookBody &&
            webhookBody.typeWebhook === "incomingMessageReceived"
          ) {
            console.log("incomingMessageReceived");
            const receiptId = response.data.receiptId;
            await axios.delete(
              `https://api.green-api.com/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`,
              { headers },
              response.data.body.receiptId
            );
            dispatch(
              setReceivedMessages(
                response.data.body.messageData.textMessageData.textMessage
              )
            );
          } else if (
            webhookBody &&
            webhookBody.typeWebhook === "outgoingAPIMessageReceived"
          ) {
            const receiptId = response.data.receiptId;
            await axios.delete(
              `https://api.green-api.com/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`,
              { headers },
              response.data.body.receiptId
            );
          } else if (
            webhookBody &&
            webhookBody.typeWebhook === "stateInstanceChanged"
          ) {
            console.log("stateInstanceChanged");
            console.log(`stateInstance=${webhookBody.stateInstance}`);
          } else if (
            webhookBody &&
            webhookBody.typeWebhook === "outgoingMessageStatus"
          ) {
            console.log("outgoingMessageStatus");
            console.log(`status=${webhookBody.status}`);
          } else if (webhookBody && webhookBody.typeWebhook === "deviceInfo") {
            console.log("deviceInfo");
            console.log(`status=${webhookBody.deviceData}`);
          }
          recF();
        };
        recF();
      } catch (e) {
        console.error(e);
      }
    };
    if (chatStatus === "active") {
      runLoop();
    }
  }, [chatStatus]);

  useEffect(() => {
    scrollToBottom();
    if (sentMessages.length === 1) {
      dispatch(setChatStatus("active"));
    }
    if (sentMessages.length > receivedMessages.length) {
      dispatch(setReceivedMessages(null));
    } else if (sentMessages.length < receivedMessages.length) {
      console.log(sentMessages, "k");
      console.log(receivedMessages, "l");
      dispatch(setSentMessages(null));
    }
  }, [sentMessages, receivedMessages]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const headers = {
      "Content-Type": "application/json",
    };

    try {
      await axios.post(
        `https://api.green-api.com/waInstance${idInstance}/sendMessage/${apiTokenInstance}`,
        JSON.stringify({ chatId, message }, null, 4),
        { headers }
      );
      dispatch(setSentMessages(message));
      dispatch(setCurrentMessage(""));
      console.log(sentMessages, "sentm");
    } catch (e) {
      console.log(e);
    }
  };

  const changeHandler = (val) => {
    dispatch(setCurrentMessage(val));
  };

  const mapMessages = () => {
    let counter = 0;
    const messages = [];
    console.log(receivedMessages);
    console.log(sentMessages);
    while (counter < sentMessages.length) {
      if (sentMessages[counter] !== null)
        messages.push(
          <div
            className="w-wat-chat sent"
            key={uniqueId()}
            ref={counter === sentMessages.length - 1 ? lastMes : null}
          >
            <div>
              <p>{sentMessages[counter]}</p>
            </div>
          </div>
        );
      else if (receivedMessages[counter] !== null) {
        messages.push(
          <div
            className="w-wat-chat received"
            key={uniqueId()}
            ref={counter === sentMessages.length - 1 ? lastMes : null}
          >
            <div>
              <p>{receivedMessages[counter]}</p>
            </div>
          </div>
        );
      } else {
        messages.push(null);
      }
      counter += 1;
    }
    return messages;
  };

  return (
    <form
      onSubmit={submitHandler}
      className={classNames("chat-container", {
        hide: formStatus !== "created",
      })}
    >
      <div className="user">
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div className="chat" ref={chatBody}>
        {mapMessages()}
      </div>
      <div className="message">
        <div className="form-group">
          <input
            value={message}
            onChange={(e) => changeHandler(e.target.value)}
            type="text"
            className="form-control message-input"
            id="message"
            placeholder="Введите Сообщение"
            autoFocus
          />
        </div>
      </div>
    </form>
  );
};

export default Chat;