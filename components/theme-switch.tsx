"use client";

import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeSwitch() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute top-3 right-3">
      <Button
        size="icon"
        variant="ghost"
        className="relative overflow-hidden"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        <AnimatePresence mode="wait" initial={false}>
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
              className="absolute"
            >
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
              className="absolute"
            >
              <Moon className="size-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </Button>
    </div>
  );
}
