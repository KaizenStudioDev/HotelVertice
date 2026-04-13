import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useBooking, calcNights } from '../context/BookingContext';

const BookingDetails: React.FC = () => {
    const navigate = useNavigate();
    const { booking, updateBooking } = useBooking();
    const nights = calcNights(booking.checkIn, booking.checkOut);
    const totalPrice = (booking.pricePerNight || 0) * nights;

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, we'd validate here
        navigate('/payment');
    };

    if (!booking.roomId) {
        return (
            <div className="p-10 text-center">
                <h2 className="text-2xl font-playfair font-bold mb-4">No has seleccionado una habitación</h2>
                <Button onClick={() => navigate('/rooms')}>Volver a habitaciones</Button>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-gray-light py-12 px-6 lg:px-10">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">

                {/* Form Section */}
                <div className="flex-1 flex flex-col gap-6">
                    <h1 className="text-3xl font-playfair font-bold text-dark">Datos de la Reserva</h1>
                    <Card padding="lg">
                        <form onSubmit={handleNext} className="flex flex-col gap-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Nombre Completo"
                                    required
                                    value={booking.customerName || ''}
                                    onChange={(e) => updateBooking({ customerName: e.target.value })}
                                />
                                <Input
                                    label="Correo Electrónico"
                                    type="email"
                                    required
                                    value={booking.customerEmail || ''}
                                    onChange={(e) => updateBooking({ customerEmail: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Teléfono"
                                    type="tel"
                                    required
                                    value={booking.customerPhone || ''}
                                    onChange={(e) => updateBooking({ customerPhone: e.target.value })}
                                />
                                <Input
                                    label="Número de Huéspedes"
                                    type="number"
                                    min={1}
                                    max={4}
                                    required
                                    value={booking.guests}
                                    onChange={(e) => updateBooking({ guests: parseInt(e.target.value) })}
                                />
                            </div>

                            <div className="pt-4 border-t border-gray-medium flex justify-end">
                                <Button type="submit" size="lg">Continuar al Pago</Button>
                            </div>
                        </form>
                    </Card>
                </div>

                {/* Summary Sidebar */}
                <div className="w-full md:w-80 flex flex-col gap-6">
                    <h2 className="text-xl font-playfair font-bold text-dark">Resumen</h2>
                    <Card className="bg-primary text-white border-none shadow-card overflow-hidden">
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col">
                                <span className="text-xs opacity-60 uppercase font-bold tracking-widest">Habitación</span>
                                <span className="text-lg font-playfair font-medium text-gold">{booking.roomName}</span>
                            </div>
                            <div className="flex justify-between">
                                <div className="flex flex-col">
                                    <span className="text-xs opacity-60 uppercase font-bold tracking-widest">Check-in</span>
                                    <span className="text-sm">{booking.checkIn}</span>
                                </div>
                                <div className="flex flex-col text-right">
                                    <span className="text-xs opacity-60 uppercase font-bold tracking-widest">Check-out</span>
                                    <span className="text-sm">{booking.checkOut}</span>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                                <span className="text-sm opacity-80">Precio total ({nights} {nights === 1 ? 'noche' : 'noches'})</span>
                                <span className="text-2xl font-bold text-gold">${totalPrice.toLocaleString()}</span>
                            </div>
                        </div>
                    </Card>
                    <Button variant="outline" fullWidth onClick={() => navigate('/rooms')}>Cambiar Habitación</Button>
                </div>

            </div>
        </div>
    );
};

export default BookingDetails;
