import { useState, useEffect } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export default function CustomCursor() {
  const [isPointer, setIsPointer] = useState(false);
  const [ripples, setRipples] = useState([]);

  // Mouse coordinates
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for trailing effect
  const springConfig = { damping: 25, stiffness: 200 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Slower trail for "water" effect
  const trailX = useSpring(mouseX, { damping: 40, stiffness: 100 });
  const trailY = useSpring(mouseY, { damping: 40, stiffness: 100 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      // Check if hovering over interactive elements
      const target = e.target;
      setIsPointer(
        window.getComputedStyle(target).cursor === 'pointer' ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a')
      );
    };

    const handleClick = (e) => {
      const id = Date.now();
      setRipples((prev) => [...prev, { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 1000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <>
      <div className="fixed inset-0 z-[9999] pointer-events-none">
        {/* Main Glow Dot */}
        <motion.div
          style={{
            x: mouseX,
            y: mouseY,
            translateX: '-50%',
            translateY: '-50%',
          }}
          animate={{
            scale: isPointer ? 1.5 : 1,
            backgroundColor: isPointer ? '#34d399' : '#3b82f6',
          }}
          className="w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_15px_#3b82f6] transition-colors duration-200"
        />

        {/* Smooth Trail Glow */}
        <motion.div
          style={{
            x: smoothX,
            y: smoothY,
            translateX: '-50%',
            translateY: '-50%',
          }}
          className="w-8 h-8 rounded-full border border-blue-400/30 bg-blue-400/5 backdrop-blur-[1px]"
        />

        {/* Water-like Slower Trail */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              x: trailX,
              y: trailY,
              translateX: '-50%',
              translateY: '-50%',
            }}
            transition={{ delay: (i + 1) * 0.05 }}
            className="w-6 h-6 rounded-full bg-blue-400/10 blur-sm"
          />
        ))}

        {/* Click Ripples */}
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 4, opacity: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{
              left: ripple.x,
              top: ripple.y,
              translateX: '-50%',
              translateY: '-50%',
            }}
            className="absolute w-10 h-10 rounded-full border-2 border-blue-400/50"
          />
        ))}
      </div>
    </>
  );
}
