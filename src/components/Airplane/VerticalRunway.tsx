import React from 'react';

interface VerticalRunwayProps {
  width?: number;
  height?: number;
  className?: string;
}

const VerticalRunway: React.FC<VerticalRunwayProps> = ({
  width = 192,
  height = 384,
  className = '',
}) => {
  return (
    <div className={`flex justify-center items-center min-h-screen bg-green-700 p-5 ${className}`}>
      <div
        className="relative bg-gray-600 rounded-lg shadow-2xl"
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        {/* Zona de umbral */}
        <div className="absolute left-1/2 top-5 -translate-x-1/2 w-20 h-2 bg-white"></div>
        <div className="absolute left-1/2 bottom-5 -translate-x-1/2 w-20 h-2 bg-white"></div>

        {/* Números de pista */}
        <div className="absolute left-1/2 top-20 -translate-x-1/2 rotate-90 text-white text-4xl font-bold">
          09
        </div>
        <div className="absolute left-1/2 bottom-20 -translate-x-1/2 -rotate-90 text-white text-4xl font-bold">
          27
        </div>

        {/* Líneas centrales */}
        <div className="absolute left-1/2 top-28 -translate-x-1/2 w-2 h-12 bg-white rounded-full"></div>
        <div className="absolute left-1/2 top-44 -translate-x-1/2 w-2 h-6 bg-white rounded-full"></div>
        <div className="absolute left-1/2 top-52 -translate-x-1/2 w-2 h-12 bg-white rounded-full"></div>
        <div className="absolute left-1/2 top-68 -translate-x-1/2 w-2 h-6 bg-white rounded-full"></div>
        <div className="absolute left-1/2 top-76 -translate-x-1/2 w-2 h-12 bg-white rounded-full"></div>
        <div className="absolute left-1/2 top-92 -translate-x-1/2 w-2 h-6 bg-white rounded-full"></div>
        <div className="absolute left-1/2 top-100 -translate-x-1/2 w-2 h-12 bg-white rounded-full"></div>
        <div className="absolute left-1/2 top-116 -translate-x-1/2 w-2 h-6 bg-white rounded-full"></div>
        <div className="absolute left-1/2 top-124 -translate-x-1/2 w-2 h-12 bg-white rounded-full"></div>

        {/* Líneas laterales */}
        <div className="absolute left-8 top-0 w-1 h-full bg-white"></div>
        <div className="absolute right-8 top-0 w-1 h-full bg-white"></div>

        {/* Luces laterales izquierdas */}
        <div className="absolute left-4 top-0 h-full w-2">
          {Array.from({ length: 18 }, (_, i) => (
            <div
              key={`left-${i}`}
              className="w-2 h-2 bg-orange-500 rounded-full mb-4 shadow-lg animate-pulse"
              style={{
                marginTop: i === 0 ? '3rem' : '0',
                boxShadow: '0 0 10px #ff6600',
                animationDelay: `${i * 0.1}s`,
              }}
            ></div>
          ))}
        </div>

        {/* Luces laterales derechas */}
        <div className="absolute right-4 top-0 h-full w-2">
          {Array.from({ length: 18 }, (_, i) => (
            <div
              key={`right-${i}`}
              className="w-2 h-2 bg-orange-500 rounded-full mb-4 shadow-lg animate-pulse"
              style={{
                marginTop: i === 0 ? '3rem' : '0',
                boxShadow: '0 0 10px #ff6600',
                animationDelay: `${i * 0.1}s`,
              }}
            ></div>
          ))}
        </div>

        {/* Marcadores de distancia */}
        <div className="absolute left-1/2 top-72 -translate-x-1/2 w-10 h-1 bg-white"></div>
        <div className="absolute left-1/2 top-80 -translate-x-1/2 w-10 h-1 bg-white"></div>
        <div className="absolute left-1/2 top-88 -translate-x-1/2 w-10 h-1 bg-white"></div>

        {/* Línea de precaución amarilla */}
        <div className="absolute left-1/2 bottom-36 -translate-x-1/2 w-28 h-1.5 bg-yellow-400"></div>

        {/* Efecto de sombra en los bordes */}
        <div className="absolute inset-0 rounded-lg shadow-inner opacity-20 bg-black pointer-events-none"></div>
      </div>
    </div>
  );
};

export default VerticalRunway;