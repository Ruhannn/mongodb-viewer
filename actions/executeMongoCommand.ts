"use server";

import { mongoClient } from "@/lib/mongodb";
import { getIronSessionData } from "@/utils/getIronSessionData";


export async function executeMongoCommand(code: string) {
  const uri = await getIronSessionData();

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
