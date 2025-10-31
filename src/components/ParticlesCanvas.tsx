"use client";
import React, { use, useEffect, useRef, useState } from "react";
import { useTheme } from "@/lib/context/ThemeContext";

// Particles Canvas Component
const ParticlesCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
    }> = [];

    const particleCount = 7; // máximo 7 partículas

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
        vx: (Math.random() - 0.5) * 0.5, // velocidad base más lenta
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 3 + 1,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, idx) => {
        // Movimiento básico
        p.x += p.vx;
        p.y += p.vy;

        // Reaparecen al borde
        if (p.x > canvas.width) p.x = 0;
        if (p.x < 0) p.x = canvas.width;
        if (p.y > canvas.height) p.y = 0;
        if (p.y < 0) p.y = canvas.height;

        // Interacción con el mouse
        const dx = mouse.current.x - p.x;
        const dy = mouse.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const influence = 120;
        const maxForce = 0.2;

        if (dist < influence) {
          const angle = Math.atan2(dy, dx);
          const force = ((influence - dist) / influence) * maxForce;
          p.vx -= Math.cos(angle) * force;
          p.vy -= Math.sin(angle) * force;
        }

        // Limitar velocidad
        const maxSpeed = 1;
        p.vx = Math.max(Math.min(p.vx, maxSpeed), -maxSpeed);
        p.vy = Math.max(Math.min(p.vy, maxSpeed), -maxSpeed);

        ctx.fillStyle = colors[idx % colors.length];
        ctx.globalAlpha = 0.5;
        // bubbles
        // ctx.beginPath();
        // ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        // ctx.fill();
        // squares
        ctx.beginPath();
        ctx.rect(p.x - p.radius, p.y - p.radius, p.radius * 2, p.radius * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [theme]);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" />;
};
export default ParticlesCanvas;
