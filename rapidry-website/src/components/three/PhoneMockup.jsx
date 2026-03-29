import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function PhoneModel({ mouseRef, wrapperRef, triggerRef }) {
  const groupRef = useRef(null);
  const ringRef = useRef(null);
  const bodyMaterialRef = useRef(null);
  const screenMaterialRef = useRef(null);
  const reflectionRef = useRef(null);
  const sweepRef = useRef(null);

  const screenTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 720;
    canvas.height = 1600;
    const context = canvas.getContext('2d');

    if (context) {
      const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#183F3A');
      gradient.addColorStop(0.6, '#0F2E2A');
      gradient.addColorStop(1, '#081E1C');
      context.fillStyle = gradient;
      context.fillRect(0, 0, canvas.width, canvas.height);

      context.fillStyle = '#0F2E2A';
      context.fillRect(0, 0, canvas.width, 140);
      context.fillStyle = '#D6B97B';
      context.font = '700 56px Source Serif 4';
      context.textAlign = 'left';
      context.fillText('RAPIDRY', 48, 90);

      const cardY = 220;
      const cardGap = 140;
      for (let i = 0; i < 3; i += 1) {
        const y = cardY + i * cardGap;
        context.fillStyle = 'rgba(24,63,58,0.9)';
        context.fillRect(48, y, canvas.width - 96, 96);
        context.fillStyle = 'rgba(214,185,123,0.6)';
        context.fillRect(64, y + 18, 120, 10);
        context.fillStyle = 'rgba(243,239,230,0.5)';
        context.fillRect(64, y + 38, 240, 8);
        context.fillStyle = 'rgba(214,185,123,0.5)';
        context.fillRect(canvas.width - 160, y + 28, 96, 6);
      }

      context.fillStyle = 'rgba(214,185,123,0.7)';
      context.fillRect(canvas.width / 2 - 90, canvas.height - 110, 180, 12);
      context.fillStyle = 'rgba(243,239,230,0.4)';
      context.fillRect(canvas.width / 2 - 60, canvas.height - 80, 120, 8);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapT = THREE.RepeatWrapping;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.repeat.set(1, 1.2);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  }, []);

  useLayoutEffect(() => {
    if (!groupRef.current || !wrapperRef.current) {
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      const triggerTarget = triggerRef?.current ?? wrapperRef.current;

      const setOpacity = (value) => {
        if (bodyMaterialRef.current) {
          bodyMaterialRef.current.opacity = value;
        }
        if (screenMaterialRef.current) {
          screenMaterialRef.current.opacity = value;
        }
        if (ringRef.current?.material) {
          ringRef.current.material.opacity = value;
        }
      };

      setOpacity(0.5);
      if (groupRef.current) {
        groupRef.current.rotation.y = Math.PI / 4;
      }

      gsap.to(groupRef.current.rotation, {
        y: 0,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: triggerTarget,
          start: 'top 80%',
          end: 'top 20%',
          scrub: 1,
        },
      });

      ScrollTrigger.create({
        trigger: triggerTarget,
        start: 'top 80%',
        end: 'top 20%',
        scrub: 1,
        onUpdate: (self) => {
          const value = 0.5 + self.progress * 0.5;
          setOpacity(value);
        },
      });

      if (ringRef.current) {
        gsap.to(ringRef.current.rotation, {
          y: Math.PI * 2,
          ease: 'none',
          scrollTrigger: {
            trigger: triggerTarget,
            start: 'top 80%',
            end: 'top 20%',
            scrub: 1,
          },
        });
      }

      if (sweepRef.current) {
        gsap.fromTo(
          sweepRef.current.position,
          { x: -0.9 },
          {
            x: 0.9,
            ease: 'none',
            scrollTrigger: {
              trigger: triggerTarget,
              start: 'top 80%',
              end: 'top 20%',
              scrub: 1,
            },
          }
        );
      }
    }, wrapperRef);

    return () => ctx.revert();
  }, [wrapperRef, triggerRef]);

  useEffect(() => () => screenTexture.dispose(), [screenTexture]);

  useFrame(({ clock }) => {
    if (!groupRef.current || !ringRef.current) {
      return;
    }

    const time = clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(time * 0.8) * 0.06;

    const targetX = mouseRef.current.y * 0.08;
    const targetY = mouseRef.current.x * 0.12;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetX, 0.05);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetY, 0.05);

    ringRef.current.rotation.x += 0.002;

    if (screenTexture) {
      screenTexture.offset.y = (screenTexture.offset.y + 0.0008) % 1;
    }
  });

  return (
    <group ref={groupRef}>
      <RoundedBox args={[1.8, 3.8, 0.18]} radius={0.18} smoothness={8}>
        <meshPhysicalMaterial ref={bodyMaterialRef} color="#0F2E2A" metalness={0.75} roughness={0.25} transparent />
      </RoundedBox>

      <mesh position={[0, 0, 0.095]}>
        <planeGeometry args={[1.55, 3.38]} />
        <meshBasicMaterial ref={screenMaterialRef} map={screenTexture} toneMapped={false} transparent />
      </mesh>

      <mesh ref={sweepRef} position={[0, 0, 0.11]}>
        <planeGeometry args={[0.4, 3.6]} />
        <meshBasicMaterial color="white" transparent opacity={0.12} />
      </mesh>

      <mesh ref={ringRef} position={[0, 0, -0.02]}>
        <torusGeometry args={[1.3, 0.015, 18, 120]} />
        <meshBasicMaterial color="#D6B97B" transparent opacity={0.9} />
      </mesh>

      <mesh ref={reflectionRef} position={[0, -2.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.4, 1.6]} />
        <meshBasicMaterial color="#D6B97B" transparent opacity={0.15} />
      </mesh>
    </group>
  );
}

export default function PhoneMockup({ triggerRef }) {
  const [isMobile, setIsMobile] = useState(() => (typeof window !== 'undefined' ? window.innerWidth < 768 : false));
  const wrapperRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    return null;
  }

  if (isMobile) {
    return null;
  }

  const handleMove = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const normalizedX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const normalizedY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    mouseRef.current.x = normalizedX;
    mouseRef.current.y = normalizedY;
  };

  return (
    <div
      ref={wrapperRef}
      className="mx-auto"
      style={{ width: '400px', height: '560px', maxWidth: '100%' }}
      onMouseMove={handleMove}
      onMouseLeave={() => {
        mouseRef.current.x = 0;
        mouseRef.current.y = 0;
      }}
    >
      <Canvas camera={{ position: [0, 0, 4.9], fov: 34 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 5, 5]} intensity={1.25} color="#F3EFE6" />
        <pointLight position={[-3, 2, -2]} intensity={1.1} color="#D6B97B" />
        <PhoneModel mouseRef={mouseRef} wrapperRef={wrapperRef} triggerRef={triggerRef} />
      </Canvas>
    </div>
  );
}
