const SET_JANUS_INSTANCE = 'SET_JANUS_INSTANCE';
const SET_STREAM_STATE = 'SET_STREAM_STATE';

const setJanusInstance = (payload) => ({
  type: SET_JANUS_INSTANCE,
  payload,
});

const setStreamState = (payload) => ({
  type: SET_STREAM_STATE,
  payload,
});

export { SET_JANUS_INSTANCE, SET_STREAM_STATE, setJanusInstance, setStreamState };
