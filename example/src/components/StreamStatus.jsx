import React from 'react';

const StreamStatus = (props) => {
  const { children, status: streamStatus } = props;

  return (
    <div
      className={
        streamStatus === 'live' || streamStatus === 'error' ? 'stream-status-root' : 'hidden'
      }
    >
      <div className="stream-status-badge-root">
        <span className="stream-status-badge">{streamStatus}</span>
      </div>
      {children}
    </div>
  );
};
export default StreamStatus;
