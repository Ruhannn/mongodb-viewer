export interface BuildInfo {
  version: string;
  gitVersion: string;
  modules: string[];
  allocator: string;
  javascriptEngine: string;
  sysInfo: string;
  versionArray: number[];
  bits: number;
  debug: boolean;
  maxBsonObjectSize: number;
  storageEngines: string[];
  ok: number;
  $clusterTime: ClusterTime;
  operationTime: Time;
}

interface ClusterTime {
  clusterTime: Time;
  signature: Signature;
}

interface Time {
  $timestamp: string;
}

interface Signature {
  hash: string;
  keyId: KeyID;
}

interface KeyID {
  low: number;
  high: number;
  unsigned: boolean;
}
