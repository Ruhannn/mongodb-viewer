"use server";

import { mongoClient } from "@/lib/mongodb";
import { getIronSessionData } from "@/utils/getIronSessionData";
import { revalidatePath } from "next/cache";

export async function handleDbDelete(dbName: string) {
  try {
    const uri = await getIronSessionData();

    const client = await mongoClient(uri!);
    const result = await client.db(dbName).dropDatabase();

    if (!result) {
      throw new Error(`Failed to delete database "${dbName}".`);
    }

    revalidatePath("/main");
  } catch (error) {
    console.error("Database deletion error:", error);

    throw new Error("Unknown error occurred while deleting database.");
  }
}
