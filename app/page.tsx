"use client";

import { type FormEvent, useState } from "react";
import { saveMongoURI } from "@/actions/saveMongoURI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ConnectPage() {
  const [uri, setUri] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!uri) return;

    await saveMongoURI(uri);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <form
        onSubmit={handleSubmit}
        className="grid place-items-center space-y-4 w-full max-w-xl"
      >
        <h1 className="text-2xl font-bold text-center">Connect to MongoDB</h1>
        <p className="text-xl text-muted-foreground text-center">
          We dont save it
        </p>
        <Input
          autoComplete="off"
          name="uri"
          type="password"
          placeholder="Enter your MongoDB connection string"
          value={uri}
          onChange={(e) => setUri(e.target.value)}
          className="w-full"
        />

        <Button type="submit" className="w-1/2">
          Connect
        </Button>
      </form>
    </div>
  );
}
