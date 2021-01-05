import React, { useEffect, useState } from 'react';
import Janus, { publishChatroom, sendChatroomData } from 'janus-js-core';
import Messages from './Messages';
import Form from './Form';
import { setStreamState } from '../../store/actions';
import { useStreamContext } from '../../store';

const Chat = (props) => {
  const { isPublisher } = props;

  const { state, dispatch } = useStreamContext();

  const [chatroomHandler, setChatroomHandler] = useState(null);
  const [messages, setMessages] = useState([]);
  const [recvObj, setRecvObj] = useState(null);

  const handleMessageSend = (message) => {
    if (chatroomHandler) {
      if (message.length !== 0) {
        sendChatroomData({
          chatroomHandler,
          chatroom: state.chatroomId,
          data: JSON.stringify(message),
        });
      }
    }
  };

  useEffect(() => {
    // creating or connecting to chatroom
    // id of connected users should be unique, if they repeat one of opened chats will not work
    publishChatroom({
      janus: state.janusInstance,
      opaqueId: isPublisher ? 'user.id' : Janus.randomString(12),
      isPublisher,
      chatroomId: state.chatroomId,
      username: Janus.randomString(12),
      display: 'user.nickname',
      callback: (_chatroomHandler, eventType, data) => {
        if (eventType === 'created' && isPublisher) {
          dispatch(setStreamState({ chatroomId: data }));
        } else if (eventType === 'joined') {
          setChatroomHandler(_chatroomHandler);
        } else if (eventType === 'ondata') {
          setRecvObj(data);
        }
      },
    });
  }, [state.janusInstance]);

  useEffect(() => {
    if (recvObj !== null) {
      setMessages((prevState) => [...prevState, recvObj]);
    }
  }, [recvObj]);

  useEffect(() => {
    return () => {
      setMessages([]);
    };
  }, []);

  return (
    <div className="card">
      <p>Comments</p>
      <div>
        <Messages messages={messages} />
      </div>
      <Form onSubmit={handleMessageSend} />
    </div>
  );
};

export default Chat;
