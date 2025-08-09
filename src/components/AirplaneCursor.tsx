"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "./AirplaneCursor.module.css";

const AirplaneCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(135); // Estado inicial hacia arriba-izquierda
  const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>([]);
  const [isMoving, setIsMoving] = useState(false);
  const [windStreaks, setWindStreaks] = useState<{ id: number; delay: number }[]>([]);
  const lastMoveRef = useRef<number>(0);
  const mouseMovingTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Mostrar estelas iniciales
    setWindStreaks([
      { id: 1, delay: 0 },
      { id: 2, delay: 100 },
      { id: 3, delay: 200 },
      { id: 4, delay: 300 }
    ]);

    const updatePosition = (e: MouseEvent) => {
      const now = Date.now();
      const newPosition = { x: e.clientX, y: e.clientY };

      // Limpiar timeout previo
      if (mouseMovingTimeout.current) clearTimeout(mouseMovingTimeout.current);

      // Está en movimiento → ocultar estelas
      setIsMoving(true);
      setWindStreaks([]);

      // Calcular ángulo y girar al instante
      const deltaX = newPosition.x - position.x;
      const deltaY = newPosition.y - position.y;
      if (Math.abs(deltaX) > 0.5 || Math.abs(deltaY) > 0.5) {
        const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
        setRotation(angle + 135); // Apuntar morro al cursor
      }

      // Timeout para volver a orientación inicial y mostrar estelas
      mouseMovingTimeout.current = setTimeout(() => {
        setRotation(135); // Orientación reposo
        setIsMoving(false);
        setWindStreaks([
          { id: 1, delay: 0 },
          { id: 2, delay: 100 },
          { id: 3, delay: 200 },
          { id: 4, delay: 300 }
        ]);
      }, 300);

      setPosition(newPosition);

      // Trail de movimiento
      if (now - lastMoveRef.current > 30) {
        lastMoveRef.current = now;
        const id = Math.random();
        setTrail((prev) => [...prev, { x: e.clientX, y: e.clientY, id }]);
        setTimeout(() => {
          setTrail((prev) => prev.filter((p) => p.id !== id));
        }, 800);
      }
    };

    window.addEventListener("mousemove", updatePosition);
    return () => {
      window.removeEventListener("mousemove", updatePosition);
      if (mouseMovingTimeout.current) clearTimeout(mouseMovingTimeout.current);
    };
  }, [position.x, position.y]);

  return (
    <>
 

      {/* Trayectoria */}
      {isMoving &&
        trail.map((dot) => (
          <div
            key={dot.id}
            className={styles.trailDot}
            style={{
              left: dot.x,
              top: dot.y,
            }}
          />
        ))}

      {/* Avión */}
      <div
        className={`fixed pointer-events-none z-50 ${styles.cursorWrapper}`}
        style={{
          left: position.x,
          top: position.y,
        }}
      >
        <div
          className={styles.cursorAirplane}
          style={{
            transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
          }}
        >
          <img
            src="/airplane-white.svg"
            alt="Airplane"
            className="w-full h-full drop-shadow-[4px_5px_5px_rgba(0,0,0,.5)]"
          />
          <div className={styles.cockpitWindow} />

          {/* Estelas cuando está quieto */}
        {!isMoving &&
  windStreaks.map((streak) => (
    <div
      key={streak.id}
      className={styles.windStreak}
      style={{
        animationDelay: `${streak.delay}ms`
      }}
    />
  ))
}
          {/* Luces */}
          <div
            className={`${styles.blinkRed} ${styles.light}`}
            style={{
              top: "24px",
              left: "3px",
            }}
          />
          <div
            className={`${styles.blinkGreen} ${styles.light}`}
            style={{
              top: "4px",
              right: "4px",
            }}
          />
        </div>
      </div>
    </>
  );
};

export default AirplaneCursor;
