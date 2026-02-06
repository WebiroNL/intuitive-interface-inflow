import { motion } from 'framer-motion';

interface AnimatedWLogoProps {
  size?: number;
  className?: string;
}

export function AnimatedWLogo({ size = 64, className = '' }: AnimatedWLogoProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background Circle */}
      <motion.rect
        width="512"
        height="512"
        rx="128"
        fill="hsl(var(--primary))"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      />
      
      {/* W Letter Path */}
      <motion.path
        d="M150 150 L180 150 L230 350 L260 350 L310 150 L340 150 L380 380 L340 380 L310 230 L280 380 L240 380 L210 230 L180 380 L140 380 Z"
        fill="white"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
      />
    </motion.svg>
  );
}

export default AnimatedWLogo;
