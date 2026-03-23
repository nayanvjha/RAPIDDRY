import { useRef } from 'react';

export default function useMagnetic(strength = 16) {
  const ref = useRef(null);

  const handleMouseMove = (event) => {
    const node = ref.current;
    if (!node) {
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const rect = node.getBoundingClientRect();
    const relX = event.clientX - rect.left - rect.width / 2;
    const relY = event.clientY - rect.top - rect.height / 2;
    const x = (relX / rect.width) * strength;
    const y = (relY / rect.height) * strength;

    node.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  const handleMouseLeave = () => {
    const node = ref.current;
    if (!node) {
      return;
    }

    node.style.transform = 'translate3d(0, 0, 0)';
  };

  return { ref, handleMouseMove, handleMouseLeave };
}
