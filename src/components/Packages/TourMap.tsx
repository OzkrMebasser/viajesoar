"use client";

import { useEffect, useRef } from "react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface TourCity {
  name: string;
  lat: number;
  lng: number;
  isStart?: boolean; // renders green marker
  isEnd?: boolean;   // renders red   marker
}

export interface TourMapProps {
  cities: TourCity[];
  /** Caption shown below the map */
  caption?: string;
  /** Height of the map container (default 320px) */
  height?: number | string;
  /** Initial zoom level (default auto-fit) */
  zoom?: number;
  /** Leaflet tile URL — defaults to OpenStreetMap */
  tileUrl?: string;
  /** Show numeric step labels on each marker */
  showStepNumbers?: boolean;
}



/** Inject Leaflet CSS + JS from CDN only once */
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
      // script already added – wait for it
      const check = setInterval(() => {
        if ((window as any).L) {
          clearInterval(check);
          resolve();
        }
      }, 50);
    }
  });
}

// Brand colors
const BLUE   = "#0049fc";
const GREEN  = "#22c55e";
const RED    = "#ef4444";
const WHITE  = "#ffffff";
const LINE   = "#000000";

function markerHtml(
  fill: string,
  label: string,
  showStep: boolean,
  step: number
): string {
  return `
    <div style="
      position:relative;
      display:flex;
      flex-direction:column;
      align-items:center;
      pointer-events:none;
    ">
      <div style="
        background:${fill};
        border: 2px solid ${WHITE};
        border-radius: 50%;
        width: 20px;
        height: 20px;
        box-shadow: 0 1px 4px rgba(0,0,0,.35);
        display:flex;
        align-items:center;
        justify-content:center;
        font-size:9px;
        font-weight:700;
        color:${WHITE};
        font-family: 'Outfit', sans-serif;
      ">${showStep ? step : ""}</div>
      <div style="
        margin-top:3px;
        background:${BLUE};
        color:${WHITE};
        font-family:'Outfit',sans-serif;
        font-size:10px;
        font-weight:600;
        padding:2px 6px;
        border-radius:4px;
        white-space:nowrap;
        box-shadow:0 1px 3px rgba(0,0,0,.3);
        letter-spacing:.01em;
      ">${label}</div>
    </div>
  `;
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export default function TourMap({
  cities,
  caption,
  height = 450,
  zoom,
  tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  showStepNumbers = false,
}: TourMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current || cities.length === 0) return;

    let destroyed = false;

    ensureLeaflet().then(() => {
      if (destroyed || !containerRef.current) return;

      const L = (window as any).L;

      // Destroy existing instance if re-rendering
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

      // Tile layer
      L.tileLayer(tileUrl, {
        attribution: '© <a href="https://osm.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map);

      const latlngs = cities.map((c) => [c.lat, c.lng] as [number, number]);

      // Polyline connecting all cities
      L.polyline(latlngs, {
        color: LINE,
        weight: 3,
        opacity: 1,
        lineJoin: "round",
        lineCap: "round",
      }).addTo(map);

      // Markers
      cities.forEach((city, i) => {
        const fill =
          city.isStart ? GREEN
          : city.isEnd ? RED
          : BLUE;

        const icon = L.divIcon({
          html: markerHtml(fill, city.name, showStepNumbers, i + 1),
          className: "",
          iconAnchor: [0, 10],
          popupAnchor: [0, -15],
        });

        L.marker([city.lat, city.lng], { icon })
          .addTo(map)
          .bindPopup(`<b style="font-family:Outfit,sans-serif">${city.name}</b>`);
      });

      // Fit map to markers
      if (zoom) {
        const center = latlngs[0];
        map.setView(center, zoom);
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <p className="mt-2 fontOutfit italic text-xs text-[#051D2E]/70">
          {caption}
        </p>
      )}
    </div>
  );
}