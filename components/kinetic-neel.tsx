"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

const kineticVariants = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2
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
        duration: 1.2,
        delay: custom * 0.08,
        staggerChildren: 0.05
      }
    })
  }
};

const floatVariants = {
  initial: { y: 0, x: 0, skewY: 0 },
  animate: (index: number) => ({
    y: [0, -3, 2, -1, 0],
    x: [0, 1, -2, 1, 0],
    skewY: [0, 0.5, -0.3, 0.2, 0],
    transition: {
      duration: 5 + index * 0.3,
      repeat: Infinity,
      ease: "easeInOut" as const,
      delay: index * 0.15
    }
  })
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
          <motion.span
            className="kinetic-letter-inner"
            variants={floatVariants}
            initial="initial"
            animate="animate"
            custom={index}
            style={{
              display: "inline-block",
              position: "relative"
            }}
          >
            {letter}
          </motion.span>
        </motion.span>
      ))}
    </motion.h1>
  );
}
