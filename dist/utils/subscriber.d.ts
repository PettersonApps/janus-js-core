import { JanusJS } from "../index";

export default function subscribeRemoteFeed({
  janus,
  opaqueId,
  room,
  id,
  pvtId,
  video,
  callback,
}: {
  janus: JanusJS.Janus;
  opaqueId: string;
  room: number;
  id: string | number;
  pvtId: number;
  video: any;
  callback: (plugin: JanusJS.PluginHandle, event: string, data: any) => void;
}): any;
