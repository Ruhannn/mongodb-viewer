import type { IronSession } from "iron-session";

import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

export async function getIronSessionData() {
  const session: IronSession<{
    mongo: string;
  }> = await getIronSession(await cookies(), {
    password: process.env.IRON_PASS!,
    cookieName: "mongo",
  });
  return session.mongo;
}
