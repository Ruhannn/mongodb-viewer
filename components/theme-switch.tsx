"use client";

import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

export function ThemeSwitch() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const changeTheme = async () => {
    if (!ref.current) return;

    await document.startViewTransition(() => {
      flushSync(() => {
        setTheme(theme === "light" ? "dark" : "light");
      });
    }).ready;

    const { top, left, width, height } = ref.current.getBoundingClientRect();
    const y = top + height / 2;
    const x = left + width / 2;

    const right = window.innerWidth - left;
    const bottom = window.innerHeight - top;
    const maxRad = Math.hypot(Math.max(left, right), Math.max(top, bottom));

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRad}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 700,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      }
    );
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      ref={ref}
      className="absolute top-3 right-3 z-10">
      <Button
        size="icon"
        variant="ghost"
        className="relative overflow-hidden"
        onClick={changeTheme}>
        <AnimatePresence
          mode="wait"
          initial={false}>
          {theme === "light" ? (
            <motion.div
              key="sun"
              initial={{ scale: 0.5, y: -20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{
                duration: 0.3,
                ease: [0.34, 1.56, 0.64, 1],
              }}
              whileHover={{
                rotate: [0, -10, 10, -5, 5, 0],
                transition: {
                  duration: 1.2,
                  ease: "easeInOut",
                },
              }}
              className="absolute">
              <Sun className="size-5" />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ scale: 0.5, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{
                duration: 0.3,
                ease: [0.34, 1.56, 0.64, 1],
              }}
              whileHover={{
                rotate: [0, -10, 10, -5, 5, 0],
                transition: {
                  duration: 1.2,
                  ease: "easeInOut",
                },
              }}
              className="absolute">
              <Moon className="size-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </Button>
    </div>
  );
}
