"use server";

import { getIronSession, type IronSession } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function saveMongoURI(uri: string) {
  const session: IronSession<{
    mongo: string;
  }> = await getIronSession(await cookies(), {
    password: process.env.IRON_PASS!,
    cookieName: "mongo",
    cookieOptions: {},
    ttl: 60 * 60,
  });

  session.mongo = uri;

  await session.save();

  redirect("/main");
}
