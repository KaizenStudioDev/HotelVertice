import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { useBooking } from '../context/BookingContext';

const formatDate = (d: Date): string => d.toISOString().split('T')[0];

const Landing: React.FC = () => {
    const navigate = useNavigate();
    const { updateBooking } = useBooking();

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [checkIn, setCheckIn] = useState(formatDate(today));
    const [checkOut, setCheckOut] = useState(formatDate(tomorrow));
    const [guests, setGuests] = useState(2);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        updateBooking({ checkIn, checkOut, guests });
        navigate('/rooms');
    };

    return (
        <div className="flex flex-col w-full">
            {/* Hero Section */}
            <section
                className="relative w-full h-[600px] flex items-center justify-center pt-10"
                style={{ backgroundImage: "url('/images/hero-bg.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
                <div className="absolute inset-0 bg-dark/50 z-10"></div>
                <div className="relative z-20 flex flex-col items-center text-center px-6 max-w-3xl gap-6">
                    <h1 className="text-white text-5xl md:text-6xl font-playfair font-bold leading-tight">
                        Descubre el lujo en el corazón de la ciudad
                    </h1>
                    <p className="text-white/90 text-lg md:text-xl font-medium mb-4">
                        Vive una experiencia inolvidable con nuestro servicio premium y diseño exclusivo.
                    </p>
                    <Button size="lg" onClick={() => navigate('/rooms')}>Reserva tu estancia</Button>
                </div>
            </section>

            {/* Booking Search Bar */}
            <section className="relative z-30 flex justify-center -mt-16 px-6">
                <form onSubmit={handleSearch} className="w-full max-w-4xl">
                    <Card className="flex flex-col md:flex-row items-end gap-4 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
                        <Input
                            label="Check-in"
                            type="date"
                            value={checkIn}
                            min={formatDate(today)}
                            onChange={(e) => {
                                setCheckIn(e.target.value);
                                if (e.target.value >= checkOut) {
                                    const next = new Date(e.target.value);
                                    next.setDate(next.getDate() + 1);
                                    setCheckOut(formatDate(next));
                                }
                            }}
                        />
                        <Input
                            label="Check-out"
                            type="date"
                            value={checkOut}
                            min={checkIn}
                            onChange={(e) => setCheckOut(e.target.value)}
                        />
                        <Input
                            label="Huéspedes"
                            type="number"
                            min={1}
                            max={4}
                            value={guests}
                            onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                        />
                        <Button type="submit" className="w-full md:w-auto px-10">Buscar</Button>
                    </Card>
                </form>
            </section>

            {/* Featured Rooms */}
            <section className="w-full py-24 px-6 lg:px-10 flex flex-col items-center bg-gray-light">
                <h2 className="text-3xl md:text-4xl font-playfair font-bold text-primary mb-12 text-center">
                    Nuestras Habitaciones
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl">
                    {/* Room Card 1 */}
                    <Card padding="none" hoverEffect className="flex flex-col">
                        <img src="/images/room-standard.jpg" alt="Habitación Estándar" className="w-full h-64 object-cover" />
                        <div className="p-6 flex flex-col gap-4 flex-1">
                            <h3 className="text-2xl font-playfair font-bold text-dark">Habitación Estándar</h3>
                            <p className="text-gray text-sm flex-1">Confort e intimidad perfecta para estancias cortas, equipada con todo lo necesario.</p>
                            <div className="flex justify-between items-center pt-4 border-t border-gray-medium">
                                <span className="text-gold font-bold text-lg">DESDE $120 <span className="text-sm font-normal text-gray">/ noche</span></span>
                            </div>
                        </div>
                    </Card>

                    {/* Room Card 2 */}
                    <Card padding="none" hoverEffect className="flex flex-col border-gold">
                        <div className="w-full h-64 relative">
                            <img src="/images/room-premium.jpg" alt="Suite Premium" className="w-full h-64 object-cover" />
                            <div className="absolute top-4 right-4 bg-gold text-dark text-xs font-bold px-3 py-1 rounded-full">RECOMENDADO</div>
                        </div>
                        <div className="p-6 flex flex-col gap-4 flex-1">
                            <h3 className="text-2xl font-playfair font-bold text-dark">Suite Premium</h3>
                            <p className="text-gray text-sm flex-1">Espacios amplios, vista panorámica y acceso exclusivo a servicios premium.</p>
                            <div className="flex justify-between items-center pt-4 border-t border-gray-medium">
                                <span className="text-gold font-bold text-lg">DESDE $250 <span className="text-sm font-normal text-gray">/ noche</span></span>
                            </div>
                        </div>
                    </Card>

                    {/* Room Card 3 */}
                    <Card padding="none" hoverEffect className="flex flex-col">
                        <img src="/images/room-family.jpg" alt="Suite Familiar" className="w-full h-64 object-cover" />
                        <div className="p-6 flex flex-col gap-4 flex-1">
                            <h3 className="text-2xl font-playfair font-bold text-dark">Suite Familiar</h3>
                            <p className="text-gray text-sm flex-1">El espacio ideal para compartir con los tuyos, con múltiples ambientes.</p>
                            <div className="flex justify-between items-center pt-4 border-t border-gray-medium">
                                <span className="text-gold font-bold text-lg">DESDE $320 <span className="text-sm font-normal text-gray">/ noche</span></span>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="mt-12">
                    <Button variant="outline" size="lg" onClick={() => navigate('/rooms')}>Ver todas las habitaciones</Button>
                </div>
            </section>
        </div>
    );
};

export default Landing;
