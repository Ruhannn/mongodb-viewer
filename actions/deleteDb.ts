"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { mongoClient } from "@/lib/mongodb";

export async function handleDbDelete(dbName: string) {
  try {
    const cookieStore = await cookies();
    const uri = cookieStore.get("mongoURI")?.value;

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
