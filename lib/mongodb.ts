import { MongoClient } from "mongodb";

let client: MongoClient;

export async function mongoClient(url: string): Promise<MongoClient> {
  if (!client) {
    client = new MongoClient(url);
    await client.connect();
  }
  return client;
}
