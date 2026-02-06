import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface TimelineIconProps {
  icon: LucideIcon;
  isActive?: boolean;
  isCompleted?: boolean;
  delay?: number;
}

export function TimelineIcon({ 
  icon: Icon, 
  isActive = false, 
  isCompleted = false,
  delay = 0 
}: TimelineIconProps) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={`
        relative w-16 h-16 rounded-2xl flex items-center justify-center
        ${isActive 
          ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25' 
          : isCompleted 
            ? 'bg-primary/10 text-primary' 
            : 'bg-muted text-muted-foreground'
        }
        transition-all duration-300
      `}
    >
      <Icon className="w-7 h-7" />
      
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-2xl bg-primary"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ opacity: 0.2, zIndex: -1 }}
        />
      )}
    </motion.div>
  );
}

export function getTimelineAnimation(index: number) {
  return {
    initial: { opacity: 0, x: index % 2 === 0 ? -30 : 30 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, delay: index * 0.15 },
  };
}

export default TimelineIcon;
