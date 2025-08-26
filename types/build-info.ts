export type BuildInfo = {
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
};

type ClusterTime = {
  clusterTime: Time;
  signature: Signature;
};

type Time = {
  $timestamp: string;
};

type Signature = {
  hash: string;
  keyId: KeyID;
};

type KeyID = {
  low: number;
  high: number;
  unsigned: boolean;
};
