"use client";

import type { FormEvent } from "react";

import { useState } from "react";

import { saveMongoURI } from "@/actions/save-mongo-uri";
import { SparklesText } from "@/components/text/sparkle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function ConnectPage() {
  const [uri, setUri] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!uri)
      return;

    await saveMongoURI(uri);
  };

  return (
    <div className="min-h-screen flex items-center justify-center size-full relative">
      {/* <LightRays
        raysOrigin="top-center"
        raysColor="#1e9df1"
        raysSpeed={1.5}
        lightSpread={0.8}
        rayLength={1.2}
        followMouse={true}
        mouseInfluence={0.2}
        noiseAmount={0.1}
        distortion={0.05}
        className="h-full"
      /> */}

      <div className="absolute inset-0 flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="grid place-items-center space-y-4 w-full max-w-xl"
        >
          <SparklesText>MongoDB Viewer</SparklesText>
          <div
            className={cn(
              `text-muted-foreground bg-clip-text inline-block [animation:shine_5s_linear_infinite] text-2xl text-center`,
              "[background-image:linear-gradient(120deg,rgba(255,255,255,0.4)_40%,rgba(255,255,255)_50%,_rgba(255,255,255,0.4)_60%)]",
            )}
            style={{
              backgroundSize: "200% 100%",
              WebkitBackgroundClip: "text",
            }}
          >
            We don't save it
          </div>
          <Input
            autoComplete="off"
            name="uri"
            type="password"
            placeholder="Enter your MongoDB connection string"
            value={uri}
            onChange={e => setUri(e.target.value)}
            className="w-full text-center p-8 text-xl"
          />
          <Button
            type="submit"
            className="w-1/2"
          >
            Connect
          </Button>
        </form>
      </div>
    </div>
  );
}
