"use client";
import React from "react";
import styles from "./AirplaneUp.module.css";
import VerticalRunway from "./VerticalRunway";

const AirplaneUp = () => {
  return (
    <div className="fixed pointer-events-none z-50" style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
      <div
        className={styles.cursorAirplane}
        style={{
          transform: `rotate(45deg)`, 
        }}
      >
        <img
          src="/airplane-white.svg"
          alt="Airplane"
          className="w-full h-full drop-shadow-[4px_5px_5px_rgba(0,0,0,.5)]"
        />
        <div className={styles.cockpitWindow} />
        <div className={styles.cockpitWindowFront} />

        {/* Luces */}
        <div
          className={`${styles.blinkRed} ${styles.light}`}
          style={{
            bottom: "5px",
            left: "8px",
          }}
        />
        <div
          className={`${styles.blinkGreen} ${styles.light}`}
          style={{
            top: "8px",
            right: "8px",
          }}
        />
      </div>
      {/* Runway */}
      {/* <div className="relative">
        <VerticalRunway />
      </div> */}
     

    </div>
  );
};

export default AirplaneUp;
