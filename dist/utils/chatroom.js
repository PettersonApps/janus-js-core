import Janus from '../index';

export function publishChatroom({
  janus,
  opaqueId,
  isPublisher,
  chatroomId,
  username,
  display,
  callback,
}) {
  let chatroomHandler;

  if (!janus) {
    return;
  }

  janus.attach({
    plugin: 'janus.plugin.textroom',
    opaqueId,
    success(pluginHandle) {
      chatroomHandler = pluginHandle;
      Janus.log('Plugin attached! (' + chatroomHandler.getPlugin() + ', id=' + chatroomHandler.getId() + ')');

      const body = { request: 'setup' };
      chatroomHandler.send({ message: body });
    },
    error(error) {
      Janus.error('  -- Error attaching plugin...', error);
    },
    webrtcState(on) {
      Janus.log('Janus says our WebRTC PeerConnection is ' + (on ? 'up' : 'down') + ' now');
    },
    onmessage(msg, jsep) {
      Janus.debug(' ::: Got a message :::');
      Janus.debug(msg);
      if (msg.error) {
        Janus.error(' ::: Got an error :::', msg.error)
      }
      if (jsep) {
        // Answer
        chatroomHandler.createAnswer({
          jsep,
          media: { audio: false, video: false, data: true }, // We only use datachannels
          success(jsep) {
            Janus.debug('Got SDP!');
            Janus.debug(jsep);
            const request = { request: 'ack' };
            chatroomHandler.send({ message: request, jsep });
          },
          error(error) {
            Janus.error('WebRTC error:', error);
          },
        });
      }
    },
    ondataopen(data) {
      Janus.log('The DataChannel is available!',data);
      if (isPublisher) {
        const request = {
          request: 'create',
        };
        chatroomHandler.send({
          message: request,
          success: (data) => {
            const roomId = data.room;

            callback(chatroomHandler, 'created', roomId);

            const request = {
              textroom: 'join',
              transaction: Janus.randomString(12),
              room: roomId,
              username,
              display,
            };
            chatroomHandler.data({
              text: JSON.stringify(request),
              success: (data) => {
                callback(chatroomHandler, 'joined', data);
              },
            });
          },
        });
      } else {
        const request = {
          textroom: 'join',
          transaction: Janus.randomString(12),
          room: chatroomId,
          username,
          display,
        };
        chatroomHandler.data({
          text: JSON.stringify(request),
          success: (data) => {
            callback(chatroomHandler, 'joined', data);
          },
        });
      }
    },
    ondata(data) {
      Janus.debug('We got data from the DataChannel! ');

      const json = JSON.parse(data);
      const event = json.textroom;

      if (event === 'message') {
        const msg = {
          user: json.from,
          date: json.date,
          data: json.text,
        };
        callback(chatroomHandler, 'ondata', msg);
      } else if (event === 'announcement') {
        callback(chatroomHandler, 'announcement', json);
      } else if (event === 'join') {
        callback(chatroomHandler, 'join', json);
      } else if (event === 'leave') {
        callback(chatroomHandler, 'leave', json);
      } else if (event === 'kicked') {
        callback(chatroomHandler, 'kicked', json);
      } else if (event === 'destroyed') {
        callback(chatroomHandler, 'destroyed', json);
      }
    },
    oncleanup() {
      Janus.log(' ::: Got a cleanup notification :::');
    },
  });
}

export function sendChatroomData({chatroomHandler, chatroom, data}) {
  const message = {
    textroom: 'message',
    transaction: Janus.randomString(12),
    room: chatroom,
    text: data,
    ack: false,
  };
  // Note: messages are always acknowledged by default. This means that you'll
  // always receive a confirmation back that the message has been received by the
  // server and forwarded to the recipients. If you do not want this to happen,
  // just add an ack:false property to the message above, and server won't send
  // you a response (meaning you just have to hope it succeeded).
  chatroomHandler.data({
    text: JSON.stringify(message),
    error(reason) {
      Janus.log(' ::: Error sending data :::', reason);
    },
    success() {},
  });
}

export default {
  publishChatroom,
  sendChatroomData
}