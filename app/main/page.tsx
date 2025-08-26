import prettyBytes from "pretty-bytes";

import type { BuildInfo } from "@/types/build-info";

import BuildInfoC from "@/components/build-info";
import DbCard from "@/components/db-card";
import { TextAnimate } from "@/components/text/text-animate";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { mongoClient } from "@/lib/mongodb";
import { getDatabasesWithCollections } from "@/utils/get-databases-with-collections";
import { getIronSessionData } from "@/utils/get-iron-session-data";

export const dynamic = "force-dynamic";

export default async function Home() {
  try {
    const uri = await getIronSessionData();

    if (!uri) {
      return <p>no uri</p>;
    }
    const client = await mongoClient(uri);
    const database = client.db();
    const buildInfo = (await database.admin().buildInfo()) as BuildInfo | null;
    const { databases, totalSize } = await getDatabasesWithCollections(uri);

    return (
      <main className="min-h-screen p-8 flex flex-col items-center gap-8 overflow-hidden">
        <header className="w-full max-w-3xl">
          <TextAnimate
            className="text-3xl font-bold"
            animation="scaleUp"
            by="text"
            once
          >
            MongoDB status
          </TextAnimate>
          <TextAnimate
            className="text-sm text-neutral-500 mt-1"
            animation="scaleUp"
            by="text"
            once
          >
            Quick snapshot of build information and databases.
          </TextAnimate>
        </header>

        {buildInfo && (
          <BuildInfoC
            version={buildInfo.version}
            bits={buildInfo.bits}
            ok={buildInfo.ok}
            allocator={buildInfo.allocator}
            sysInfo={buildInfo.sysInfo}
            gitVersion={buildInfo.gitVersion}
            modules={buildInfo.modules}
            storageEngines={buildInfo.storageEngines}
          />
        )}
        {/* Databases */}
        <section className="w-full max-w-3xl rounded-2xl p-6 shadow-sm">
          <TextAnimate
            animation="scaleUp"
            by="text"
            once
            className="text-xl font-semibold mb-4"
          >
            Databases
          </TextAnimate>

          <div className="mb-4 text-sm">
            <TextAnimate
              animation="scaleUp"
              by="text"
              once
            >
              {`Total size: ${prettyBytes(totalSize ?? 0)}`}
            </TextAnimate>
          </div>

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
            }}
          >
            {databases.length > 0
              ? (
                  databases.map(d => (
                    <DbCard
                      key={d.name}
                      collections={d.collections}
                      name={d.name}
                      sizeOnDisk={d.sizeOnDisk}
                    />
                  ))
                )
              : (
                  <p className="text-sm text-muted-foreground text-center col-span-full">
                    No databases found.
                  </p>
                )}
          </AnimatedGroup>
        </section>
      </main>
    );
  }
  catch (error) {
    console.error("Failed to load MongoDB info:", error);
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-semibold mb-2">
            Unable to load MongoDB info
          </h1>
          <p className="text-sm text-muted-foreground">
            Check your connection or server logs for details.
          </p>
        </div>
      </div>
    );
  }
}
