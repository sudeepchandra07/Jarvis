// src/components/Tilt3D.jsx
import { useRef, useState } from "react";

export default function Tilt3D({ children, className = "", intensity = 10 }) {
  const ref = useRef(null);
  const [transform, setTransform] = useState("");

  const handleMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTransform(
      `perspective(900px) rotateY(${x * intensity}deg) rotateX(${-y * intensity}deg) scale3d(1.015, 1.015, 1.015)`
    );
  };

  const handleMouseLeave = () => {
    setTransform("perspective(900px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)");
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{
        transform: transform || "perspective(900px) rotateY(0deg) rotateX(0deg)",
        transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}