"use client";

import { motion, type Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.03
    }
  }
};

const charVariants: Variants = {
  hidden: {
    opacity: 0.001,
    y: 10,
    filter: "blur(10px)"
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

type SplitTextProps = {
  text: string;
  className?: string;
  once?: boolean;
  as?: "p" | "h1" | "h2" | "h3" | "span";
  style?: React.CSSProperties;
};

export function SplitText({
  text,
  className,
  once = true,
  as = "p",
  style
}: SplitTextProps) {
  const Tag = motion[as];

  const words = text.split(" ");

  return (
    <Tag
      className={className}
      style={style}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.6 }}
    >
      {words.map((word, wordIndex) => (
        <span key={`${word}-${wordIndex}`} className="split-word">
          {Array.from(word).map((char, charIndex) => (
            <motion.span
              key={`${char}-${charIndex}`}
              className="split-char"
              variants={charVariants}
            >
              {char}
            </motion.span>
          ))}
          {wordIndex < words.length - 1 ? (
            <motion.span className="split-char split-space" variants={charVariants}>
              {" "}
            </motion.span>
          ) : null}
        </span>
      ))}
    </Tag>
  );
}
