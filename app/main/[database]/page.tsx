import { cookies } from "next/headers";
import Link from "next/link";
import prettyBytes from "pretty-bytes";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { mongoClient } from "@/lib/mongodb";

export default async function Page({
  params,
}: {
  params: Promise<{ database: string }>;
}) {
  const cookieStore = cookies();
  const uri = (await cookieStore).get("mongoURI")?.value;

  if (!uri) {
    return <p>no uri</p>;
  }
  const databaseName = (await params).database;
  const client = await mongoClient(uri);
  const db = client.db(databaseName);
  const collections = await db.listCollections().toArray();

  const collectionsWithStats = await Promise.all(
    collections.map(async (c) => {
      const stats = await db.command({ collStats: c.name });
      return {
        name: c.name,
        count: stats.count,
        size: stats.size,
        storageSize: stats.storageSize,
      };
    }),
  );

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Database: {databaseName}</h1>
      <div className="mb-4 text-sm">
        <p>Collections</p>
      </div>

      {collectionsWithStats.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full h-full">
          {collectionsWithStats.map((c) => (
            <Link key={c.name} href={`/main/${databaseName}/${c.name}`}>
              <Card className="group flex flex-col justify-between h-full transition-all hover:shadow-md hover:border-primary">
                <CardHeader className="font-medium text-base">
                  {c.name}
                </CardHeader>
                <CardContent className="space-y-1">
                  <div className="text-xs text-muted-foreground">
                    Documents: {c.count}
                  </div>
                  <div className="text-sm font-medium">
                    Storage: {prettyBytes(c.storageSize)}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-neutral-500">
          No collections found in this database.
        </p>
      )}
    </div>
  );
}
