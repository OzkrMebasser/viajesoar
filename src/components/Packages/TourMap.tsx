"use client";

import { useEffect, useRef } from "react";
import { FaLocationPin } from "react-icons/fa6";
import { ImHeart } from "react-icons/im";
import { renderToStaticMarkup } from "react-dom/server";

export interface TourCity {
  name: string;
  lat: number;
  lng: number;
  isStart?: boolean;
  isEnd?: boolean;
}

export interface TourMapProps {
  cities: TourCity[];
  caption?: string;
  height?: number | string;
  zoom?: number;
  tileUrl?: string;
  showStepNumbers?: boolean;
}

function ensureLeaflet(): Promise<void> {
  return new Promise((resolve) => {
    if ((window as any).L) return resolve();

    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
      document.head.appendChild(link);
    }

    if (!document.getElementById("leaflet-js")) {
      const script = document.createElement("script");
      script.id = "leaflet-js";
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
      script.onload = () => resolve();
      document.head.appendChild(script);
    } else {
      const check = setInterval(() => {
        if ((window as any).L) { clearInterval(check); resolve(); }
      }, 50);
    }
  });
}

const LINE = "#000000";

function markerHtml(label: string): string {
  const pinIcon = renderToStaticMarkup(
    <FaLocationPin size={30} style={{ color: "var(--bg)", filter: "drop-shadow(0px 3px 6px rgba(0,0,0,.35))" }} />
  );
  const heartIcon = renderToStaticMarkup(
    <ImHeart size={12} style={{ color: "tomato" }} />
  );

  return `
    <style>
      @keyframes softSpring {
        0% { transform: translateX(0px); }
        25% { transform: translateX(-3px); }
        50% { transform: translateX(3px); }
        75% { transform: translateX(-2px); }
        100% { transform: translateX(0px); }
      }
      .marker-wrapper {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        transform: translateY(-2px);
      }
      .marker-icon {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s ease;
      }
      .marker-wrapper:hover .marker-icon { animation: softSpring 0.6s ease; }
      .marker-wrapper:active .marker-icon { animation: softSpring 0.6s ease; }
    </style>
    <div class="marker-wrapper">
      <div class="marker-icon">
        ${pinIcon}
        <div style="position:absolute;top:8px;display:flex;align-items:center;justify-content:center;">
          ${heartIcon}
        </div>
      </div>
    </div>
  `;
}

function buildZigzag(points: [number, number][], amp = 0.4, steps = 8): [number, number][] {
  const result: [number, number][] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const [lat1, lng1] = points[i];
    const [lat2, lng2] = points[i + 1];
    result.push([lat1, lng1]);
    for (let s = 1; s < steps; s++) {
      const t = s / steps;
      const midLat = lat1 + (lat2 - lat1) * t;
      const midLng = lng1 + (lng2 - lng1) * t;
      const dLat = lat2 - lat1;
      const dLng = lng2 - lng1;
      const len = Math.sqrt(dLat * dLat + dLng * dLng);
      const sine = Math.sin(s * (Math.PI / steps) * 2) * amp;
      result.push([midLat + (-dLng / len) * sine, midLng + (dLat / len) * sine]);
    }
  }
  result.push(points[points.length - 1]);
  return result;
}

export default function TourMap({
  cities,
  caption,
  height = 450,
  zoom,
  tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
}: TourMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current || cities.length === 0) return;

    let destroyed = false;

    ensureLeaflet().then(() => {
      if (destroyed || !containerRef.current) return;

      const L = (window as any).L;

      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      const map = L.map(containerRef.current, {
        zoomControl: true,
        scrollWheelZoom: false,
        attributionControl: true,
      });

      mapRef.current = map;

      L.tileLayer(tileUrl, {
        attribution: '© <a href="https://osm.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map);

      const latlngs = cities.map((c) => [c.lat, c.lng] as [number, number]);

      L.polyline(buildZigzag(latlngs), {
        color: LINE,
        weight: 3,
        opacity: 1,
        lineJoin: "round",
        lineCap: "round",
      }).addTo(map);

      cities.forEach((city) => {
        const icon = L.divIcon({
          html: markerHtml(city.name),
          className: "",
          iconSize: [30, 30],
          iconAnchor: [15, 30],
        });

        const marker = L.marker([city.lat, city.lng], { icon }).addTo(map);

        marker.bindTooltip(city.name, {
          permanent: true,
          direction: "top",
          offset: [0, -34],
          className: "city-tooltip",
        });
      });

      if (zoom) {
        map.setView(latlngs[0], zoom);
      } else {
        const bounds = L.latLngBounds(latlngs);
        map.fitBounds(bounds, { padding: [32, 32] });
      }
    });

    return () => {
      destroyed = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [cities]);

  return (
    <div>
      <div
        ref={containerRef}
        style={{
          height: typeof height === "number" ? `${height}px` : height,
          width: "100%",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      />
      {caption && (
        <p className="mt-2 fontOutfit italic text-xs text-[var(--text)]/70">
          {caption}
        </p>
      )}
    </div>
  );
}