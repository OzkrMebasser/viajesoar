"use client";
import React, { useEffect, useRef } from "react";
import { useTheme } from "@/lib/context/ThemeContext";

const CardParticlesCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const resize = () => {
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };

    resize();

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      rotation: number;
      rotationSpeed: number;
    }> = [];

    const particleCount = 7; 

    let colors: string[] = [];

    if (theme === "dark") {
      colors = ["#14b8a6", "#0891b2", "#0d9488", "#0ea5e9", "#01ac9d"];
    } else if (theme === "light") {
      colors = ["#0891b2", "#01ac9d", "#0d9488", "#0e7490", "#a8c7e6"];
    } else {
      colors = ["#014e7d", "#4af0d8", "#7bd2ff", "#32ff7e", "#4af0d8"];
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 2 + 1.5,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.015,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        // Rebote dentro del card
        if (p.x <= 0 || p.x >= canvas.width) p.vx *= -1;
        if (p.y <= 0 || p.y >= canvas.height) p.vy *= -1;

        // Interacción SOLO dentro del card
        const dx = mouse.current.x - p.x;
        const dy = mouse.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const influence = 80;
        const maxForce = 0.15;

        if (dist < influence) {
          const angle = Math.atan2(dy, dx);
          const force = ((influence - dist) / influence) * maxForce;
          p.vx -= Math.cos(angle) * force;
          p.vy -= Math.sin(angle) * force;
        }

        const maxSpeed = 0.6;
        p.vx = Math.max(Math.min(p.vx, maxSpeed), -maxSpeed);
        p.vy = Math.max(Math.min(p.vy, maxSpeed), -maxSpeed);

        ctx.fillStyle = colors[idx % colors.length];
        ctx.globalAlpha = 0.35;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        ctx.fillRect(-p.radius, -p.radius, p.radius * 2, p.radius * 2);

        ctx.restore();
      });

      ctx.globalAlpha = 1;
      requestAnimationFrame(animate);
    };

    animate();

    const observer = new ResizeObserver(resize);
    observer.observe(parent);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = e.clientX - rect.left;
      mouse.current.y = e.clientY - rect.top;
    };

    parent.addEventListener("mousemove", handleMouseMove);

    return () => {
      observer.disconnect();
      parent.removeEventListener("mousemove", handleMouseMove);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
    />
  );
};

export default CardParticlesCanvas;