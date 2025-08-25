"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function saveMongoURI(uri: string) {
  const co = await cookies();
  co.set({
    name: "mongoURI",
    value: uri,
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 1000 * 5,
  });

  redirect("/main");
}
