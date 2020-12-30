import { SET_JANUS_INSTANCE, SET_STREAM_STATE } from './actions';

const reducer = (state, action) => {
  switch (action.type) {
    case SET_JANUS_INSTANCE:
      return {
        ...state,
        janusInstance: action.payload,
      };
    case SET_STREAM_STATE:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
