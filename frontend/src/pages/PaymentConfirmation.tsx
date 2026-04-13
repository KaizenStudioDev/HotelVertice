import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useBooking } from '../context/BookingContext';
import { generateReservationPDF } from '../services/pdfService';
import { CheckCircle, FileText, Home } from 'lucide-react';

const PaymentConfirmation: React.FC = () => {
    const navigate = useNavigate();
    const { booking, resetBooking } = useBooking();

    const handleFinish = () => {
        resetBooking();
        navigate('/');
    };

    const handleDownloadPDF = () => {
        generateReservationPDF({
            id: booking.roomId ? `HV-${booking.roomId}-${Date.now().toString().slice(-4)}` : 'HV-29384-X',
            guestName: booking.customerName || 'Invitado',
            guestEmail: booking.customerEmail || 'invitado@example.com',
            roomName: booking.roomName || 'Habitación Seleccionada',
            checkIn: booking.checkIn || new Date().toLocaleDateString(),
            checkOut: booking.checkOut || new Date().toLocaleDateString(),
            totalPrice: booking.totalPrice || 0
        });
    };

    return (
        <div className="w-full min-h-screen bg-gray-light flex items-center justify-center p-6">
            <Card className="max-w-xl w-full text-center" padding="lg">
                <div className="flex flex-col items-center gap-6">
                    <div className="w-20 h-20 bg-successLight rounded-full flex items-center justify-center text-success animate-bounce">
                        <CheckCircle size={48} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <h1 className="text-4xl font-playfair font-bold text-primary">¡Reserva Confirmada!</h1>
                        <p className="text-gray leading-relaxed text-lg">
                            Gracias por elegir Hotel Vértice, <span className="text-dark font-medium">{booking.customerName}</span>.
                            Hemos enviado los detalles de tu estancia a <span className="text-dark font-medium">{booking.customerEmail}</span>.
                        </p>
                    </div>

                    <div className="w-full bg-white p-6 rounded-2xl flex flex-col gap-4 border border-gray-medium shadow-sm">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray font-bold uppercase tracking-widest text-xs">CÓDIGO DE RESERVA</span>
                            <span className="text-primary font-mono font-bold">HV-29384-X</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray text-sm">Estado del Pago</span>
                            <Badge variant="success">Completado</Badge>
                        </div>
                        <div className="pt-4 border-t border-gray-medium flex justify-between items-center">
                            <span className="text-primary font-bold">Total Pagado</span>
                            <span className="text-2xl font-bold text-gold">${(booking.totalPrice || 0).toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full pt-4">
                        <Button variant="secondary" fullWidth className="gap-2" onClick={handleDownloadPDF}>
                            <FileText size={18} />
                            Bajar Recibo
                        </Button>
                        <Button variant="primary" fullWidth className="gap-2" onClick={handleFinish}>
                            <Home size={18} />
                            Continuar
                        </Button>
                    </div>
                    
                    <p className="text-xs text-gray italic">Documento generado automáticamente por el sistema de reservas.</p>
                </div>
            </Card>
        </div>
    );
};

export default PaymentConfirmation;
