import React, { useState } from 'react';
import { Globe, Calendar, Moon, DollarSign, Tag, ExternalLink } from 'lucide-react';

interface TourPackage {
  nombre: string;
  clv: string;
  dias: string;
  noches: string;
  desde: string;
  imp: string;
  imagen: string;
  url?: string;
}

const TravelPackages: React.FC = () => {
  const [selectedPackage, setSelectedPackage] = useState<TourPackage | null>(null);

  const packages: TourPackage[] = [
    {
      nombre: "Viviendo Europa",
      clv: "12117",
      dias: "17",
      noches: "15",
      desde: "1,699",
      imp: "799",
      imagen: "https://one.cdnmega.com/images/destinos/promos/europa/12117-viviendo-europa-1080x1920_67ad0ad0978d6.webp?width=300",
      url: "https://viaje.ly/tripytour/12117.html"
    },
    {
      nombre: "Celebra en Colombia - Navidad y Fin de año",
      clv: "52267",
      dias: "8",
      noches: "7",
      desde: "1,449",
      imp: "399",
      imagen: "https://one.cdnmega.com/images/destinos/promos/sudamerica/52267-celebra-colombia-navidad-fin-anao-1080x1920_68e59512ee5ee.webp?width=300",
      url: "https://viaje.ly/tripytour/52267.html"
    },
    {
      nombre: "Egipto Clásico y Dubái",
      clv: "20252",
      dias: "15",
      noches: "12",
      desde: "1,599",
      imp: "999",
      imagen: "https://one.cdnmega.com/images/destinos/promos/moriente/20252-egipto-clasico-dubai-1080x1920_67fff89693dea.webp?width=300",
      url: "https://viaje.ly/tripytour/20252.html"
    },
    {
      nombre: "Europa Clásica",
      clv: "16300",
      dias: "17",
      noches: "15",
      desde: "1,999",
      imp: "799",
      imagen: "https://one.cdnmega.com/images/destinos/promos/europa/16300-europa-clasica-1080x1920_6823b4cc01154.webp?width=300",
      url: "https://viaje.ly/tripytour/16300.html"
    },
    {
      nombre: "Especial Turquía y Dubái",
      clv: "20278",
      dias: "16",
      noches: "13",
      desde: "999",
      imp: "999",
      imagen: "https://one.cdnmega.com/images/destinos/promos/moriente/20278-especial-turquia-dubai-1080x1920-1_67fffc9ed21b1.webp?width=300",
      url: "https://viaje.ly/tripytour/20278.html"
    },
    {
      nombre: "Gran Tour de Europa",
      clv: "12019",
      dias: "19",
      noches: "17",
      desde: "1,899",
      imp: "799",
      imagen: "https://one.cdnmega.com/images/destinos/promos/europa/12019-gran-tour-de-europa-1080x1920-66143e5e704bb-1_67a1d73ae5424.webp?width=300",
      url: "https://viaje.ly/tripytour/12019.html"
    },
    {
      nombre: "Mega Turquía y Dubái",
      clv: "20043",
      dias: "16",
      noches: "13",
      desde: "1,199",
      imp: "999",
      imagen: "https://one.cdnmega.com/images/destinos/promos/moriente/20043-mega-turquia-y-dubai-1080x1920_67fff8ff03c6e.webp?width=300",
      url: "https://viaje.ly/tripytour/20043.html"
    },
    {
      nombre: "Mega Europa Iniciando en Barcelona",
      clv: "12341",
      dias: "17",
      noches: "15",
      desde: "1,499",
      imp: "799",
      imagen: "https://one.cdnmega.com/images/destinos/promos/europa/12341-mega-europa-desde-barcelona-1080x1920_67ad0b9c88da6.webp?width=300",
      url: "https://viaje.ly/tripytour/12341.html"
    },
    {
      nombre: "Peru Clásico – Navidad y Fin De Año",
      clv: "52126",
      dias: "9",
      noches: "7",
      desde: "999",
      imp: "499",
      imagen: "https://one.cdnmega.com/images/destinos/promos/sudamerica/52126-peru-clasico-navidad-fin-anao-1080x1920_685353bf0ee90.webp?width=300",
      url: "https://viaje.ly/tripytour/52126.html"
    },
    {
      nombre: "Japón, El Camino del Samurái",
      clv: "30208",
      dias: "12",
      noches: "9",
      desde: "1,999",
      imp: "999",
      imagen: "https://one.cdnmega.com/images/destinos/promos/asia/30208-japon-caminosamurai-1080x1920_67bd031c83d5c.webp?width=300",
      url: "https://viaje.ly/tripytour/30208.html"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-indigo-900 mb-4 flex items-center justify-center gap-3">
            <Globe className="w-12 h-12" />
            Paquetes Turísticos
          </h1>
          <p className="text-xl text-gray-700">Descubre el mundo con nuestras mejores ofertas</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.clv}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
              onClick={() => setSelectedPackage(pkg)}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={pkg.imagen}
                  alt={pkg.nombre}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full font-bold text-sm">
                  Desde ${pkg.desde} USD
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 h-14 line-clamp-2">
                  {pkg.nombre}
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                    <span className="font-semibold">{pkg.dias} días</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <Moon className="w-5 h-5 text-indigo-600" />
                    <span className="font-semibold">{pkg.noches} noches</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span className="font-semibold">Impuestos: ${pkg.imp} USD</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <Tag className="w-5 h-5 text-purple-600" />
                    <span className="text-sm">Código: {pkg.clv}</span>
                  </div>
                </div>

                <button className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-colors duration-300">
                  Ver Detalles
                </button>
              </div>
            </div>
          ))}
        </div>

        {selectedPackage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedPackage(null)}
          >
            <div
              className="bg-white rounded-2xl max-w-6xl w-full h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-2xl font-bold text-indigo-900">
                  {selectedPackage.nombre}
                </h2>
                <div className="flex gap-2">
                  {selectedPackage.url && (
                    <a
                      href={selectedPackage.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Abrir en nueva pestaña
                    </a>
                  )}
                  <button
                    onClick={() => setSelectedPackage(null)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Cerrar
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-hidden">
                {selectedPackage.url ? (
                  <iframe
                    src={selectedPackage.url}
                    className="w-full h-full border-0"
                    title={selectedPackage.nombre}
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  />
                ) : (
                  <div className="p-8">
                    <img
                      src={selectedPackage.imagen}
                      alt={selectedPackage.nombre}
                      className="w-full h-80 object-cover rounded-lg mb-6"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-indigo-50 p-4 rounded-lg">
                        <p className="text-gray-600 text-sm">Duración</p>
                        <p className="text-2xl font-bold text-indigo-900">
                          {selectedPackage.dias} días / {selectedPackage.noches} noches
                        </p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-gray-600 text-sm">Precio desde</p>
                        <p className="text-2xl font-bold text-green-700">
                          ${selectedPackage.desde} USD
                        </p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <p className="text-gray-600 text-sm">Impuestos</p>
                        <p className="text-2xl font-bold text-purple-700">
                          ${selectedPackage.imp} USD
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-600 text-sm">Código</p>
                        <p className="text-2xl font-bold text-gray-700">
                          {selectedPackage.clv}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TravelPackages;