"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

const kineticVariants = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.05
      }
    }
  },
  letter: {
    hidden: {
      opacity: 0,
      y: 20,
      rotateZ: -5,
      scale: 0.8
    },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      rotateZ: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        bounce: 0.35,
        duration: 0.7,
        delay: custom * 0.04,
        staggerChildren: 0.05
      }
    })
  }
};

export function KineticNeel() {
  const text = "Neel";
  const letters = useMemo(() => text.split(""), []);

  return (
    <motion.h1
      className="mega-heading kinetic-neel"
      variants={kineticVariants.container}
      initial="hidden"
      animate="visible"
      style={{
        overflow: "visible",
        width: "100%",
        whiteSpace: "nowrap"
      }}
    >
      {letters.map((letter, index) => (
        <motion.span
          key={`${letter}-${index}`}
          className="kinetic-letter"
          custom={index}
          variants={kineticVariants.letter}
          animate="animate"
          initial="initial"
          whileHover={{
            scale: 1.08,
            y: -5,
            skewY: 1,
            transition: { duration: 0.3, type: "spring", bounce: 0.4 }
          }}
          style={{
            display: "inline-block",
            position: "relative"
          }}
        >
          <span className="kinetic-letter-inner" style={{ display: "inline-block", position: "relative" }}>{letter}</span>
        </motion.span>
      ))}
    </motion.h1>
  );
}
