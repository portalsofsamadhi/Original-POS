import { motion } from "framer-motion";

interface LogoProps {
  className?: string;
  animate?: boolean;
  width?: string;
}

const Logo = ({ className = "", animate = false, width = "w-64" }: LogoProps) => {
  const baseComponent = (
    <img
      src="/poslogo.webp"
      alt="Portals Of Samadhi"
      className={`h-auto ${width} ${className} relative z-10`}
    />
  );

  if (!animate) return baseComponent;

  return (
    <motion.div
      initial={{ scale: 1 }}
      animate={{
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut"
      }}
      className={`flex items-center justify-center ${width} relative`}    >
      {baseComponent}
    </motion.div>
  );
};

export default Logo;
