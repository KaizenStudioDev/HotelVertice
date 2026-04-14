import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { roomService, reservationService } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Calendar } from 'lucide-react';

const STATUS_LABEL: Record<string, string> = {
    confirmed: 'Confirmada',
    cancelled: 'Cancelada',
    pending: 'Pendiente',
};

const AdminDashboard: React.FC = () => {
    const { addToast } = useToast();
    const [view, setView] = useState<'overview' | 'bookings' | 'rooms'>('overview');
    const [rooms, setRooms] = useState<any[]>([]);
    const [reservations, setReservations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [cancellingId, setCancellingId] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    useEffect(() => {
        const controller = new AbortController();

        const fetchData = async () => {
            setLoading(true);
            const [roomsRes, resRes] = await Promise.allSettled([
                roomService.getAll(),
                reservationService.getAllForAdmin(),
            ]);

            if (controller.signal.aborted) return;

            if (roomsRes.status === 'fulfilled') {
                setRooms(roomsRes.value.data ?? []);
            } else {
                addToast('Error al cargar habitaciones', 'error');
            }

            if (resRes.status === 'fulfilled') {
                setReservations(resRes.value.data ?? []);
            } else {
                const err = (resRes.reason as any)?.response?.data?.error;
                addToast(`Error al cargar reservas: ${err || 'sin acceso'}`, 'error');
            }

            setLoading(false);
        };

        fetchData();
        return () => controller.abort();
    }, []);

    const handleCancel = async (id: string) => {
        if (!confirm('¿Seguro que quieres cancelar esta reserva?')) return;
        setCancellingId(id);
        try {
            await reservationService.cancel(id);
            setReservations(prev =>
                prev.map(r => r.id === id ? { ...r, status: 'cancelled' } : r)
            );
            addToast('Reserva cancelada correctamente', 'success');
        } catch {
            addToast('Error al cancelar la reserva', 'error');
        } finally {
            setCancellingId(null);
        }
    };

    const activeBookings = reservations.filter(r => r.status === 'confirmed').length;
    const freeRooms = rooms.filter(r => r.status === 'available').length;
    const totalRevenue = reservations.reduce((acc, r) =>
        acc + (r.status === 'confirmed' ? parseFloat(r.total_price || 0) : 0), 0);

    const STATS = [
        { label: 'Reservas Activas',   value: activeBookings.toString(),          color: 'bg-blue-100 text-blue-700' },
        { label: 'Habitaciones Libres', value: freeRooms.toString(),               color: 'bg-successLight text-success' },
        { label: 'Ocupación',           value: rooms.length > 0 ? `${Math.round(((rooms.length - freeRooms) / rooms.length) * 100)}%` : '0%', color: 'bg-amber-100 text-amber-700' },
        { label: 'Ingresos Totales',    value: `$${totalRevenue.toLocaleString()}`, color: 'bg-gold-light/20 text-gold-dark' },
    ];

    const filteredReservations = reservations.filter(r => {
        const matchStatus = filterStatus === '' || r.status === filterStatus;
        const matchSearch = search === '' ||
            r.id.slice(0, 8).toLowerCase().includes(search.toLowerCase()) ||
            (r.rooms?.room_number?.toString() || '').includes(search) ||
            (r.user_id || '').toLowerCase().includes(search.toLowerCase());
        return matchStatus && matchSearch;
    });

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
                    <div className="flex flex-col gap-1">
                        <h1 className="text-3xl font-playfair font-bold text-dark">Panel de Administrador</h1>
                        <p className="text-gray italic text-sm">Gestionando Hotel Vértice</p>
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
                            {(['overview', 'bookings', 'rooms'] as const).map((v) => (
                                <Button key={v} variant={view === v ? 'secondary' : 'ghost'} size="sm" onClick={() => setView(v)}>
                                    {{ overview: 'General', bookings: 'Reservas', rooms: 'Habitaciones' }[v]}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Overview */}
                {view === 'overview' && (
                    <div className="flex flex-col gap-8 text-dark">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {STATS.map((stat, i) => (
                                <Card key={i} padding="md" className="flex flex-col gap-2">
                                    <span className="text-sm font-medium text-gray">{stat.label}</span>
                                    <span className={`text-2xl font-bold rounded-lg px-2 w-fit ${stat.color}`}>{stat.value}</span>
                                </Card>
                            ))}
                        </div>
                        <Card padding="lg">
                            <h2 className="text-xl font-playfair font-bold text-primary mb-6">Actividad Reciente</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-gray-medium text-gray text-xs uppercase tracking-widest font-bold">
                                            <th className="pb-4">ID</th>
                                            <th className="pb-4">Habitación</th>
                                            <th className="pb-4">Fechas</th>
                                            <th className="pb-4 text-right">Total</th>
                                            <th className="pb-4 text-right">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {reservations.slice(0, 8).map((res) => (
                                            <tr key={res.id} className="border-b border-gray-light last:border-0 hover:bg-gray-50 transition-colors">
                                                <td className="py-4 text-xs font-mono font-bold text-gray">RES-{res.id.slice(0, 8).toUpperCase()}</td>
                                                <td className="py-4 font-bold">#{res.rooms?.room_number} <span className="font-normal text-gray text-xs">{res.rooms?.room_types?.name}</span></td>
                                                <td className="py-4 text-xs">{res.check_in} → {res.check_out}</td>
                                                <td className="py-4 text-right font-bold text-gold">${parseFloat(res.total_price || 0).toLocaleString()}</td>
                                                <td className="py-4 text-right">
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

                {/* Bookings */}
                {view === 'bookings' && (
                    <div className="flex flex-col gap-6 text-dark">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <h2 className="text-2xl font-playfair font-bold text-primary">
                                Todas las Reservas <span className="text-gray font-normal text-lg">({filteredReservations.length})</span>
                            </h2>
                            <div className="flex gap-3 flex-wrap">
                                <input
                                    type="text"
                                    placeholder="Buscar por ID o habitación..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="px-4 py-2 rounded-xl border border-gray-medium bg-white text-sm focus:outline-none focus:border-gold w-56"
                                />
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="px-4 py-2 rounded-xl border border-gray-medium bg-white text-sm focus:outline-none focus:border-gold"
                                >
                                    <option value="">Todos los estados</option>
                                    <option value="confirmed">Confirmadas</option>
                                    <option value="cancelled">Canceladas</option>
                                </select>
                            </div>
                        </div>

                        <Card padding="none" className="overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-gray-light border-b border-gray-medium text-gray text-xs uppercase tracking-widest font-bold">
                                            <th className="px-6 py-4">ID Reserva</th>
                                            <th className="px-6 py-4">Habitación</th>
                                            <th className="px-6 py-4">Check-in</th>
                                            <th className="px-6 py-4">Check-out</th>
                                            <th className="px-6 py-4 text-right">Total</th>
                                            <th className="px-6 py-4 text-center">Estado</th>
                                            <th className="px-6 py-4 text-center">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm divide-y divide-gray-light">
                                        {filteredReservations.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="px-6 py-16 text-center text-gray italic">
                                                    No se encontraron reservas.
                                                </td>
                                            </tr>
                                        ) : filteredReservations.map((res) => (
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
                                                <td className="px-6 py-4 text-center">
                                                    {res.status === 'confirmed' ? (
                                                        <Button
                                                            variant="danger"
                                                            size="sm"
                                                            disabled={cancellingId === res.id}
                                                            onClick={() => handleCancel(res.id)}
                                                        >
                                                            {cancellingId === res.id ? 'Cancelando...' : 'Cancelar'}
                                                        </Button>
                                                    ) : (
                                                        <span className="text-xs text-gray">—</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Rooms */}
                {view === 'rooms' && (
                    <div className="flex flex-col gap-8 text-dark">
                        <h2 className="text-2xl font-playfair font-bold text-primary">Estado de Habitaciones ({rooms.length})</h2>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                            {rooms.map((room) => (
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

export default AdminDashboard;
