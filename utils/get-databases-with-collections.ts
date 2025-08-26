import { mongoClient } from "@/lib/mongodb";

export async function getDatabasesWithCollections(url: string) {
  const client = await mongoClient(url);
  const adminDb = client.db().admin();

  const { databases, totalSize } = await adminDb.listDatabases();

  const dbs = await Promise.all(
    databases.map(async (d) => {
      const db = client.db(d.name);
      const collections = await db.listCollections().toArray();
      return {
        name: d.name,
        sizeOnDisk: d.sizeOnDisk ?? 0,
        collections: collections.map(c => c.name).join(", ") || "—",
      };
    }),
  );

  return { databases: dbs, totalSize };
}
