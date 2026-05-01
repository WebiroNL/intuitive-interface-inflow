import { useEffect, useRef, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Sun01Icon, Moon02Icon } from '@hugeicons/core-free-icons';
import { useTheme } from '@/contexts/ThemeContext';

interface Props {
  size?: number;
}

/**
 * Renders the active theme icon and spins on theme change:
 * - Sun does a full 360° rotation
 * - Moon does a 180° rotation
 */
export function ThemeToggleIcon({ size = 15 }: Props) {
  const { theme } = useTheme();
  const [rotation, setRotation] = useState(0);
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    setRotation((prev) => prev + 360);
  }, [theme]);

  return (
    <span
      className="inline-flex items-center justify-center transition-transform duration-700 ease-in-out"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {theme === 'dark' ? (
        <HugeiconsIcon icon={Sun01Icon} size={size} />
      ) : (
        <HugeiconsIcon icon={Moon02Icon} size={size} />
      )}
    </span>
  );
}

export default ThemeToggleIcon;
