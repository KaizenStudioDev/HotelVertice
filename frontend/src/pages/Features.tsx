import React from 'react';
import { Card } from '../components/ui/Card';

const Features: React.FC = () => {
    return (
        <div className="flex flex-col w-full bg-white pb-24">
            {/* Header */}
            <section className="w-full py-20 px-6 lg:px-10 bg-primary flex flex-col items-center text-center">
                <h1 className="text-white text-4xl md:text-5xl font-playfair font-bold mb-6">
                    Nuestros Servicios
                </h1>
                <p className="text-white/80 text-lg max-w-2xl">
                    Más que una habitación, te ofrecemos experiencias únicas para que tu estadía sea inigualable.
                </p>
            </section>

            {/* Features Grid */}
            <section className="w-full max-w-6xl mx-auto px-6 lg:px-10 pt-16 flex flex-col gap-16">

                <div className="flex flex-col md:flex-row gap-10 items-center">
                    <img src="/images/Spa.png" alt="Spa Hotel Vértice" className="w-full md:w-1/2 h-80 object-cover rounded-[16px]" />
                    <div className="w-full md:w-1/2 flex flex-col gap-4">
                        <h2 className="text-3xl font-playfair font-bold text-primary">Spa y Relajación</h2>
                        <p className="text-gray leading-relaxed text-lg">
                            Sumérgete en un oasis de tranquilidad. Nuestro spa ofrece masajes terapéuticos, circuito de aguas, saunas y todo lo que tu cuerpo necesita para revitalizarse luego de un día largo.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row-reverse gap-10 items-center">
                    <img src="/images/Restaurante.png" alt="Restaurante Hotel Vértice" className="w-full md:w-1/2 h-80 object-cover rounded-[16px]" />
                    <div className="w-full md:w-1/2 flex flex-col gap-4">
                        <h2 className="text-3xl font-playfair font-bold text-primary">Alta Cocina</h2>
                        <p className="text-gray leading-relaxed text-lg">
                            El Restaurante Vértice es el punto de encuentro para paladares exquisitos. Dirigido por chefs premiados, fusionamos sabores locales con técnicas internacionales.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-10 items-center">
                    <img src="/images/GYM.png" alt="Gimnasio Hotel Vértice" className="w-full md:w-1/2 h-80 object-cover rounded-[16px]" />
                    <div className="w-full md:w-1/2 flex flex-col gap-4">
                        <h2 className="text-3xl font-playfair font-bold text-primary">Gimnasio Premium</h2>
                        <p className="text-gray leading-relaxed text-lg">
                            No descuides tu rutina. Equipos de última generación, entrenadores personales y clases grupales a tu disposición las 24 horas.
                        </p>
                    </div>
                </div>

            </section>

            {/* Mini Services Grid */}
            <section className="w-full max-w-6xl mx-auto px-6 lg:px-10 mt-24">
                <h3 className="text-2xl font-playfair font-bold text-center text-primary mb-10">Comodidades en el hotel</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <Card padding="sm" className="text-center flex flex-col items-center justify-center gap-3 py-8 bg-gray-light border-transparent shadow-none">
                        <span className="text-3xl border border-gray-medium rounded-full p-4 bg-white">📶</span>
                        <span className="font-semibold text-dark">Wi-Fi Rápido</span>
                    </Card>
                    <Card padding="sm" className="text-center flex flex-col items-center justify-center gap-3 py-8 bg-gray-light border-transparent shadow-none">
                        <span className="text-3xl border border-gray-medium rounded-full p-4 bg-white">🚗</span>
                        <span className="font-semibold text-dark">Valet Parking</span>
                    </Card>
                    <Card padding="sm" className="text-center flex flex-col items-center justify-center gap-3 py-8 bg-gray-light border-transparent shadow-none">
                        <span className="text-3xl border border-gray-medium rounded-full p-4 bg-white">🐾</span>
                        <span className="font-semibold text-dark">Pet Friendly</span>
                    </Card>
                    <Card padding="sm" className="text-center flex flex-col items-center justify-center gap-3 py-8 bg-gray-light border-transparent shadow-none">
                        <span className="text-3xl border border-gray-medium rounded-full p-4 bg-white">🛎️</span>
                        <span className="font-semibold text-dark">Room Service 24h</span>
                    </Card>
                </div>
            </section>
        </div>
    );
};

export default Features;
