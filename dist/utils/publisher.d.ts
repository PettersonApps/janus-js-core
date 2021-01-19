import { JanusJS } from "../index";

export function publishToRoom({
  janus,
  opaqueId,
  room,
  secret,
  pin,
  username,
  isPublisher,
  rec_dir,
  callback
}: {
  janus: JanusJS.Janus;
  opaqueId: string;
  room?: number;
  secret: string | number;
  pin?: boolean;
  username: string;
  isPublisher: boolean;
  rec_dir?: string;
  callback: (plugin: JanusJS.PluginHandle, event: string, data: any) => void;
}): any;

export function publishOwnFeed({
  sfutest,
  useAudio,
  record,
  filename
}: {
  sfutest: JanusJS.PluginHandle;
  useAudio: boolean;
  record?: boolean;
  filename?: string;
}): void;

export function unPublishOwnFeed(sfutest: JanusJS.PluginHandle): void;

declare namespace _default {
  export { publishToRoom };
  export { publishOwnFeed };
  export { unPublishOwnFeed };
}
export default _default;
