import Janus from '../index';

export default function subscribeRemoteFeed({
  janus,
  opaqueId,
  room,
  id,
  pvtId,
  video,
  callback,
}) {
  let remoteFeed = null;

  janus.attach({
    plugin: 'janus.plugin.videoroom',
    opaqueId,
    success(pluginHandle) {
      remoteFeed = pluginHandle;
      remoteFeed.simulcastStarted = false;
      Janus.log("Plugin attached! (" + remoteFeed.getPlugin() + ", id=" + remoteFeed.getId() + ")");
      Janus.log("  -- This is a subscriber");

      const subscribe = {
        request: 'join',
        room,
        ptype: 'subscriber',
        feed: id,
        private_id: pvtId,
        data: true,
      };

      if (
        Janus.webRTCAdapter.browserDetails.browser === 'safari' &&
        (video === 'vp9' || (video === 'vp8' && !Janus.safariVp8))
      ) {
        if (video) video = video.toUpperCase();
        subscribe.offer_video = false;
      }
      remoteFeed.videoCodec = video;
      remoteFeed.send({ message: subscribe });
    },
    error(error) {
      Janus.error('  -- Error attaching plugin...', error);
      callback(remoteFeed, 'error', error);
    },
    onmessage(msg, jsep) {
      Janus.debug(' ::: Got a message (subscriber) :::');
      Janus.debug(msg);

      if (jsep !== undefined && jsep !== null) {
        Janus.debug('SUBS: Handling SDP as well...');
        Janus.debug(jsep);
        // Answer and attach
        remoteFeed.createAnswer({
          jsep,
          // Add data:true here if you want to subscribe to datachannels as well
          // (obviously only works if the publisher offered them in the first place)
          media: { audioSend: false, videoSend: false }, // We want recvonly audio/video
          success(jsep) {
            Janus.debug('Got SDP!');
            Janus.debug(jsep);
            const body = { request: 'start', room };
            remoteFeed.send({ message: body, jsep });
          },
          error(error) {
            Janus.error('WebRTC error:', error);
          },
        });
      }
    },
    webrtcState(on) {
      Janus.log(remoteFeed);
      Janus.log('Janus says this WebRTC PeerConnection (feed #' + remoteFeed.id + ') is ' + (on ? 'up' : 'down') + ' now');
    },
    onlocalstream() {
      // The subscriber stream is recvonly, we don't expect anything here
    },
    onremotestream(stream) {
      callback(remoteFeed, 'onremotestream', stream);
    },
    oncleanup() {
      callback(remoteFeed, 'oncleanup');
    },
  });
  return remoteFeed;
}
