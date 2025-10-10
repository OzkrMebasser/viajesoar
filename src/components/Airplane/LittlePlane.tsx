// Tu archivo LittlePlane.js
"use client";
import React, { useEffect, useState, useMemo } from "react"; // 👈 1. Importa useMemo
import styles from "./LittlePlane.module.css";

interface LittlePlaneProps {
  from: { top: string; left: string };
  to: { top: string; left: string };
  duration?: number;
}

const LittlePlane: React.FC<LittlePlaneProps> = ({
  from,
  to,
  duration = 20,
}) => {
  const [flying, setFlying] = useState(true);

  // 👇 2. Calcula el ángulo de rotación una sola vez
  // Tu archivo LittlePlane.js

  const rotationAngle = useMemo(() => {
    const fromX = parseFloat(from.left);
    const fromY = parseFloat(from.top);
    const toX = parseFloat(to.left);
    const toY = parseFloat(to.top);

    const deltaX = toX - fromX;
    const deltaY = toY - fromY;
    const angleInRadians = Math.atan2(deltaY, deltaX);
    const angleInDegrees = angleInRadians * (180 / Math.PI);

    return angleInDegrees + 136;
  }, [from, to]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFlying(false);
      setTimeout(() => setFlying(true), 100);
    }, duration * 1000);
    return () => clearInterval(interval);
  }, [duration]);

  return (
    <div
      className={`${styles.airplaneWrapper} ${flying ? styles.fly : ""}`}
      style={
        {
          "--from-top": from.top,
          "--from-left": from.left,
          "--to-top": to.top,
          "--to-left": to.left,
          "--duration": `${duration}s`,

          "--rotation-angle": `${rotationAngle}deg`,
        } as React.CSSProperties
      }
    >
      <div className={styles.airplane}>
        <img
          src="/avion.svg"
          alt="Airplane"
          className="w-full h-full drop-shadow-[2px_1px_1px_rgba(0,0,0,.4)]"
        />
        {/* Luces */}
        <div
          className={`${styles.light} ${styles.blinkRed}`}
          style={{ top: "10px", left: "2px" }}
        />
        <div
          className={`${styles.light} ${styles.blinkGreen}`}
          style={{ top: "2px", right: "2px" }}
        />
      </div>
    </div>
  );
};

export default LittlePlane;
