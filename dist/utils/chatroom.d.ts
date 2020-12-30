import { JanusJS } from "../../index";

export function publishChatroom({
  janus,
  opaqueId,
  isPublisher,
  chatroomId,
  username,
  display,
  callback,
}: {
  janus: JanusJS.Janus;
  opaqueId: string;
  isPublisher: boolean;
  chatroomId: number;
  username: string;
  display: string;
  callback: (plugin: JanusJS.PluginHandle, event: string, data: any) => void;
}): void;

export function sendChatroomData({
  chatroomHandler,
  chatroom,
  data,
}: {
  chatroomHandler: JanusJS.PluginHandle;
  chatroom: number;
  data: string;
}): void;

declare namespace _default {
  export { publishChatroom };
  export { sendChatroomData };
}

export default _default;
