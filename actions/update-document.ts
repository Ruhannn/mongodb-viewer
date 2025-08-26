"use server";

import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";

import { mongoClient } from "@/lib/mongodb";
import { getIronSessionData } from "@/utils/get-iron-session-data";

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
