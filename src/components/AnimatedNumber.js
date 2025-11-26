import React, { useEffect, useRef, useState } from 'react';

export default function AnimatedNumber({ value, duration = 1000, className = '', ...props }) {
  const [display, setDisplay] = useState(value);
  const startValue = useRef(value);
  const raf = useRef();

  useEffect(() => {
    let start;
    startValue.current = display;
    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const next = Math.floor(startValue.current + (value - startValue.current) * progress);
      setDisplay(next);
      if (progress < 1) {
        raf.current = requestAnimationFrame(animate);
      }
    };
    raf.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf.current);
  }, [value, duration, display]);

  return <span className={className} {...props}>{display.toLocaleString()}</span>;
}
