import React, { useCallback, useEffect, useRef, useState } from 'react';
import Janus, { publishToRoom, subscribeRemoteFeed } from 'janus-js-core';
import StreamStatus from './StreamStatus';
import Chat from './Chat';
import { useStreamContext } from '../store';

const StreamSubscriber = () => {
  const { state } = useStreamContext();

  const $video = useRef(null);

  const [playerStatus, setPlayerStatus] = useState('ready');

  const [remoteFeed, setRemoteFeed] = useState(null);

  const handleRemoteFeedCallback = useCallback((_remoteFeed, eventType, data) => {
    setRemoteFeed(_remoteFeed);

    if (eventType === 'onremotestream' && $video.current) {
      Janus.attachMediaStream($video.current, data);

      if (
        _remoteFeed.webrtcStuff.pc.iceConnectionState !== 'completed' &&
        _remoteFeed.webrtcStuff.pc.iceConnectionState !== 'connected'
      ) {
        setPlayerStatus('live');
      }
    } else if (eventType === 'oncleanup') {
      setPlayerStatus('stop');
      // state.janusInstance.destroy();
    } else if (eventType === 'error') {
      setPlayerStatus('error');
    }
  }, []);

  const handlePublishToRoomCallback = useCallback(
    (_sfutest, eventType, data) => {
      switch (eventType) {
        case 'joined':
        case 'publishers': {
          if (data.publishers) {
            const list = data.publishers;
            if (list.length === 0) {
              return;
            }

            const publisher = list[0];
            const { id, display, audio_codec, video_codec } = publisher;

            subscribeRemoteFeed({
              janus: state.janusInstance,
              opaqueId: state.opaqueId,
              room: state.room,
              id,
              pvtId: state.pubPvtId,
              display,
              audio: audio_codec,
              video: video_codec,
              callback: handleRemoteFeedCallback,
            });
          }

          break;
        }
        case 'leaving':
        case 'unpublished': {
          if (remoteFeed !== null) {
            remoteFeed.detach();
          }

          break;
        }
        default:
          break;
      }
    },
    [handleRemoteFeedCallback, state.janusInstance, state.opaqueId, state.pubPvtId, state.room]
  );

  useEffect(() => {
    if (
      !state.janusInstance ||
      !state.chatroomId ||
      !state.pubId ||
      !state.pubPvtId ||
      !state.room
    ) {
      return;
    }

    publishToRoom({
      janus: state.janusInstance,
      opaqueId: state.opaqueId,
      room: state.room,
      secret: null,
      pin: null,
      username: null,
      isPublisher: false,
      callback: handlePublishToRoomCallback,
    });
  }, [
    state.janusInstance,
    state.chatroomId,
    state.opaqueId,
    state.pubPvtId,
    state.pubId,
    handleRemoteFeedCallback,
    state.room,
    handlePublishToRoomCallback,
  ]);

  return (
    <div className="d-flex">
      <div className="flex-item-8 spacing">
        <div className="d-flex flex-column">
          <StreamStatus status={playerStatus}>
            <video
              className="janus-player-video"
              autoPlay
              muted
              playsInline
              controls
              ref={$video}
            />
          </StreamStatus>
        </div>
      </div>
      {!!state.chatroomId && (
        <div className="flex-item-4 spacing">
          <Chat isPublisher={false} />
        </div>
      )}
    </div>
  );
};

export default StreamSubscriber;
