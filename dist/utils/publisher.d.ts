import { JanusJS } from "../../index";

export function publishToRoom({
  janus,
  opaqueId,
  room,
  secret,
  pin,
  username,
  isPublisher,
  callback,
}: {
  janus: JanusJS.Janus;
  opaqueId: string;
  room?: number;
  secret: string | number;
  pin?: boolean;
  username: string;
  isPublisher: boolean;
  callback: (plugin: JanusJS.PluginHandle, event: string, data: any) => void;
}): any;

export function publishOwnFeed({
  sfutest,
  useAudio,
}: {
  sfutest: JanusJS.PluginHandle;
  useAudio: boolean;
}): void;

export function unPublishOwnFeed(sfutest: JanusJS.PluginHandle): void;

declare namespace _default {
  export { publishToRoom };
  export { publishOwnFeed };
  export { unPublishOwnFeed };
}
export default _default;
