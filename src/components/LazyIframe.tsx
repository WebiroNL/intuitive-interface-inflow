import { useState, useEffect, useRef } from 'react';

interface LazyIframeProps {
  src: string;
  title?: string;
  className?: string;
  width?: string | number;
  height?: string | number;
  loading?: 'lazy' | 'eager';
}

export function LazyIframe({ 
  src, 
  title = 'Embedded content',
  className = '',
  width = '100%',
  height = '100%',
  loading = 'lazy'
}: LazyIframeProps) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={className} style={{ width, height }}>
      {isVisible ? (
        <iframe
          src={src}
          title={title}
          width="100%"
          height="100%"
          frameBorder="0"
          loading={loading}
          className="border-0"
        />
      ) : (
        <div className="w-full h-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />
      )}
    </div>
  );
}
