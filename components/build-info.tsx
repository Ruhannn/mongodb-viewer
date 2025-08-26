"use client";

import type { LucideIcon } from "lucide-react";

import { motion } from "framer-motion";
import {
  Boxes,
  Cpu,
  Gauge,
  GitBranch,
  Info,
  Layers,

  Package,
  Terminal,
} from "lucide-react";
import { useState } from "react";

import type { BuildInfo } from "@/types/build-info";

import { AnimatedGroup } from "./ui/animated-group";
import { Card, CardContent, CardHeader } from "./ui/card";

type BuildInfoItemProps = {
  icon: LucideIcon;
  label: string;
  value: string | number | null | undefined;
};

export function BuildInfoItem({
  icon: Icon,
  label,
  value,
}: BuildInfoItemProps) {
  const [scattered, setScattered] = useState(false);

  const randomOffset = () => ({
    x: Math.random() * 500 - 100,
    y: Math.random() * 500 - 100,
  });

  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleClick = () => {
    if (!scattered) {
      setOffset(randomOffset());
    }
    else {
      setOffset({ x: 0, y: 0 });
    }
    setScattered(!scattered);
  };

  return (
    <div className="flex items-center gap-2 ">
      <motion.div
        onClick={handleClick}
        animate={offset}
      >
        <Icon className="h-4 w-4 text-muted-foreground cursor-pointer" />
      </motion.div>
      <div>
        <motion.dt
          drag
          dragElastic={0.2}
          animate={offset}
          whileDrag={{ cursor: "grabbing" }}
          className="text-xs text-muted-foreground"
        >
          {label}
        </motion.dt>

        <motion.dd
          drag
          dragElastic={0.2}
          animate={offset}
          whileDrag={{ cursor: "grabbing" }}
          className="font-medium truncate"
        >
          {value ?? "—"}
        </motion.dd>
      </div>
    </div>
  );
}

export default function BuildInfoC({
  version,
  allocator,
  bits,
  sysInfo,
  gitVersion,
  modules,
  storageEngines,
  ok,
}: Pick<
  BuildInfo,
  | "version"
  | "bits"
  | "ok"
  | "allocator"
  | "sysInfo"
  | "gitVersion"
  | "modules"
  | "storageEngines"
>) {
  const items: BuildInfoItemProps[] = [
    { icon: Package, label: "Version", value: version },
    { icon: Cpu, label: "Allocator", value: allocator },
    { icon: Gauge, label: "Bits", value: bits },
    { icon: Terminal, label: "System info", value: sysInfo },
    { icon: GitBranch, label: "Git Version", value: gitVersion },
    {
      icon: Boxes,
      label: "Modules",
      value: modules?.length ? modules.join(", ") : "—",
    },
    {
      icon: Layers,
      label: "Storage Engine",
      value: storageEngines?.length ? storageEngines.join(", ") : "—",
    },
    { icon: Info, label: "OK", value: ok },
  ];

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader className="text-xl font-semibold">
        Build information
      </CardHeader>
      {version
        ? (
            <AnimatedGroup className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm px-6">
              {items.map((item, i) => (
                <BuildInfoItem
                  key={i}
                  {...item}
                />
              ))}
            </AnimatedGroup>
          )
        : (
            <CardContent className="text-sm text-muted-foreground">
              No build info available.
            </CardContent>
          )}
    </Card>
  );
}
