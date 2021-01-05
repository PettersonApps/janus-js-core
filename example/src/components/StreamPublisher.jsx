import React, { useCallback, useEffect, useRef, useState } from 'react';
import StreamControls from './StreamControls';
import StreamStatus from './StreamStatus';
import Chat from './Chat';
import { useStreamContext } from '../store';

import Janus, { publishToRoom, unPublishOwnFeed, publishOwnFeed } from 'janus-js-core';
import { setStreamState } from '../store/actions';

const StreamPublisher = () => {
  const { state, dispatch } = useStreamContext();

  const $video = useRef(null); // ref to video element for media stream

  const [playerStatus, setPlayerStatus] = useState('ready');

  const [isMuted, setIsMuted] = useState(false);
  const [sfutest, setSfuTest] = useState(null);

  const handleStartClick = () => {
    if (sfutest) {
      publishOwnFeed({ sfutest, useAudio: true });
    }
  };

  const handleStopClick = () => {
    if (sfutest) {
      unPublishOwnFeed(sfutest);
    }
  };

  const handleMuteClick = () => {
    if (!sfutest.isAudioMuted()) {
      sfutest.muteAudio();
    }
    setIsMuted(sfutest.isAudioMuted());
  };

  const handleUnMuteClick = () => {
    if (sfutest.isAudioMuted()) {
      sfutest.unmuteAudio();
    }
    setIsMuted(sfutest.isAudioMuted());
  };

  const handleBandwidthChange = (bitrate) => {
    sfutest.send({ message: { request: 'configure', bitrate } });
  };

  const handlePublishToRoomCallback = useCallback(
    (_sfutest, eventType, data) => {
      setSfuTest(_sfutest);

      switch (eventType) {
        case 'created': {
          dispatch(setStreamState({ room: data.room }));

          break;
        }
        case 'joined': {
          const { id, private_id } = data;
          dispatch(setStreamState({ pubId: id, pubPvtId: private_id }));

          setPlayerStatus('stop');

          break;
        }
        case 'onlocalstream': {
          Janus.attachMediaStream($video.current, data);
          if (
            _sfutest.webrtcStuff.pc.iceConnectionState !== 'completed' &&
            _sfutest.webrtcStuff.pc.iceConnectionState !== 'connected'
          ) {
            setPlayerStatus('live');
          }

          break;
        }
        case 'oncleanup': {
          setPlayerStatus('stop');
          // use in production mode, will cause problem when publisher and viewer in one page like in demo
          // state.janusInstance.destroy();
          setIsMuted(false);

          break;
        }
        case 'error': {
          setPlayerStatus('error');
          setIsMuted(false);
          break;
        }
        default:
          break;
      }
    },
    [dispatch]
  );

  useEffect(() => {
    if (state.janusInstance)
      // creating videoroom
      publishToRoom({
        janus: state.janusInstance,
        opaqueId: 'user.id',
        room: undefined,
        secret: 'user.id',
        pin: undefined,
        username: 'user.nickname',
        isPublisher: true,
        callback: handlePublishToRoomCallback,
      });
  }, [handlePublishToRoomCallback, state.janusInstance]);

  return (
    <div className="d-flex">
      <div className="flex-item-8 spacing">
        <div className="d-flex flex-column">
          <StreamStatus status={playerStatus}>
            <video className="janus-player-video" autoPlay playsInline ref={$video} muted />
          </StreamStatus>
          <StreamControls
            status={playerStatus}
            onBandwidthChange={handleBandwidthChange}
            onStop={handleStopClick}
            onMute={handleMuteClick}
            onUnmute={handleUnMuteClick}
            isMuted={isMuted}
            onStart={handleStartClick}
          />
        </div>
      </div>
      <div className="flex-item-4 spacing">
        <Chat isPublisher />
      </div>
    </div>
  );
};

export default StreamPublisher;
