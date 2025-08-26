"use server";

import { mongoClient } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function updateDocument({
  databaseName,
  collectionName,
  documentId,
  field,
  value,
}: {
  databaseName: string;
  collectionName: string;
  documentId: string;
  field: string;
  // biome-ignore lint/suspicious/noExplicitAny: idk
  value: any;
}) {
  const cookieStore = await cookies();
  const uri = cookieStore.get("mongoURI")?.value;

  const database = (await mongoClient(uri!)).db(databaseName);

  const collection = database.collection(collectionName);

  await collection.updateOne(
    { _id: new ObjectId(documentId) },
    { $set: { [field]: value } },
  );
  revalidatePath(`/main/${databaseName}/${collectionName}`);
  return { success: true };
}
