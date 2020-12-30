import React, { useState } from 'react';

const StreamControls = (props) => {
  const {
    isMuted,
    onBandwidthChange,
    onMute,
    onStart,
    onStop,
    onUnmute,
    status: streamStatus,
  } = props;

  const [streamQuality, setStreamQuality] = useState('0');

  const handleStreamQualityChange = (e) => {
    onBandwidthChange(parseInt(e.target.value, 0) * 1000);
    setStreamQuality(e.target.value);
  };

  const streamQualityOptions = [
    {
      label: 'Auto',
      value: '0',
    },
    {
      label: '128 kb',
      value: '128',
    },
    {
      label: '256 kb',
      value: '256',
    },
    {
      label: '512 kb',
      value: '512',
    },
    {
      label: '1 mb',
      value: '1000',
    },
    {
      label: '1.5 mb',
      value: '1500',
    },
    {
      label: '2 mb',
      value: '2000',
    },
  ];

  return (
    <div className="card mt-16">
      <div className="d-flex justify-between align-center">
        <div className="flex-item-auto-grow spacing">
          <label htmlFor="stream-quality">Stream Quality</label>
          <select
            id="stream-quality"
            className="select"
            disabled={streamStatus !== 'live'}
            value={streamQuality}
            onChange={handleStreamQualityChange}
          >
            {streamQualityOptions.map((s) => (
              <option value={s.value} key={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        {streamStatus === 'live' && (
          <div className="flex-item-auto spacing">
            <button onClick={isMuted ? onUnmute : onMute} className="button">
              {isMuted ? 'Unmute' : 'Mute'}
            </button>
          </div>
        )}
        {streamStatus === 'stop' && (
          <div className="flex-item-auto spacing">
            <button className={'button'} onClick={onStart}>
              Start Stream
            </button>
          </div>
        )}
        {streamStatus === 'live' && (
          <div className="flex-item-auto spacing">
            <button className="button" onClick={onStop}>
              Stop Stream
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StreamControls;
