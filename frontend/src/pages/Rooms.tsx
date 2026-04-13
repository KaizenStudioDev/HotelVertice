import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Select } from '../components/ui/Select';
import { useNavigate } from 'react-router-dom';
import { useBooking, calcNights } from '../context/BookingContext';
import { roomService } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const ROOM_IMAGES: Record<string, string> = {
    'Estándar': '/images/room-standard.jpg',
    'Suite': '/images/room-premium.jpg',
    'Familiar': '/images/room-family.jpg',
};

const getRoomImage = (typeName: string): string =>
    ROOM_IMAGES[typeName] ?? '/images/room-standard.jpg';

const Rooms: React.FC = () => {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const { isAuthenticated } = useAuth();
    const { booking, updateBooking } = useBooking();
    const [rooms, setRooms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterFloor, setFilterFloor] = useState('');
    const [filterView, setFilterView] = useState('');

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const res = await roomService.getAll();
                setRooms(res.data);
            } catch (err) {
                addToast('Error al cargar habitaciones', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchRooms();
    }, []);

    const filteredRooms = rooms.filter(room => {
        return (filterFloor === '' || room.floor.toString() === filterFloor) &&
            (filterView === '' || room.view_type === filterView);
    });

    const handleSelectRoom = (room: any) => {
        if (!isAuthenticated) {
            addToast('Inicia sesión para realizar una reserva', 'info');
            navigate('/login', { state: { from: '/rooms' } });
            return;
        }

        updateBooking({
            roomId: room.id,
            roomName: `${room.room_number} - ${room.room_types.name}`,
            pricePerNight: parseFloat(room.room_types.base_price) // Corrected from price_per_night
        });
        navigate('/booking-details');
    };

    return (
        <div className="w-full min-h-screen bg-gray-light py-12 px-6 lg:px-10">
            <div className="max-w-7xl mx-auto flex flex-col gap-8">

                {/* Header & Filters */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row justify-between items-end gap-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-medium"
                >
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-playfair font-bold text-dark">Nuestras Habitaciones</h1>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray">
                            <span>Elegancia y confort en cada rincón de nuestra propiedad.</span>
                            {booking.checkIn && booking.checkOut && (
                                <span className="flex items-center gap-2 bg-gold/10 text-primary font-semibold px-3 py-1 rounded-full border border-gold/30">
                                    📅 {booking.checkIn} → {booking.checkOut}
                                    <span className="text-gold font-bold">
                                        · {calcNights(booking.checkIn, booking.checkOut)} {calcNights(booking.checkIn, booking.checkOut) === 1 ? 'noche' : 'noches'}
                                    </span>
                                    {booking.guests && (
                                        <span className="text-gray font-normal">· 👤 {booking.guests} {booking.guests === 1 ? 'huésped' : 'huéspedes'}</span>
                                    )}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 w-full md:w-auto">
                        <Select
                            label="Planta"
                            className="w-32"
                            value={filterFloor}
                            onChange={(e) => setFilterFloor(e.target.value)}
                            options={[
                                { value: '', label: 'Todas' },
                                { value: '1', label: 'Piso 1' },
                                { value: '2', label: 'Piso 2' },
                                { value: '3', label: 'Piso 3' },
                            ]}
                        />
                        <Select
                            label="Vista"
                            className="w-40"
                            value={filterView}
                            onChange={(e) => setFilterView(e.target.value)}
                            options={[
                                { value: '', label: 'Cualquiera' },
                                { value: 'Mar', label: 'Vista al Mar' },
                                { value: 'Ciudad', label: 'Vista Ciudad' },
                                { value: 'Jardín', label: 'Vista Jardín' },
                            ]}
                        />
                    </div>
                </motion.div>

                {/* Rooms Grid */}
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div 
                            key="loader"
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-32 gap-4"
                        >
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold shadow-sm"></div>
                            <p className="text-gray-medium animate-pulse font-medium">Buscando habitaciones disponibles...</p>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="grid"
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-dark"
                        >
                            {filteredRooms.map((room, index) => (
                                <motion.div
                                    key={room.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Card padding="none" hoverEffect className="flex flex-col h-full border border-gray-medium overflow-hidden">
                                        <div className="w-full h-56 relative group">
                                            <img
                                                src={getRoomImage(room.room_types?.name)}
                                                alt={room.room_types?.name}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-dark/10 group-hover:bg-dark/0 transition-colors duration-300"></div>
                                            <div className="absolute top-4 left-4 z-10">
                                                <Badge variant="info" className="backdrop-blur-md bg-white/80">{room.view_type}</Badge>
                                            </div>
                                        </div>
                                        <div className="p-6 flex flex-col gap-4 flex-1">
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-2xl font-playfair font-bold text-dark">{room.room_types.name} #{room.room_number}</h3>
                                                <span className="text-xs font-bold text-gray uppercase tracking-widest bg-gray-light px-2 py-1 rounded">Piso {room.floor}</span>
                                            </div>

                                            <div className="flex flex-wrap gap-2 text-sm text-gray">
                                                <span className="bg-gray-light px-2 py-1 rounded-md">👤 {room.room_types.capacity} Huespedes</span>
                                                <Badge variant={room.status === 'available' ? 'success' : 'danger'}>
                                                    {room.status === 'available' ? 'Disponible' : 'Ocupada'}
                                                </Badge>
                                            </div>

                                            <div className="flex justify-between items-center pt-6 border-t border-gray-medium mt-auto">
                                                <div className="flex flex-col">
                                                    <span className="text-2xl font-bold text-gold">${room.room_types.base_price}</span>
                                                    <span className="text-xs text-gray font-medium uppercase tracking-tighter">por noche</span>
                                                </div>
                                                <Button
                                                    disabled={room.status !== 'available'}
                                                    onClick={() => handleSelectRoom(room)}
                                                >
                                                    {room.status === 'available' ? 'Seleccionar' : 'No disponible'}
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {!loading && filteredRooms.length === 0 && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }}
                        className="w-full py-20 text-center flex flex-col items-center gap-4"
                    >
                        <p className="text-xl text-gray">No se encontraron habitaciones con esos filtros.</p>
                        <Button variant="ghost" className="border border-gray-medium" onClick={() => { setFilterFloor(''); setFilterView(''); }}>Limpiar Filtros</Button>
                    </motion.div>
                )}

            </div>
        </div>
    );
};

export default Rooms;
