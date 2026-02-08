import { useState, useEffect, useRef } from 'react';

interface TypewriterTextProps {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'span';
  waitForPageLoad?: boolean;
  onComplete?: () => void;
}

export function TypewriterText({ 
  text, 
  delay = 0, 
  speed = 50, 
  className = '',
  as: Component = 'span',
  waitForPageLoad = false,
  onComplete
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [canStart, setCanStart] = useState(!waitForPageLoad);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLElement>(null);
  const hasStartedRef = useRef(false);

  // Check of pagina volledig geladen is
  useEffect(() => {
    if (!waitForPageLoad) {
      setCanStart(true);
      return;
    }

    const handleLoad = () => {
      setCanStart(true);
    };

    if (document.readyState === 'complete') {
      setCanStart(true);
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, [waitForPageLoad]);

  // Intersection Observer om te detecteren wanneer element in beeld komt
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px'
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [isVisible]);

  // Typewriter effect - start alleen als canStart en isVisible
  useEffect(() => {
    if (!canStart || !isVisible || hasStartedRef.current) return;

    hasStartedRef.current = true;

    // Start met delay
    const startTimeout = setTimeout(() => {
      let index = 0;
      const typeInterval = setInterval(() => {
        if (index < text.length) {
          setDisplayedText(text.substring(0, index + 1));
          setCurrentIndex(index + 1);
          index++;
        } else {
          clearInterval(typeInterval);
          onComplete?.();
        }
      }, speed);

      return () => clearInterval(typeInterval);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [canStart, isVisible, text, speed, delay, onComplete]);

  return (
    <Component ref={elementRef as any} className={className}>
      {displayedText}
      {currentIndex < text.length && canStart && isVisible && (
        <span className="animate-pulse">|</span>
      )}
    </Component>
  );
}

export default TypewriterText;
