import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { useThree } from '@react-three/fiber';
import { Plane, shaderMaterial, useTexture } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import * as THREE from 'three';

// Custom shader material for the effect
const ImageShaderMaterial = shaderMaterial(
  {
    map: null,
    time: 0,
    strength: 0.15, // Wave strength
    frequency: 2.0, // Wave frequency
    amplitude: 0.015, // Wave amplitude
    mousePosition: new THREE.Vector2(0, 0),
    resolution: new THREE.Vector2(1, 1),
    quality: 1.0, // 1.0 = high quality, 0.5 = medium, 0.25 = low
  },
  // Vertex shader
  `
    varying vec2 vUv;
    uniform float time;
    uniform float strength;
    uniform float frequency;
    uniform float amplitude;
    uniform vec2 mousePosition;
    uniform float quality;
    
    void main() {
      vUv = uv;
      
      // Subtle vertex displacement for waves
      vec3 pos = position;
      
      // Apply quality-based adjustments while maintaining visual appearance
      // By multiplying both frequency and amplitude by quality, we keep visual proportion
      float appliedFrequency = frequency * min(quality * 1.5, 1.0);
      float appliedAmplitude = amplitude * min(quality * 1.5, 1.0);
      
      // Create a subtle flowing wave effect
      float sinWave = sin(pos.y * appliedFrequency + time * 0.4) * appliedAmplitude;
      float cosWave = cos(pos.x * appliedFrequency + time * 0.4) * appliedAmplitude;
      
      // Add mouse interaction - subtle parallax
      float mouseEffect = 0.02 * min(quality * 1.5, 1.0); // Strength of mouse effect
      pos.x += (mousePosition.x * mouseEffect);
      pos.y += (mousePosition.y * mouseEffect);
      
      // Combine effects
      pos.z += (sinWave + cosWave) * strength;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  // Fragment shader
  `
    varying vec2 vUv;
    uniform sampler2D map;
    uniform float time;
    uniform vec2 mousePosition;
    uniform vec2 resolution;
    uniform float quality;
    
    void main() {
      // Calculate distortion effect
      vec2 uv = vUv;
      
      // Adaptive distortion based on quality
      float appliedDistortionStrength = 0.015 * min(quality * 1.2, 1.0);
      
      // Subtle UV distortion based on mouse position
      uv.x += sin(uv.y * 10.0 * quality + time * 0.5) * appliedDistortionStrength * (0.5 + mousePosition.x * 0.5);
      uv.y += cos(uv.x * 10.0 * quality + time * 0.5) * appliedDistortionStrength * (0.5 + mousePosition.y * 0.5);
      
      // Apply a subtle warm tint to the image (peach/cream tone)
      vec4 texColor = texture2D(map, uv);
      
      // Add a soft vignette effect
      vec2 center = vec2(0.5, 0.5);
      float dist = distance(vUv, center);
      float vignette = smoothstep(0.5, 0.2, dist);
      
      // Burgundy color (#8B3A3A) in RGB is roughly (139/255, 58/255, 58/255)
      vec3 burgundy = vec3(0.545, 0.227, 0.227);
      vec3 peach = vec3(1.0, 0.89, 0.82);
      
      // Create a gradient based on mouse position for dynamic lighting
      float mouseLight = pow(1.0 - distance(vUv, (mousePosition + 1.0) * 0.5), 1.5) * 0.15;
      
      // Subtle color grading - warming up the image
      vec3 tintedColor = mix(texColor.rgb, texColor.rgb * vec3(1.05, 1.02, 0.95), 0.4);
      
      // Apply a subtle burgundy tone to shadows and add mouse-based highlight
      tintedColor = mix(mix(tintedColor, burgundy, 0.08), tintedColor, vignette);
      tintedColor = mix(tintedColor, mix(tintedColor, peach, 0.5), mouseLight);
      
      // Add subtle pulsing glow effect - adjusted by quality
      float appliedPulse = 0.5 + 0.5 * sin(time * 0.5 * min(quality, 1.0));
      tintedColor += vec3(appliedPulse * 0.03, appliedPulse * 0.02, 0.0);
      
      gl_FragColor = vec4(tintedColor, texColor.a);
    }
  `
);

// Extend three with our custom material
extend({ ImageShaderMaterial });

// Type definition for the custom shader
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'imageShaderMaterial': any;
    }
  }
}

// Helper function to detect device capability
function detectDevicePerformance() {
  // Check for mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Check device memory if available
  const lowMemory = (navigator as any).deviceMemory !== undefined && (navigator as any).deviceMemory < 4;
  
  // Set quality based on device capability
  if (isMobile || lowMemory) {
    return 0.5; // Medium quality for mobile
  }
  
  return 1.0; // High quality for desktop
}

// The plane that will have our image and shader
function ImagePlane({ 
  imageUrl, 
  mousePosition, 
  quality,
  frameSkip = 1,
  onLoad
}: { 
  imageUrl: string, 
  mousePosition: THREE.Vector2,
  quality: number,
  frameSkip?: number,
  onLoad?: () => void
}) {
  const materialRef = useRef<any>();
  const texture = useLoader(TextureLoader, imageUrl, () => {
    onLoad?.();
  });
  const { viewport, size } = useThree();
  const frameCountRef = useRef(0);
  
  // Optimize texture based on device capability
  useEffect(() => {
    if (texture) {
      // Use appropriate texture filtering
      texture.minFilter = quality < 0.8 ? THREE.LinearFilter : THREE.LinearMipmapLinearFilter;
      texture.generateMipmaps = quality >= 0.8;
      texture.needsUpdate = true;
    }
  }, [texture, quality]);
  
  // Update shader uniforms when viewport changes
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.resolution.set(size.width, size.height);
      materialRef.current.quality = quality;
    }
  }, [size, quality]);
  
  // Animation loop with frame skipping for performance
  useFrame((state) => {
    frameCountRef.current = (frameCountRef.current + 1) % frameSkip;
    if (frameCountRef.current !== 0) return;
    
    if (materialRef.current) {
      materialRef.current.time = state.clock.getElapsedTime();
      materialRef.current.mousePosition.copy(mousePosition);
    }
  });

  // Calculate aspect ratio to fit the image properly
  const imageAspect = 1.5; // Approximate aspect of the model image
  let planeWidth = 4;
  let planeHeight = planeWidth / imageAspect;

  // Adjust based on viewport to fill the screen
  if (viewport.aspect < imageAspect) {
    planeWidth = viewport.width;
    planeHeight = planeWidth / imageAspect;
  } else {
    planeHeight = viewport.height;
    planeWidth = planeHeight * imageAspect;
  }

  return (
    <Plane args={[planeWidth, planeHeight]} position={[0, 0, 0]}>
      <imageShaderMaterial 
        ref={materialRef} 
        map={texture} 
        transparent 
        strength={0.15}
        frequency={2.0}
        amplitude={0.015}
        mousePosition={mousePosition}
        resolution={new THREE.Vector2(size.width, size.height)}
        quality={quality}
      />
    </Plane>
  );
}

export default function WebGLHero({ 
  imageUrl,
  children
}: { 
  imageUrl: string;
  children?: React.ReactNode;
}) {
  // Check for WebGL support
  const [hasWebGL, setHasWebGL] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Detect device performance once on component mount
  const quality = useMemo(() => detectDevicePerformance(), []);
  
  // Calculate frameSkip based on quality
  const frameSkip = useMemo(() => quality < 0.8 ? 2 : 1, [quality]);
  
  // Track mouse position for interactive effects
  const [mousePosition, setMousePosition] = useState(new THREE.Vector2(0, 0));
  
  // Check for WebGL support
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setHasWebGL(!!gl);
    } catch (e) {
      setHasWebGL(false);
      console.warn('WebGL not supported, falling back to static image');
    }
  }, []);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    // Convert mouse position to normalized coordinates (-1 to 1)
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -(e.clientY / window.innerHeight) * 2 + 1;
    setMousePosition(new THREE.Vector2(x, y));
  };
  
  // For touch devices
  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      const x = (touch.clientX / window.innerWidth) * 2 - 1;
      const y = -(touch.clientY / window.innerHeight) * 2 + 1;
      setMousePosition(new THREE.Vector2(x, y));
    }
  };

  // Fallback for devices without WebGL
  if (!hasWebGL) {
    return (
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center" 
        style={{backgroundImage: `url(${imageUrl})`}}
      >
        {children && (
          <div className="absolute inset-0 z-10">
            {children}
          </div>
        )}
      </div>
    );
  }

  return (
    <div 
      className="absolute inset-0 w-full h-full" 
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse" />
      )}
      <Canvas 
        camera={{ position: [0, 0, 2] }}
        gl={{
          powerPreference: 'high-performance',
          antialias: quality >= 0.8,
          depth: false,
          stencil: false
        }}
      >
        <ImagePlane 
          imageUrl={imageUrl} 
          mousePosition={mousePosition} 
          quality={quality}
          frameSkip={frameSkip}
          onLoad={() => setIsLoaded(true)}
        />
      </Canvas>
      {children && (
        <div className="absolute inset-0 z-10">
          {children}
        </div>
      )}
    </div>
  );
} 