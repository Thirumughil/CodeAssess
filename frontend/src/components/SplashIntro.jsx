import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2 } from 'lucide-react';
import './SplashIntro.css';

const SplashIntro = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Show for 3 seconds then complete
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 1000); // Wait for fade out
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="splash-container">
      <AnimatePresence>
        {isVisible && (
          <motion.div 
            className="brand-reveal-centered"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ 
              duration: 1.2, 
              ease: [0.16, 1, 0.3, 1] // Custom quint ease for premium feel
            }}
          >
            <div className="brand-flex-container">
              <motion.div
                initial={{ rotate: -180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 1 }}
              >
                <Code2 size={72} className="brand-icon-primary" />
              </motion.div>
              
              <motion.h1 
                className="brand-text-primary"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                CodePractice
              </motion.h1>
            </div>
            
            <motion.div 
              className="brand-line-glow"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.6, duration: 1.5 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      <button className="skip-btn-minimal" onClick={onComplete}>Skip</button>
    </div>
  );
};

export default SplashIntro;
