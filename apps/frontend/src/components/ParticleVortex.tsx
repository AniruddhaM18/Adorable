import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const ParticleSystem: React.FC = () => {
    const pointsRef = useRef<THREE.Points>(null);
    const particleCount = 2500; // Reduced particle count for cleaner appearance

    // Mouse position tracking with smooth easing
    const mouseTarget = useRef({ x: 0, y: 0 });
    const mouseCurrent = useRef({ x: 0, y: 0 });

    const { viewport } = useThree();

    const particlesData = useRef<Array<{
        radius: number;
        angle: number;
        speed: number;
        opacity: number;
        color: THREE.Color;
        baseRadius: number;
    }>>([]);

    // Track mouse movement
    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            // Normalize mouse position to -1 to 1 range
            mouseTarget.current.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouseTarget.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Initialize particle data with ring/vortex distribution matching Google Antigravity
    const [geometry, material] = useMemo(() => {
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        const angles = new Float32Array(particleCount); // Store rotation angle for tangential orientation

        // Exact Google blue color
        const googleBlue = new THREE.Color(0x4285F4);

        particlesData.current = [];

        for (let i = 0; i < particleCount; i++) {
            const t = i / particleCount;

            // Distribution: 40% in ring, 60% scattered for more spread
            const isRingParticle = Math.random() < 0.4;

            let radius;
            if (isRingParticle) {
                // Ring particles - wider spread
                radius = 3.5 + (Math.random() - 0.5) * 2.0;
            } else {
                // Scattered particles - expanded range
                radius = 1.5 + Math.random() * 5.5;
            }

            const angle = t * Math.PI * 24; // Dense spiral distribution
            // Varied speed with slight randomness for organic feel
            const speed = 0.25 + Math.random() * 0.35;

            const opacity = 0.4 + Math.random() * 0.6;

            particlesData.current.push({
                radius,
                angle,
                speed,
                opacity,
                color: googleBlue.clone(),
                baseRadius: radius,
            });

            // Initial positions
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = 0;

            colors[i * 3] = googleBlue.r;
            colors[i * 3 + 1] = googleBlue.g;
            colors[i * 3 + 2] = googleBlue.b;

            // Particle sizes - varied for depth
            sizes[i] = 0.04 + Math.random() * 0.06;

            // Store angle for tangential orientation
            angles[i] = angle;
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        geo.setAttribute('angle', new THREE.BufferAttribute(angles, 1));

        // Custom shader material with tangential orientation for motion blur
        const mat = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
            },
            vertexShader: `
        attribute float size;
        attribute float angle;
        varying vec3 vColor;
        varying float vOpacity;
        varying float vAngle;
        
        void main() {
          vColor = color;
          vOpacity = 0.85;
          vAngle = angle;
          
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          
          // Optimized point size for crisp rendering
          gl_PointSize = size * 900.0 / -mvPosition.z;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
            fragmentShader: `
        varying vec3 vColor;
        varying float vOpacity;
        varying float vAngle;
        
        void main() {
          vec2 center = gl_PointCoord - vec2(0.5);
          
          // Rotate to align with tangential direction (perpendicular to radius)
          float tangentAngle = vAngle + 1.5708; // +90 degrees for tangent
          float cosA = cos(tangentAngle);
          float sinA = sin(tangentAngle);
          vec2 rotated = vec2(
            center.x * cosA - center.y * sinA,
            center.x * sinA + center.y * cosA
          );
          
          // Create elongated dash shape (4:1 aspect ratio for motion blur)
          vec2 stretched = rotated * vec2(0.25, 1.8);
          float dist = length(stretched);
          
          // Soft glow with smooth falloff
          float alpha = smoothstep(0.5, 0.0, dist) * vOpacity;
          
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            vertexColors: true,
        });

        return [geo, mat];
    }, [particleCount]);

    // Animation loop with refined mouse interaction
    useFrame((state, delta) => {
        if (!pointsRef.current) return;

        const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
        const angles = pointsRef.current.geometry.attributes.angle.array as Float32Array;
        const time = state.clock.getElapsedTime();

        // Smooth mouse following with refined easing (matching Google Antigravity)
        const easeSpeed = 0.06;
        mouseCurrent.current.x += (mouseTarget.current.x - mouseCurrent.current.x) * easeSpeed;
        mouseCurrent.current.y += (mouseTarget.current.y - mouseCurrent.current.y) * easeSpeed;

        // Convert mouse position to world space offset with subtle parallax
        const mouseOffsetX = mouseCurrent.current.x * viewport.width * 0.35;
        const mouseOffsetY = mouseCurrent.current.y * viewport.height * 0.35;

        particlesData.current.forEach((particle, i) => {
            // Update angle for rotation with delta time for consistent speed
            particle.angle += particle.speed * delta;

            // Very subtle pulsing/breathing effect
            const pulse = Math.sin(time * 0.6 + particle.angle * 0.3) * 0.08;
            const currentRadius = particle.baseRadius * (1 + pulse);

            // Calculate base position with mouse offset (vortex follows mouse)
            let x = Math.cos(particle.angle) * currentRadius + mouseOffsetX;
            let y = Math.sin(particle.angle) * currentRadius + mouseOffsetY;

            // Add subtle wavy motion - sinusoidal displacement
            const waveFrequency = 2.0;
            const waveAmplitude = 0.05; // Reduced for subtle effect
            const waveX = Math.sin(time * waveFrequency + particle.angle * 3) * waveAmplitude;
            const waveY = Math.cos(time * waveFrequency + particle.angle * 2.5) * waveAmplitude;

            x += waveX;
            y += waveY;

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = 0;

            // Update angle attribute for tangential orientation
            angles[i] = particle.angle;
        });

        pointsRef.current.geometry.attributes.position.needsUpdate = true;
        pointsRef.current.geometry.attributes.angle.needsUpdate = true;

        // Update time uniform
        if (pointsRef.current.material instanceof THREE.ShaderMaterial) {
            pointsRef.current.material.uniforms.time.value = time;
        }
    });

    return <points ref={pointsRef} geometry={geometry} material={material} />;
};

const ParticleVortex: React.FC = () => {
    return (
        <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 1, pointerEvents: 'none' }}>
            <Canvas
                camera={{ position: [0, 0, 10], fov: 60 }}
                style={{
                    background: 'transparent',
                    width: '100%',
                    height: 'calc(100vh - 60px)',
                    position: 'absolute',
                    top: '60px',
                    left: 0,
                }}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: 'high-performance',
                }}
            >
                <ParticleSystem />
            </Canvas>
        </div>
    );
};

export default ParticleVortex;