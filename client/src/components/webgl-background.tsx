import { useEffect, useRef, useState, useMemo } from "react";
import { motion } from "framer-motion";

// Add type declaration for the window object with correct timeout type
declare global {
  interface Window {
    resizeTimeoutId?: ReturnType<typeof setTimeout>;
  }
}

// Helper function to detect device capability - enhanced
function detectDevicePerformance() {
  // Check for mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Check device memory if available
  const lowMemory = (navigator as any).deviceMemory !== undefined && (navigator as any).deviceMemory < 4;
  
  // Check connection speed if available
  const slowConnection = (navigator as any).connection?.effectiveType === 'slow-2g' || 
                        (navigator as any).connection?.effectiveType === '2g';
  
  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Return performance tier
  if (isMobile || lowMemory || slowConnection || prefersReducedMotion) {
    return 'low';
  }
  
  return 'high';
}

function FloatingParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Detect device performance once
  const performanceTier = useMemo(() => detectDevicePerformance(), []);
  
  // Set particle count based on performance tier - optimized
  const particleCount = useMemo(() => performanceTier === 'high' ? 50 : 20, [performanceTier]);
  
  // Determine animation frame throttling - optimized
  const frameSkip = useMemo(() => performanceTier === 'high' ? 1 : 3, [performanceTier]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      opacity: number;
      color: string;
    }> = [];

    const colors = ['#ff6b9d', '#c8a2c8', '#98fb98', '#fbbf24'];

    // Create particles with random properties, but limit count for mobile
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    let animationFrameId: number;
    let frameCount = 0;

    const animate = () => {
      // Skip frames for low-performance devices
      frameCount = (frameCount + 1) % frameSkip;
      if (frameCount !== 0 && performanceTier === 'low') {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.vx *= -1;
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.vy *= -1;
        }

        // Draw particle
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    animate();

    // Only resize on orientation change or after resize ends
    const resizeHandler = () => {
      if (window.resizeTimeoutId) {
        clearTimeout(window.resizeTimeoutId);
      }
      window.resizeTimeoutId = setTimeout(resizeCanvas, 250);
    };
    
    window.addEventListener('resize', resizeHandler);
    
    return () => {
      window.removeEventListener('resize', resizeHandler);
      cancelAnimationFrame(animationFrameId);
      
      // Enhanced cleanup for memory management
      if (window.resizeTimeoutId) {
        clearTimeout(window.resizeTimeoutId);
        delete window.resizeTimeoutId;
      }
      
      // Clear canvas and free memory
      if (canvas) {
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = 1;
        canvas.height = 1;
      }
      
      // Clear particles array
      particles.length = 0;
      
      console.log('WebGL Background: Memory cleaned up');
    };
  }, [particleCount, frameSkip, performanceTier]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: 'none', background: 'transparent' }}
    />
  );
}

function AnimatedLights() {
  // Detect device performance
  const performanceTier = useMemo(() => detectDevicePerformance(), []);
  
  // Simplify animations for mobile
  const animationDuration = useMemo(() => 
    performanceTier === 'high' ? { slow: 18, medium: 15, fast: 12 } : { slow: 24, medium: 20, fast: 16 }, 
    [performanceTier]
  );
  
  // Reduce blur effect on mobile for better performance
  const blurAmount = useMemo(() => 
    performanceTier === 'high' ? 'blur-3xl' : 'blur-2xl', 
    [performanceTier]
  );
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className={`absolute w-96 h-96 bg-gradient-radial from-pink-300/20 to-transparent rounded-full ${blurAmount}`}
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: animationDuration.medium,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ left: '10%', top: '20%' }}
      />
      <motion.div
        className={`absolute w-80 h-80 bg-gradient-radial from-purple-300/20 to-transparent rounded-full ${blurAmount}`}
        animate={{
          x: [0, -80, 0],
          y: [0, -40, 0],
          scale: [1.2, 1, 1.2]
        }}
        transition={{
          duration: animationDuration.fast,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        style={{ right: '15%', bottom: '30%' }}
      />
      <motion.div
        className={`absolute w-72 h-72 bg-gradient-radial from-yellow-200/10 to-transparent rounded-full ${blurAmount}`}
        animate={{
          x: [0, -60, 0],
          y: [0, 60, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: animationDuration.slow,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        style={{ left: '30%', bottom: '20%' }}
      />
    </div>
  );
}

function OptimizedBackground() {
  const performanceTier = useMemo(() => detectDevicePerformance(), []);
  
  // Use a simpler image on mobile
  const backgroundImage = useMemo(() => {
    const baseUrl = "https://images.unsplash.com/photo-1469334031218-e382a71b716b";
    const quality = performanceTier === 'high' ? 'w=2070&h=1380' : 'w=1024&h=768&q=80';
    return `${baseUrl}?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&${quality}`;
  }, [performanceTier]);
  
  return (
    <div
      className="w-full h-full absolute inset-0 z-0 bg-cover bg-center"
      style={{
        backgroundImage: `url('${backgroundImage}')`,
        backgroundColor: 'transparent',
      }}
    >
      <AnimatedLights />
      <FloatingParticles />
    </div>
  );
}

export default function WebGLBackground() {
  return <OptimizedBackground />;
}
