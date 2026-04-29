import { useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const complexityOrder = ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)', 'O(n³)', 'O(2ⁿ)', 'O(n!)'];
const complexityColor = {
  'O(1)': '#22c55e',
  'O(log n)': '#84cc16',
  'O(n)': '#eab308',
  'O(n log n)': '#f97316',
  'O(n²)': '#f43f5e',
  'O(n³)': '#ef4444',
  'O(2ⁿ)': '#dc2626',
  'O(n!)': '#991b1b',
};

function RingOrbit({ radius = 1, color, speed }) {
  const ringRef = useRef();
  const dotRef = useRef();
  const safeRadius = Number(radius) || 1;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;
    if (ringRef.current) {
      ringRef.current.rotation.x = t * 0.3;
      ringRef.current.rotation.y = t;
    }
    if (dotRef.current) {
      dotRef.current.position.set(
        Math.cos(t * 2) * safeRadius,
        Math.sin(t * 2) * safeRadius * 0.4,
        0
      );
    }
  });

  return (
    <group>
      <mesh ref={ringRef}>
        <torusGeometry args={[safeRadius, 0.04, 16, 100]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} transparent opacity={0.6} />
      </mesh>
      <mesh ref={dotRef}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
      </mesh>
    </group>
  );
}

function FloatingLabel({ text, position, color }) {
  return (
    <Text 
      position={position} 
      fontSize={0.28} 
      color={color} 
      anchorX="center" 
      anchorY="middle"
    >
      {text}
    </Text>
  );
}

function ComplexityScene({ time, space }) {
  const timeColor = complexityColor[time] || '#60a5fa';
  const spaceColor = complexityColor[space] || '#a78bfa';

  const groupRef = useRef();
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 5]} intensity={1.5} />
      <RingOrbit radius={1.2} color={timeColor} speed={0.6} />
      <RingOrbit radius={2} color={spaceColor} speed={0.35} />
      <FloatingLabel text={`Time: ${time}`} position={[0, 1.8, 0]} color={timeColor} />
      <FloatingLabel text={`Space: ${space}`} position={[0, -1.8, 0]} color={spaceColor} />
    </group>
  );
}

function getRating(complexity) {
  const idx = complexityOrder.indexOf(complexity);
  if (idx <= 1) return { label: 'Excellent', color: '#22c55e' };
  if (idx === 2) return { label: 'Good', color: '#eab308' };
  if (idx === 3) return { label: 'Average', color: '#f97316' };
  return { label: 'Needs Improvement', color: '#ef4444' };
}

export default function ComplexityModal({ result, onClose }) {
  const { time, space } = result;
  const timeRating = getRating(time);
  const spaceRating = getRating(space);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-lg glass-panel border border-white/10 overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-dark-900/40">
          <div>
            <h2 className="text-xl font-bold text-slate-100">Complexity Analysis</h2>
            <p className="text-xs text-slate-500">Your code's estimated efficiency</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X size={18} className="text-slate-400" />
          </button>
        </div>

        <div className="h-72 w-full bg-dark-950/20 relative">
          <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }}>
            <Suspense fallback={null}>
              <ComplexityScene time={time} space={space} />
              <OrbitControls enableZoom={false} enablePan={false} />
            </Suspense>
          </Canvas>
        </div>

        <div className="grid grid-cols-2 gap-4 px-6 py-5 bg-dark-900/20 border-t border-white/10">
          {[
            { label: 'Time Complexity', value: time, color: complexityColor[time] || '#60a5fa', rating: timeRating },
            { label: 'Space Complexity', value: space, color: complexityColor[space] || '#a78bfa', rating: spaceRating },
          ].map(stat => (
            <div key={stat.label} className="bg-white/5 rounded-xl p-4 text-center border border-white/5">
              <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">{stat.label}</div>
              <div className="text-2xl font-black font-mono" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-xs mt-1 font-bold" style={{ color: stat.rating.color }}>
                {stat.rating.label}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
