import Janus from '../index';

export function publishToRoom({
  janus,
  opaqueId,
  room,
  secret,
  pin,
  username,
  isPublisher,
  callback,
  rec_dir
}) {
  let sfutest = null;
  let mystream = null;

  if (!janus) {
    return;
  }

  janus.attach({
    plugin: 'janus.plugin.videoroom',
    opaqueId,
    success(pluginHandle) {
      sfutest = pluginHandle;
      // if room is available
      if (isPublisher) {
        const create = {
          request: 'create',
          notify_joining: true,
          room,
          secret,
          pin,
          rec_dir
        };
        // send message to create new room
        sfutest.send({
          message: create,
          success: (data) => {
            // check if room create is okay
            if (data.videoroom && data.videoroom === 'created') {
              // now register ourselves

              const register = {
                request: 'join',
                room: data.room,
                ptype: 'publisher',
                display: username,
              };
              sfutest.send({ message: register });

              callback(sfutest, 'created', data);
            }
          },
          error: (error) => {
            Janus.log(`Error creating room ${error}`);
          },
        });
      } else {
        const register = {
          request: 'join',
          room,
          ptype: 'publisher',
          display: username || '',
        };
        sfutest.send({ message: register });
      }
    },
    error(error) {
      Janus.log('  -- Error attaching plugin...', error);
      callback(sfutest, 'error', error);
    },
    consentDialog(on) {
      Janus.debug('Consent dialog should be ' + (on ? 'on' : 'off') + ' now');
    },
    mediaState(medium, on) {
      Janus.log('Janus ' + (on ? 'started' : 'stopped') + ' receiving our ' + medium);
    },
    webrtcState(on) {
      Janus.log('Janus says our WebRTC PeerConnection is ' + (on ? 'up' : 'down') + ' now');
    },
    onmessage(msg, jsep) {
      Janus.debug(' ::: Got a message (publisher) :::');
      Janus.debug(msg);

      Janus.log('Got message', msg);

      const event = msg.videoroom;
      if (event) {
        if (event === 'joined') {
          callback(sfutest, 'joined', msg);
        } else if (event === 'destroyed') {
          Janus.warn('The room has been destroyed!');
          callback(sfutest, 'destroyed', event);
        } else if (event === 'event') {
          if (msg.error !== undefined && msg.error !== null) {
            callback(sfutest, 'error', msg);
          } else if (msg.publishers !== undefined && msg.publishers !== null) {
            callback(sfutest, 'publishers', msg);
          } else if (msg.leaving !== undefined && msg.leaving !== null) {
            callback(sfutest, 'leaving', msg);
          } else if (msg.unpublished !== undefined && msg.unpublished !== null) {
            callback(sfutest, 'unpublished', msg);
          }
        }
      }

      if (jsep) {
        Janus.debug('Handling SDP as well...');
        Janus.debug(jsep);
        sfutest.handleRemoteJsep({ jsep });
        // Check if any of the media we wanted to publish has
        // been rejected (e.g., wrong or unsupported codec)
        const audio = msg.audio_codec;
        if (
          mystream &&
          mystream.getAudioTracks() &&
          mystream.getAudioTracks().length > 0 &&
          !audio
        ) {
          // Audio has been rejected
          Janus.log("Our audio stream has been rejected, viewers won't hear us");
        }
        const video = msg.video_codec;
        if (
          mystream &&
          mystream.getVideoTracks() &&
          mystream.getVideoTracks().length > 0 &&
          !video
        ) {
          Janus.log("Our video stream has been rejected, viewers won't see us");
        }
      }
    },
    onlocalstream(stream) {
      Janus.debug(' ::: Got a local stream :::');
      mystream = stream;
      callback(sfutest, 'onlocalstream', stream);
    },
    onremotestream() {
      // The publisher stream is sendonly, we don't expect anything here
    },
    oncleanup() {
      Janus.log(' ::: Got a cleanup notification: we are unpublished now :::');
      callback(sfutest, 'oncleanup');
    },
  });

  return sfutest;
}

export function publishOwnFeed({sfutest, useAudio, record, filename}) {
  // Publish our stream
  sfutest.createOffer({
    // Add data:true here if you want to publish datachannels as well
    media: { audioRecv: false, videoRecv: false, data: true, audioSend: useAudio, videoSend: true },
    simulcast: false,
    success(jsep) {
      Janus.debug('Got publisher SDP!');
      Janus.debug(jsep);

      const publish = {
        request: 'configure',
        audio: useAudio,
        video: true,
        audiocodec: 'opus',
        videocodec: 'vp8',
        record,
        filename
      };
      sfutest.send({ message: publish, jsep });
    },
    error(error) {
      Janus.error('WebRTC error:', error);
      if (useAudio) {
        publishOwnFeed(sfutest, false);
      } else {
        Janus.log(`Error publishing feed: ${error}`);
      }
    },
  });
}

export function unPublishOwnFeed(sfutest) {
  // Unpublish our stream
  const unpublish = { request: 'unpublish' };
  sfutest.send({ message: unpublish });
}

export default {
  publishToRoom,
  publishOwnFeed,
  unPublishOwnFeed
}
