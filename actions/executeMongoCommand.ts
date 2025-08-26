"use server";

import { mongoClient } from "@/lib/mongodb";
import { cookies } from "next/headers";

export async function executeMongoCommand(code: string) {
  const cookieStore = await cookies();
  const uri = cookieStore.get("mongoURI")?.value;
  const client = await mongoClient(uri!);
  const db = client.db("kamilytics");

  try {
    const fn = new Function(
      "db",
      `"use strict"; return (async () => { ${code} })();`,
    );
    const result = await fn(db);
    return { success: true, result };
  } catch (err) {
    console.log(err);
    return { success: false, error: (err as Error).message };
  }
}
