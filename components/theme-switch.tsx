"use client";

import { motion, type Transition, useAnimation } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
export function ThemeSwitch() {
  const controls = useAnimation();
  const { setTheme, theme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="absolute top-3 right-3">
        <Button size="icon">
          <Sun className="size-5 opacity-0" />
        </Button>
      </div>
    );
  }

  const MotionSun = motion.create(Sun);
  const MotionMoon = motion.create(Moon);

  const svgVariants = {
    normal: {
      rotate: 0,
    },
    animate: {
      rotate: [0, -10, 10, -5, 5, 0],
    },
  };

  const svgTransition: Transition = {
    duration: 1.2,
    ease: "easeInOut",
  };

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: lol
    <div
      onMouseEnter={() => controls.start("animate")}
      onMouseLeave={() => controls.start("normal")}
      className="absolute top-3 right-3"
    >
      <Button
        size="icon"
        aria-label="Toggle theme"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        <MotionSun
          variants={svgVariants}
          animate={controls}
          transition={svgTransition}
          className={cn(
            "size-5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
            theme === "light"
              ? "scale-100 translate-y-0 opacity-100"
              : "scale-50 translate-y-5 opacity-0",
          )}
        />
        <MotionMoon
          variants={svgVariants}
          animate={controls}
          transition={svgTransition}
          className={cn(
            "absolute size-5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
            theme === "dark"
              ? "scale-100 translate-y-0 opacity-100"
              : "scale-50 translate-y-5 opacity-0",
          )}
        />
      </Button>
    </div>
  );
}
