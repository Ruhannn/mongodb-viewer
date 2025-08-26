"use server";

import { mongoClient } from "@/lib/mongodb";
import { getIronSessionData } from "@/utils/getIronSessionData";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";

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
  const uri = await getIronSessionData();

  const database = (await mongoClient(uri!)).db(databaseName);

  const collection = database.collection(collectionName);

  await collection.updateOne(
    { _id: new ObjectId(documentId) },
    { $set: { [field]: value } },
  );
  revalidatePath(`/main/${databaseName}/${collectionName}`);
  return { success: true };
}
