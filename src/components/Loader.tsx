// page.tsx o donde uses el componente
"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler";
import { gsap } from "gsap"; // <--- 1. Importa GSAP

interface ExtendedGroup extends THREE.Group {
  speed?: number;
  reverse?: boolean;
}

const ThreeLoading = () => {
  const preloaderRef = useRef<HTMLDivElement>(null); // Ref para el contenedor principal
  const canvasRef = useRef<HTMLDivElement>(null); // Ref para el canvas de Three.js
  const [isVisible, setIsVisible] = useState(true); // Estado para controlar la visibilidad

  useEffect(() => {
    if (!canvasRef.current || !preloaderRef.current) return;

    // --- Tu código de Three.js sin cambios ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 100, 250);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvasRef.current.appendChild(renderer.domElement);
    const controls = new TrackballControls(camera, renderer.domElement);
    controls.noPan = true;
    controls.maxDistance = 600;
    controls.minDistance = 150;
    controls.rotateSpeed = 2;
    const group = new THREE.Group();
    scene.add(group);
    group.rotation.y = 2;
    const subgroups: ExtendedGroup[] = [];
    let sampler: MeshSurfaceSampler | null = null;
    const paths: Path[] = [];
    const airplaneLoader = new OBJLoader();
    airplaneLoader.load("https://assets.codepen.io/127738/Airplane_model2.obj", (obj) => {
      const airplane = obj;
      const mat = new THREE.MeshPhongMaterial({
        emissive: 0xffffff,
        emissiveIntensity: 0.3,
      });
      airplane.children.forEach((child: any) => {
        child.geometry.scale(0.013, 0.013, 0.013);
        child.geometry.translate(0, 122, 0);
        child.material = mat;
      });
      const angles = [0.3, 1.3, 2.14, 2.6];
      const speeds = [0.032, 0.04, 0.056, 0.08];
      const rotations = [0, 2.6, 1.5, 4];
      for (let i = 0; i < 4; i++) {
        const g: ExtendedGroup = new THREE.Group();
        g.speed = speeds[i];
        g.reverse = i < 2;
        subgroups.push(g);
        group.add(g);
        const g2 = new THREE.Group();
        const _airplane = airplane.clone();
        g.add(g2);
        g2.add(_airplane);
        g2.rotation.x = rotations[i];
        g.rotation.y = angles[i];
        if (i < 2) {
          const geom = (airplane.children[0] as THREE.Mesh).geometry.clone();
          geom.rotateY(Math.PI);
          (_airplane.children[0] as THREE.Mesh).geometry = geom;
        }
      }
    });
    const tempPosition = new THREE.Vector3();
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xbbde2d,
      transparent: true,
      opacity: 0.6,
    });
    class Path {
      geometry: THREE.BufferGeometry;
      line: THREE.Line;
      vertices: number[];
      previousPoint: THREE.Vector3;
      constructor() {
        this.geometry = new THREE.BufferGeometry();
        this.line = new THREE.Line(this.geometry, lineMaterial);
        this.vertices = [];
        if (sampler) sampler.sample(tempPosition);
        this.previousPoint = tempPosition.clone();
      }
      update() {
        if (!sampler) return;
        for (let k = 0; k < 3 && this.vertices.length < 35000; k++) {
          let pointFound = false;
          while (!pointFound) {
            sampler.sample(tempPosition);
            if (tempPosition.distanceTo(this.previousPoint) < 20) {
              this.vertices.push(tempPosition.x, tempPosition.y, tempPosition.z);
              this.previousPoint = tempPosition.clone();
              pointFound = true;
            }
          }
        }
        this.geometry.setAttribute(
          "position",
          new THREE.Float32BufferAttribute(this.vertices, 3)
        );
      }
    }
    const earthLoader = new OBJLoader();
    earthLoader.load("https://assets.codepen.io/127738/NOVELO_EARTH.obj", (obj) => {
      const earth = obj.children[0] as THREE.Mesh;
      earth.geometry.scale(0.35, 0.35, 0.35);
      earth.geometry.translate(0, -133, 0);
      const fullPositions = Array.from(
        earth.geometry.attributes.position.array as ArrayLike<number>
      );
      const landPositions = fullPositions.slice(0, 3960 * 3);
      const landGeom = new THREE.BufferGeometry();
      landGeom.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(landPositions, 3)
      );
      const land = new THREE.Mesh(landGeom);
      const waterPositions = fullPositions.slice(3960 * 3, 4500 * 3);
      const waterGeom = new THREE.BufferGeometry();
      waterGeom.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(waterPositions, 3)
      );
      waterGeom.computeVertexNormals();
      const waterMat = new THREE.MeshLambertMaterial({
        color: 0x0da9c3,
        transparent: true,
        opacity: 1,
      });
      const water = new THREE.Mesh(waterGeom, waterMat);
      group.add(water);
      const light = new THREE.HemisphereLight(0xccffff, 0x000033, 1);
      scene.add(light);
      sampler = new MeshSurfaceSampler(land).build();
      for (let i = 0; i < 24; i++) {
        const path = new Path();
        paths.push(path);
        group.add(path.line);
      }

      // --- 2. Lógica para desvanecer ---
      // Inicia un temporizador cuando el modelo de la Tierra ha cargado
      const timer = setTimeout(() => {
        gsap.to(preloaderRef.current, {
          opacity: 0,
          duration: 1.5, // Duración del desvanecimiento
          ease: "power2.inOut",
          onComplete: () => {
            setIsVisible(false); // Cuando termina, oculta el componente
          },
        });
      }, 5000); // Espera 5 segundos antes de empezar a desvanecer

      renderer.setAnimationLoop(render);

      // Limpia el temporizador si el componente se desmonta
      return () => clearTimeout(timer);
    });

    const render = () => {
      group.rotation.y += 0.006;
      subgroups.forEach((g) => {
        const first = g.children[0] as THREE.Group;
        if (first && typeof g.speed === "number") {
          first.rotation.x += g.speed * (g.reverse ? -1 : 1);
        }
      });
      paths.forEach((path) => {
        if (path.vertices.length < 35000) path.update();
      });
      controls.update();
      renderer.render(scene, camera);
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    
    // --- Referencia al elemento del DOM de Three.js para la limpieza ---
    const currentCanvasContainer = canvasRef.current; 

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (currentCanvasContainer && renderer.domElement) {
        currentCanvasContainer.removeChild(renderer.domElement);
      }
    };
  }, []);

  // --- 3. Renderizado condicional ---
  if (!isVisible) {
    return null; // Si no es visible, no renderiza nada
  }

  return (
    // --- 4. Contenedor principal con la ref y estilos de overlay ---
    <div
      ref={preloaderRef}
      className="fixed inset-0 z-50 bg-black w-screen h-screen"
    >
      <div ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default ThreeLoading;