import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { FaArrowRight } from "react-icons/fa";

interface ScrollLightButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
}

export default function ScrollLightButton({
  children,
  onClick,
  type = "button",
  disabled = false,
  className = "",
}: ScrollLightButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  // Animate sheen position based on scroll progress of the page
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // Sheen moves from -60% to 120% (off left to off right)
  const sheenX = useTransform(scrollYProgress, [0, 1], ["-60%", "120%"]);

  return (
    <motion.button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`relative overflow-hidden ${className}`}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
    >
      {/* Button Content */}
      <span className="relative z-10 flex items-center justify-center w-full h-full">
        {children}
      </span>
      {/* Animated Sheen Overlay */}
      <motion.span
        className="pointer-events-none absolute top-0 left-0 h-full w-1/2"
        style={{
          x: sheenX,
          background:
            "linear-gradient(120deg, rgba(255,255,255,0.0) 0%, rgba(255,255,255,0.32) 50%, rgba(255,255,255,0.0) 100%)",
          filter: "blur(2px)",
        }}
        aria-hidden="true"
      />
    </motion.button>
  );
}
