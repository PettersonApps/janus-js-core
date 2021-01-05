import React, { useCallback, useEffect, useState } from 'react';
import { useStreamContext } from '../store';
import Janus from 'janus-js-core';
import { setJanusInstance } from '../store/actions';
import Loader from './Loader';

const StreamWrapper = ({ children }) => {
  const { state, dispatch } = useStreamContext();

  const [errorMessage, setErrorMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // initialize janus func
  const handleJanusInit = useCallback(() => {
    Janus.init({
      debug: false,
      callback() {
        if (!Janus.isWebrtcSupported()) {
          return;
        }

        const janus = new Janus({
          server: process.env.REACT_APP_LIVE_STREAM_API_URL, // server url
          token: state.streamToken,
          iceServers: [
            {
              urls: 'turn:stun.l.google.com:19302',
              username: 'janususer',
              credential: 'januspwd',
            },
          ],
          success() {
            dispatch(setJanusInstance(janus)); // set janus to store for future usage

            setIsLoading(false);
          },
          error(error) {
            Janus.error(error);
            // janus.destroy();

            setIsError(true);
            setErrorMessage(error);
            setIsLoading(false);
            dispatch(setJanusInstance(null));
          },
          destroyed() {
            dispatch(setJanusInstance(null));
          },
        });
      },
    });
  }, [dispatch, state.streamToken]);

  // init janus
  useEffect(() => {
    if (state.streamToken) {
      handleJanusInit();
    }
  }, [state.streamToken, handleJanusInit]);

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <h2
        style={{
          color: 'red',
        }}
      >
        {errorMessage || 'Something went wrong'}
      </h2>
    );
  }

  return <div>{children}</div>;
};

export default StreamWrapper;
