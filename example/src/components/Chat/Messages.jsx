import React, { useEffect, useRef } from 'react';

const Messages = (props) => {
  const { messages, ...rest } = props;
  const $messages = useRef(null);

  const getFormattedDate = (date) =>
    `${`0${date.getUTCHours()}`.slice(-2)}:${`0${date.getUTCMinutes()}`.slice(
      -2
    )}:${`0${date.getUTCSeconds()}`.slice(-2)}`;

  const getDateString = (messageDate) => {
    const date = messageDate ? new Date(Date.parse(messageDate)) : new Date();

    return getFormattedDate(date);
  };

  useEffect(() => {
    $messages.current.scrollTop = $messages.current.scrollHeight;
  }, [messages]);

  return (
    <>
      <ul className="chat-messages" {...rest} ref={$messages}>
        {messages.map((m) => (
          <li key={m.date + m.data + m.user} className="janus-chat-list-item">
            <small>{getDateString(m.date)}</small>
            <strong>{m.user}:</strong>
            {m.data}
          </li>
        ))}
      </ul>
    </>
  );
};

export default Messages;
