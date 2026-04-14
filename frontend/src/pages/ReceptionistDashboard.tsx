import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { roomService, reservationService } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';

const STATUS_LABEL: Record<string, string> = {
    confirmed: 'Confirmada',
    cancelled: 'Cancelada',
    pending: 'Pendiente',
};

const ReceptionistDashboard: React.FC = () => {
    const { addToast } = useToast();
    const [rooms, setRooms] = useState<any[]>([]);
    const [reservations, setReservations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [view, setView] = useState<'checkins' | 'reservations' | 'rooms'>('checkins');

    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [roomsRes, resRes] = await Promise.all([
                    roomService.getAll(),
                    reservationService.getAllForAdmin(),
                ]);
                setRooms(roomsRes.data);
                setReservations(resRes.data);
            } catch {
                addToast('Error al cargar datos', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const todayCheckIns = reservations.filter(
        r => r.check_in === today && r.status === 'confirmed'
    );
    const todayCheckOuts = reservations.filter(
        r => r.check_out === today && r.status === 'confirmed'
    );
    const activeReservations = reservations.filter(r => r.status === 'confirmed');
    const freeRooms = rooms.filter(r => r.status === 'available').length;

    const filteredReservations = reservations.filter(r => {
        if (!search) return true;
        return (
            r.id.slice(0, 8).toLowerCase().includes(search.toLowerCase()) ||
            (r.rooms?.room_number?.toString() || '').includes(search)
        );
    });

    const STATS = [
        { label: 'Check-ins Hoy',    value: todayCheckIns.length.toString(),    color: 'bg-blue-100 text-blue-700' },
        { label: 'Check-outs Hoy',   value: todayCheckOuts.length.toString(),   color: 'bg-amber-100 text-amber-700' },
        { label: 'Reservas Activas', value: activeReservations.length.toString(), color: 'bg-successLight text-success' },
        { label: 'Habitaciones Libres', value: freeRooms.toString(),             color: 'bg-gray-100 text-gray-600' },
    ];

    if (loading) return (
        <div className="p-20 flex flex-col items-center gap-4">
            <div className="animate-spin h-12 w-12 border-b-2 border-gold rounded-full"></div>
            <p className="text-gray animate-pulse">Cargando panel...</p>
        </div>
    );

    return (
        <div className="w-full min-h-screen bg-gray-light py-12 px-6 lg:px-10">
            <div className="max-w-7xl mx-auto flex flex-col gap-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-playfair font-bold text-dark">Panel de Recepción</h1>
                        <p className="text-gray italic text-sm mt-1">
                            {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            to="/calendar"
                            className="flex items-center gap-2 px-4 py-2 bg-gold/10 text-gold border border-gold/30 rounded-xl text-sm font-semibold hover:bg-gold/20 transition-colors"
                        >
                            <Calendar size={16} />
                            Ver Calendario
                        </Link>
                        <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-medium">
                            {(['checkins', 'reservations', 'rooms'] as const).map((v) => (
                                <Button key={v} variant={view === v ? 'secondary' : 'ghost'} size="sm" onClick={() => setView(v)}>
                                    {{ checkins: 'Hoy', reservations: 'Reservas', rooms: 'Habitaciones' }[v]}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {STATS.map((stat, i) => (
                        <Card key={i} padding="md" className="flex flex-col gap-2">
                            <span className="text-sm font-medium text-gray">{stat.label}</span>
                            <span className={`text-2xl font-bold rounded-lg px-2 w-fit ${stat.color}`}>{stat.value}</span>
                        </Card>
                    ))}
                </div>

                {/* Today's Check-ins / Check-outs */}
                {view === 'checkins' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-dark">
                        {/* Check-ins */}
                        <Card padding="lg">
                            <h2 className="text-xl font-playfair font-bold text-primary mb-4">
                                Check-ins de Hoy
                                <span className="ml-2 text-sm font-normal text-gray">({todayCheckIns.length})</span>
                            </h2>
                            {todayCheckIns.length === 0 ? (
                                <p className="text-gray italic text-sm py-6 text-center">Sin check-ins para hoy.</p>
                            ) : (
                                <div className="flex flex-col divide-y divide-gray-light">
                                    {todayCheckIns.map(r => (
                                        <div key={r.id} className="py-4 flex justify-between items-center">
                                            <div>
                                                <p className="font-bold text-dark">Hab. #{r.rooms?.room_number}</p>
                                                <p className="text-xs text-gray">{r.rooms?.room_types?.name} · hasta {r.check_out}</p>
                                            </div>
                                            <Badge variant="success">Check-in</Badge>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card>

                        {/* Check-outs */}
                        <Card padding="lg">
                            <h2 className="text-xl font-playfair font-bold text-primary mb-4">
                                Check-outs de Hoy
                                <span className="ml-2 text-sm font-normal text-gray">({todayCheckOuts.length})</span>
                            </h2>
                            {todayCheckOuts.length === 0 ? (
                                <p className="text-gray italic text-sm py-6 text-center">Sin check-outs para hoy.</p>
                            ) : (
                                <div className="flex flex-col divide-y divide-gray-light">
                                    {todayCheckOuts.map(r => (
                                        <div key={r.id} className="py-4 flex justify-between items-center">
                                            <div>
                                                <p className="font-bold text-dark">Hab. #{r.rooms?.room_number}</p>
                                                <p className="text-xs text-gray">{r.rooms?.room_types?.name} · desde {r.check_in}</p>
                                            </div>
                                            <Badge variant="danger">Check-out</Badge>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card>
                    </div>
                )}

                {/* All Reservations */}
                {view === 'reservations' && (
                    <div className="flex flex-col gap-6 text-dark">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <h2 className="text-2xl font-playfair font-bold text-primary">
                                Reservas <span className="text-gray font-normal text-lg">({filteredReservations.length})</span>
                            </h2>
                            <input
                                type="text"
                                placeholder="Buscar por ID o habitación..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="px-4 py-2 rounded-xl border border-gray-medium bg-white text-sm focus:outline-none focus:border-gold w-64"
                            />
                        </div>

                        <Card padding="none" className="overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-gray-light border-b border-gray-medium text-gray text-xs uppercase tracking-widest font-bold">
                                            <th className="px-6 py-4">ID</th>
                                            <th className="px-6 py-4">Habitación</th>
                                            <th className="px-6 py-4">Check-in</th>
                                            <th className="px-6 py-4">Check-out</th>
                                            <th className="px-6 py-4 text-right">Total</th>
                                            <th className="px-6 py-4 text-center">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm divide-y divide-gray-light">
                                        {filteredReservations.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-16 text-center text-gray italic">
                                                    No se encontraron reservas.
                                                </td>
                                            </tr>
                                        ) : filteredReservations.map(res => (
                                            <tr key={res.id} className="hover:bg-gray-light/60 transition-colors">
                                                <td className="px-6 py-4 font-mono text-xs font-bold text-gray">
                                                    RES-{res.id.slice(0, 8).toUpperCase()}
                                                </td>
                                                <td className="px-6 py-4 font-bold">
                                                    #{res.rooms?.room_number}
                                                    <span className="ml-1 text-xs font-normal text-gray">{res.rooms?.room_types?.name}</span>
                                                </td>
                                                <td className="px-6 py-4">{res.check_in}</td>
                                                <td className="px-6 py-4">{res.check_out}</td>
                                                <td className="px-6 py-4 text-right font-bold text-gold">
                                                    ${parseFloat(res.total_price || 0).toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <Badge variant={res.status === 'confirmed' ? 'success' : res.status === 'cancelled' ? 'danger' : 'info'}>
                                                        {STATUS_LABEL[res.status] ?? res.status}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Room Status */}
                {view === 'rooms' && (
                    <div className="flex flex-col gap-8 text-dark">
                        <h2 className="text-2xl font-playfair font-bold text-primary">Estado de Habitaciones ({rooms.length})</h2>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                            {rooms.map(room => (
                                <Card
                                    key={room.id}
                                    padding="none"
                                    className={`h-24 flex flex-col items-center justify-center gap-1 border-2 cursor-default
                                        ${room.status !== 'available'
                                            ? 'bg-red-50 border-danger text-danger'
                                            : 'bg-successLight/30 border-success text-success'}`}
                                >
                                    <span className="font-bold text-lg">#{room.room_number}</span>
                                    <span className="text-[10px] uppercase font-medium opacity-70">{room.room_types?.name}</span>
                                </Card>
                            ))}
                        </div>
                        <div className="flex gap-6 justify-center">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-successLight/30 border-2 border-success rounded"></div>
                                <span className="text-sm">Disponible</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-red-50 border-2 border-danger rounded"></div>
                                <span className="text-sm">Ocupada / Mantenimiento</span>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ReceptionistDashboard;
