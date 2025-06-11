import React, { useEffect, useRef, useMemo } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  opacity: number;
}

interface FloatingOrb {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  hue: number;
  life: number;
}

// Helper function to detect device capability
function detectDevicePerformance() {
  // Check for mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Check device memory if available
  const lowMemory = (navigator as any).deviceMemory !== undefined && (navigator as any).deviceMemory < 4;
  
  // Set quality based on device capability
  if (isMobile || lowMemory) {
    return 'low';
  }
  
  return 'high';
}

const WebGLLuxuryEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const orbsRef = useRef<FloatingOrb[]>([]);
  const frameCountRef = useRef(0);
  
  // Detect device performance once
  const performanceTier = useMemo(() => detectDevicePerformance(), []);
  
  // Configure based on device capability
  const config = useMemo(() => ({
    particleCount: performanceTier === 'high' ? 40 : 20,
    orbCount: performanceTier === 'high' ? 6 : 3,
    frameSkip: performanceTier === 'high' ? 1 : 2,
    particleMaxSize: performanceTier === 'high' ? 2 : 1.5,
    orbMaxSize: performanceTier === 'high' ? 60 : 40
  }), [performanceTier]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    
    // Use a debounced resize event for better performance
    let resizeTimeoutId: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimeoutId);
      resizeTimeoutId = setTimeout(resizeCanvas, 250);
    };
    window.addEventListener('resize', handleResize);

    // Initialize warm-toned particles
    const particles: Particle[] = [];
    for (let i = 0; i < config.particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        life: Math.random() * 100,
        maxLife: 100 + Math.random() * 100,
        size: Math.random() * config.particleMaxSize + 1,
        opacity: Math.random() * 0.6 + 0.2
      });
    }
    particlesRef.current = particles;

    // Initialize floating orbs
    const orbs: FloatingOrb[] = [];
    for (let i = 0; i < config.orbCount; i++) {
      orbs.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * config.orbMaxSize + 40,
        hue: Math.random() * 30 + 15, // Warm oranges and yellows
        life: 0
      });
    }
    orbsRef.current = orbs;

    const animate = () => {
      // Skip frames for performance on mobile
      frameCountRef.current = (frameCountRef.current + 1) % config.frameSkip;
      if (frameCountRef.current !== 0 && performanceTier === 'low') {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create subtle warm gradient overlay
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, 'rgba(255, 204, 153, 0.15)');
      gradient.addColorStop(0.5, 'rgba(255, 179, 102, 0.12)');
      gradient.addColorStop(1, 'rgba(255, 140, 66, 0.15)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw floating orbs
      orbs.forEach((orb) => {
        orb.x += orb.vx;
        orb.y += orb.vy;
        orb.life += 0.02;

        // Wrap around screen
        if (orb.x < -orb.size) orb.x = canvas.width + orb.size;
        if (orb.x > canvas.width + orb.size) orb.x = -orb.size;
        if (orb.y < -orb.size) orb.y = canvas.height + orb.size;
        if (orb.y > canvas.height + orb.size) orb.y = -orb.size;

        // Create breathing effect
        const breathe = Math.sin(orb.life) * 0.3 + 0.7;
        const currentSize = orb.size * breathe;
        const alpha = Math.sin(orb.life * 0.5) * 0.2 + 0.3;

        // Draw orb with warm glow
        const orbGradient = ctx.createRadialGradient(
          orb.x, orb.y, 0,
          orb.x, orb.y, currentSize
        );
        orbGradient.addColorStop(0, `hsla(${orb.hue}, 70%, 60%, ${alpha * 0.6})`);
        orbGradient.addColorStop(0.4, `hsla(${orb.hue}, 80%, 65%, ${alpha * 0.4})`);
        orbGradient.addColorStop(1, `hsla(${orb.hue}, 90%, 70%, 0)`);

        ctx.fillStyle = orbGradient;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, currentSize, 0, Math.PI * 2);
        ctx.fill();
      });

      // Update and draw particles
      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life += 1;

        // Wrap around screen
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Reset particle if it's too old
        if (particle.life > particle.maxLife) {
          particle.life = 0;
          particle.x = Math.random() * canvas.width;
          particle.y = Math.random() * canvas.height;
          particle.opacity = Math.random() * 0.6 + 0.2;
        }

        // Draw particle with warm glow
        const alpha = Math.sin((particle.life / particle.maxLife) * Math.PI) * particle.opacity;
        const glowSize = particle.size * 2;

        // Outer glow
        const particleGradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, glowSize
        );
        particleGradient.addColorStop(0, `rgba(255, 204, 102, ${alpha * 0.8})`);
        particleGradient.addColorStop(0.5, `rgba(255, 179, 71, ${alpha * 0.4})`);
        particleGradient.addColorStop(1, 'rgba(255, 153, 51, 0)');

        ctx.fillStyle = particleGradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, glowSize, 0, Math.PI * 2);
        ctx.fill();

        // Inner particle
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.6})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeoutId);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [config, performanceTier]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ 
        zIndex: 1
      }}
    />
  );
};

export default WebGLLuxuryEffect; 