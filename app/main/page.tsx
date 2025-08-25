import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { mongoClient } from "@/lib/mongodb";
import type { BuildInfo } from "@/types/build-info";
import { getDatabasesWithCollections } from "@/utils/getDatabasesWithCollections";
import { cookies } from "next/headers";
import Link from "next/link";
import prettyBytes from "pretty-bytes";
export const dynamic = "force-dynamic";

export default async function Home() {
  try {
    const cookieStore = cookies();
    const uri = (await cookieStore).get("mongoURI")?.value;

    if (!uri) {
      return <p>no uri</p>;
    }
    const client = await mongoClient(uri);
    const database = client.db();
    const buildInfo = (await database.admin().buildInfo()) as BuildInfo | null;
    const { databases, totalSize } = await getDatabasesWithCollections(uri);

    return (
      <main className="min-h-screen p-8 flex flex-col items-center gap-8">
        <header className="w-full max-w-3xl">
          <h1 className="text-3xl font-bold">MongoDB status</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Quick snapshot of build information and databases.
          </p>
        </header>

        <Card className="w-full max-w-3xl">
          <CardHeader className="text-xl font-semibold">
            Build information
          </CardHeader>

          {buildInfo ? (
            <CardContent className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">Version</dt>
                <dd className="font-medium">{buildInfo.version ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Allocator</dt>
                <dd className="font-medium">{buildInfo.allocator ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Bits</dt>
                <dd className="font-medium">{buildInfo.bits ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">System info</dt>
                <dd className="font-medium truncate">
                  {buildInfo.sysInfo ?? "—"}
                </dd>
              </div>
            </CardContent>
          ) : (
            <CardContent className="text-sm text-muted-foreground">
              No build info available.
            </CardContent>
          )}
        </Card>

        {/* Databases */}
        <section className="w-full max-w-3xl rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Databases</h2>

          <div className="mb-4 text-sm">
            <strong>Total size:</strong> {prettyBytes(totalSize ?? 0)}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full h-full">
            {databases.length > 0 ? (
              databases.map((d) => (
                <Link key={d.name} href={`/main/${d.name}`}>
                  <Card className="group flex flex-col justify-between h-full transition-all hover:shadow-md hover:border-primary">
                    <CardHeader className="font-medium text-base">
                      {d.name}
                    </CardHeader>
                    <CardContent className="space-y-1">
                      <div className="text-xs text-muted-foreground">
                        Collections: {d.collections}
                      </div>
                      <div className="text-sm font-medium">
                        {prettyBytes(d.sizeOnDisk)}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center col-span-full">
                No databases found.
              </p>
            )}
          </div>
        </section>
      </main>
    );
  } catch (error) {
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
