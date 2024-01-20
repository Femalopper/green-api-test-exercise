import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import './Chat.css';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { uniqueId } from 'lodash';
import {
  selectChatId,
  selectCurrentMessage,
  selectReceivedMessages,
  selectSentMessages,
  setCurrentMessage,
  setReceivedMessages,
  setSentMessages,
} from '../../store/chatSlice';
import {
  selectApiTokenInstance,
  selectFormStatus,
  selectIdInstance,
} from '../../store/formSlice';

function Chat() {
  const idInstance = useSelector(selectIdInstance);
  const apiTokenInstance = useSelector(selectApiTokenInstance);
  const formStatus = useSelector(selectFormStatus);
  const chatId = useSelector(selectChatId);
  const message = useSelector(selectCurrentMessage);
  const sentMessages = useSelector(selectSentMessages);
  const receivedMessages = useSelector(selectReceivedMessages);
  const chatBody = useRef();
  const lastMes = useRef();
  const dispatch = useDispatch();

  const scrollToBottom = () => {
    if (lastMes.current) {
      chatBody.current.scrollTop = chatBody.current.scrollHeight + lastMes.current.offsetHeight;
    }
  };

  useEffect(() => {
    if (formStatus === 'created') {
      let response;
      const getNotifications = async () => {
        const headers = {
          'Content-Type': 'application/json',
        };
        response = await axios.get(
          `https://api.green-api.com/waInstance${idInstance}/receiveNotification/${apiTokenInstance}`,
          { headers },
        );
        let webhookBody;
        console.log(response, 'res');
        if (response.data) {
          webhookBody = response.data.body;
        }

        if (
          webhookBody
          && webhookBody.typeWebhook === 'incomingMessageReceived'
        ) {
          const { receiptId } = response.data;
          await axios.delete(
            `https://api.green-api.com/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`,
            { headers },
            response.data.body.receiptId,
          );
          if (response.data.body.senderData.chatId === chatId) {
            dispatch(
              setReceivedMessages(
                response.data.body.messageData.textMessageData.textMessage,
              ),
            );
          }
        } else if (webhookBody && webhookBody.typeWebhook === 'outgoingAPIMessageReceived') {
          const { receiptId } = response.data;
          await axios.delete(
            `https://api.green-api.com/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`,
            { headers },
            response.data.body.receiptId,
          );
          dispatch(
            setSentMessages(
              response.data.body.messageData.extendedTextMessageData.text,
            ),
          );
        } else if (webhookBody && webhookBody.typeWebhook === 'outgoingMessageReceived') {
          const { receiptId } = response.data;
          await axios.delete(
            `https://api.green-api.com/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`,
            { headers },
            response.data.body.receiptId,
          );
        } else if (
          webhookBody
          && webhookBody.typeWebhook === 'stateInstanceChanged'
        ) {
          console.log('stateInstanceChanged');
          console.log(`stateInstance=${webhookBody.stateInstance}`);
        } else if (
          webhookBody
          && webhookBody.typeWebhook === 'outgoingMessageStatus'
        ) {
          console.log('outgoingMessageStatus');
          console.log(`status=${webhookBody.status}`);
        } else if (webhookBody && webhookBody.typeWebhook === 'deviceInfo') {
          console.log('deviceInfo');
          console.log(`status=${webhookBody.deviceData}`);
        }
        getNotifications();
      };
      getNotifications();
    }
  }, [formStatus]);

  useEffect(() => {
    scrollToBottom();
    if (sentMessages.length > receivedMessages.length) {
      dispatch(setReceivedMessages(null));
    } else if (sentMessages.length < receivedMessages.length) {
      dispatch(setSentMessages(null));
    }
  }, [sentMessages, receivedMessages]);

  const submitHandler = async (event) => {
    event.preventDefault();
    const headers = {
      'Content-Type': 'application/json',
    };

    const postMessage = async () => {
      try {
        await axios.post(
          `https://api.green-api.com/waInstance${idInstance}/sendMessage/${apiTokenInstance}`,
          JSON.stringify({ chatId, message }, null, 4),
          { headers },
        );
        dispatch(setCurrentMessage(''));
      } catch (e) {
        console.log(e);
        setTimeout(() => postMessage(), 5000);
      }
    };
    postMessage();
  };

  const changeHandler = (val) => {
    dispatch(setCurrentMessage(val));
  };

  const mapMessages = () => {
    let counter = 0;
    const messages = [];
    while (counter < sentMessages.length) {
      if (sentMessages[counter] !== null) {
        messages.push(
          <div
            className="w-wat-chat sent"
            key={uniqueId()}
            ref={counter === sentMessages.length - 1 ? lastMes : null}
          >
            <div>
              <p>{sentMessages[counter]}</p>
            </div>
          </div>,
        );
      } else if (receivedMessages[counter] !== null) {
        messages.push(
          <div
            className="w-wat-chat received"
            key={uniqueId()}
            ref={counter === sentMessages.length - 1 ? lastMes : null}
          >
            <div>
              <p>{receivedMessages[counter]}</p>
            </div>
          </div>,
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
      className={classNames('chat-container', {
        hide: formStatus !== 'created',
      })}
    >
      <div className="user">
        <div />
        <div />
        <div />
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
            autoComplete="off"
          />
        </div>
      </div>
    </form>
  );
}

export default Chat;
