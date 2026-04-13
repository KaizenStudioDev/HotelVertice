import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useBooking, calcNights } from '../context/BookingContext';
import { useNavigate } from 'react-router-dom';
import { reservationService } from '../services/api';
import { useToast } from '../context/ToastContext';

const Payment: React.FC = () => {
    const { booking, updateBooking } = useBooking();
    const { addToast } = useToast();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const totalDays = calcNights(booking.checkIn, booking.checkOut);
    const totalPrice = (booking.pricePerNight || 0) * totalDays;

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await reservationService.create({
                room_id: booking.roomId,
                check_in: booking.checkIn,
                check_out: booking.checkOut,
                total_price: totalPrice,
                guest_name: booking.customerName,
                guest_email: booking.customerEmail
            });
            updateBooking({ totalPrice });
            addToast('¡Reserva confirmada con éxito!', 'success');
            navigate('/payment-confirmation');
        } catch (err: any) {
            addToast(err.response?.data?.error || 'Error al procesar la reserva', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen bg-gray-light py-12 px-6 lg:px-10">
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">

                {/* Payment Form */}
                <div className="flex flex-col gap-6">
                    <h1 className="text-3xl font-playfair font-bold text-dark">Método de Pago</h1>
                    <Card padding="lg" className="border border-gray-medium shadow-sm">
                        <form className="flex flex-col gap-6" onSubmit={handlePayment}>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-gray uppercase tracking-widest">Tarjeta de Crédito / Débito</label>
                                <div className="p-4 border border-gray-medium rounded-xl bg-gray-light flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-6 bg-dark rounded flex items-center justify-center text-[10px] text-white font-bold italic">VISA</div>
                                        <span className="text-dark font-medium tracking-widest">•••• 4242</span>
                                    </div>
                                    <span className="text-xs text-gray font-bold">PREDETERMINADA</span>
                                </div>
                            </div>

                            <p className="text-xs text-gray italic bg-info/5 p-3 rounded-lg border border-info/10">
                                <span className="font-bold text-primary">Nota:</span> Esta aplicación es una demostración. No se realizará ningún cargo real a tu tarjeta.
                            </p>

                            <Button type="submit" fullWidth disabled={isLoading} size="lg">
                                {isLoading ? 'Procesando Pago...' : `Confirmar Pago de $${totalPrice.toLocaleString()}`}
                            </Button>
                        </form>
                    </Card>
                </div>

                {/* Final Summary Card */}
                <div className="flex flex-col gap-6">
                    <h2 className="text-2xl font-playfair font-bold text-dark">Resumen de tu Estancia</h2>
                    <Card padding="lg" className="bg-primary text-white border-none shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                        <div className="flex flex-col gap-6 relative z-10">
                            <div>
                                <h3 className="text-2xl font-playfair font-bold text-gold">{booking.roomName}</h3>
                                <p className="text-sm opacity-70 mt-1">{booking.checkIn} — {booking.checkOut}</p>
                            </div>

                            <div className="h-[1px] bg-white/10" />

                            <div className="flex flex-col gap-3">
                                <div className="flex justify-between text-sm">
                                    <span className="opacity-70">Noches totales:</span>
                                    <span className="font-medium">{totalDays} {totalDays === 1 ? 'noche' : 'noches'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="opacity-70">Precio por noche:</span>
                                    <span className="font-medium">${booking.pricePerNight}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="opacity-70">Impuestos y tasas:</span>
                                    <span className="font-medium text-successLight">¡Incluidos!</span>
                                </div>
                            </div>

                            <div className="h-[1px] bg-white/10" />

                            <div className="flex justify-between items-end">
                                <div className="flex flex-col">
                                    <span className="text-xs opacity-60 uppercase font-bold tracking-widest">Monto Total</span>
                                    <span className="text-3xl font-bold text-gold">${totalPrice.toLocaleString()}</span>
                                </div>
                                <Badge variant="info" className="bg-white/10 text-white text-[10px] tracking-tight border-none">BOUTIQUE SELECTION</Badge>
                            </div>
                        </div>
                    </Card>
                </div>

            </div>
        </div>
    );
};

export default Payment;
