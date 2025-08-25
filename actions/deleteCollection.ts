"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { mongoClient } from "@/lib/mongodb";

export async function handleDeleteCollection(
  collectionName: string,
  dbName: string,
) {
  try {
    const cookieStore = await cookies();
    const uri = cookieStore.get("mongoURI")?.value;

    const client = await mongoClient(uri!);
    const result = await client.db(dbName).collection(collectionName).drop();

    if (!result) {
      throw new Error(`Failed to delete Collection "${dbName}".`);
    }

    revalidatePath(`/main/${dbName}/${collectionName}`);
  } catch (error) {
    console.error("Collection deletion error:", error);

    throw new Error("Unknown error occurred while deleting collection.");
  }
}
