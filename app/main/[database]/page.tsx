import CollectionCard from "@/components/collection-card";
import { TextAnimate } from "@/components/text/SplitText";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { mongoClient } from "@/lib/mongodb";
import { getIronSessionData } from "@/utils/getIronSessionData";

export default async function Page({
  params,
}: {
  params: Promise<{ database: string }>;
}) {
  const uri = await getIronSessionData();

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
    })
  );

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <TextAnimate
        animation="scaleUp"
        by="text"
        once
        className="text-2xl font-bold mb-4">
        {`Database: ${databaseName}`}
      </TextAnimate>
      <div className="mb-4 text-sm">
        <TextAnimate
          animation="scaleUp"
          by="text"
          once>
          Collections
        </TextAnimate>
      </div>

      {collectionsWithStats.length > 0 ? (
        <AnimatedGroup
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full h-full"
          variants={{
            container: {
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.05,
                },
              },
            },
            item: {
              hidden: { opacity: 0, y: 40, filter: "blur(4px)" },
              visible: {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: {
                  duration: 1.2,
                  type: "spring",
                  bounce: 0.3,
                },
              },
            },
          }}>
          {collectionsWithStats.map((c) => (
            <CollectionCard
              key={c.name}
              collectionName={c.name}
              count={c.count}
              dbName={databaseName}
              storageSize={c.storageSize}
            />
          ))}
        </AnimatedGroup>
      ) : (
        <p className="text-neutral-500">
          No collections found in this database.
        </p>
      )}
    </div>
  );
}
