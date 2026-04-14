import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import type { EventClickArg, EventContentArg } from '@fullcalendar/core';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { roomService, reservationService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { X, Calendar, Home, Info } from 'lucide-react';

// ── Color map by reservation status ──────────────────────────────────────────
const STATUS_COLORS: Record<string, { bg: string; border: string; text: string }> = {
    confirmed:   { bg: '#D4AF37', border: '#b8962e', text: '#1A1A2E' },
    cancelled:   { bg: '#D4183D', border: '#b01231', text: '#ffffff' },
    maintenance: { bg: '#6B7280', border: '#4B5563', text: '#ffffff' },
    available:   { bg: '#00A63E', border: '#007a2e', text: '#ffffff' },
};

const STATUS_LABEL: Record<string, string> = {
    confirmed:   'Confirmada',
    cancelled:   'Cancelada',
    maintenance: 'Mantenimiento',
    available:   'Disponible',
};

interface ReservationEvent {
    id: string;
    title: string;
    start: string;
    end: string;
    backgroundColor: string;
    borderColor: string;
    textColor: string;
    extendedProps: {
        status: string;
        roomNumber: string | number;
        roomType: string;
        checkIn: string;
        checkOut: string;
        totalPrice: number;
        userId: string;
    };
}

interface SelectedEvent {
    id: string;
    status: string;
    roomNumber: string | number;
    roomType: string;
    checkIn: string;
    checkOut: string;
    totalPrice: number;
}

const CalendarPage: React.FC = () => {
    const { user } = useAuth();
    const { addToast } = useToast();
    const isAdmin = user?.role === 'admin';

    const [events, setEvents] = useState<ReservationEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState<SelectedEvent | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>('all');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [reservationsRes, roomsRes] = await Promise.all([
                    isAdmin ? reservationService.getAllForAdmin() : reservationService.getAll(),
                    roomService.getAll(),
                ]);

                const reservations: any[] = reservationsRes.data ?? [];
                const rooms: any[] = roomsRes.data ?? [];

                // Build events from reservations
                const reservationEvents: ReservationEvent[] = reservations.map((res) => {
                    const colors = STATUS_COLORS[res.status] ?? STATUS_COLORS.confirmed;
                    const roomType = res.rooms?.room_types?.name ?? '';
                    return {
                        id: res.id,
                        title: `#${res.rooms?.room_number} — ${roomType}`,
                        start: res.check_in,
                        // FullCalendar end date is exclusive, add 1 day
                        end: addOneDay(res.check_out),
                        backgroundColor: colors.bg,
                        borderColor: colors.border,
                        textColor: colors.text,
                        extendedProps: {
                            status: res.status,
                            roomNumber: res.rooms?.room_number ?? '?',
                            roomType,
                            checkIn: res.check_in,
                            checkOut: res.check_out,
                            totalPrice: parseFloat(res.total_price ?? 0),
                            userId: res.user_id,
                        },
                    };
                });

                // Show maintenance rooms as background events (admin only)
                const maintenanceEvents: ReservationEvent[] = isAdmin
                    ? rooms
                        .filter((r) => r.status === 'maintenance')
                        .map((r) => ({
                            id: `maint-${r.id}`,
                            title: `#${r.room_number} — Mantenimiento`,
                            start: new Date().toISOString().split('T')[0],
                            end: addOneDay(new Date().toISOString().split('T')[0]),
                            backgroundColor: STATUS_COLORS.maintenance.bg,
                            borderColor: STATUS_COLORS.maintenance.border,
                            textColor: STATUS_COLORS.maintenance.text,
                            extendedProps: {
                                status: 'maintenance',
                                roomNumber: r.room_number,
                                roomType: r.room_types?.name ?? '',
                                checkIn: '',
                                checkOut: '',
                                totalPrice: 0,
                                userId: '',
                            },
                        }))
                    : [];

                setEvents([...reservationEvents, ...maintenanceEvents]);
            } catch {
                addToast('Error al cargar el calendario', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isAdmin]);

    const addOneDay = (dateStr: string): string => {
        const d = new Date(dateStr);
        d.setDate(d.getDate() + 1);
        return d.toISOString().split('T')[0];
    };

    const handleEventClick = (info: EventClickArg) => {
        const p = info.event.extendedProps;
        setSelectedEvent({
            id: info.event.id,
            status: p.status,
            roomNumber: p.roomNumber,
            roomType: p.roomType,
            checkIn: p.checkIn,
            checkOut: p.checkOut,
            totalPrice: p.totalPrice,
        });
    };

    const filteredEvents = filterStatus === 'all'
        ? events
        : events.filter((e) => e.extendedProps.status === filterStatus);

    const stats = {
        confirmed: events.filter((e) => e.extendedProps.status === 'confirmed').length,
        cancelled: events.filter((e) => e.extendedProps.status === 'cancelled').length,
    };

    return (
        <div className="w-full min-h-screen bg-gray-light py-12 px-6 lg:px-10">
            <div className="max-w-7xl mx-auto flex flex-col gap-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-3xl font-playfair font-bold text-dark flex items-center gap-3">
                            <Calendar size={32} className="text-gold" />
                            Calendario de Disponibilidad
                        </h1>
                        <p className="text-gray text-sm">
                            {isAdmin
                                ? 'Vista de todas las reservas y disponibilidad del hotel'
                                : 'Vista de tus reservas activas'}
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-3 flex-wrap">
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-medium shadow-sm">
                            <div className="w-3 h-3 rounded-full bg-gold"></div>
                            <span className="text-sm font-medium text-dark">{stats.confirmed} confirmadas</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-medium shadow-sm">
                            <div className="w-3 h-3 rounded-full bg-danger"></div>
                            <span className="text-sm font-medium text-dark">{stats.cancelled} canceladas</span>
                        </div>
                    </div>
                </div>

                {/* Filter + Legend */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    {/* Status filter */}
                    <div className="flex gap-2 flex-wrap">
                        {[
                            { value: 'all',       label: 'Todas' },
                            { value: 'confirmed', label: 'Confirmadas' },
                            { value: 'cancelled', label: 'Canceladas' },
                        ].map((f) => (
                            <button
                                key={f.value}
                                onClick={() => setFilterStatus(f.value)}
                                className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all
                                    ${filterStatus === f.value
                                        ? 'bg-primary text-white border-primary'
                                        : 'bg-white text-gray border-gray-medium hover:border-primary'}`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>

                    {/* Legend */}
                    <div className="flex gap-4 flex-wrap text-xs font-medium">
                        {Object.entries(STATUS_LABEL).filter(([k]) => k !== 'available').map(([key, label]) => (
                            <div key={key} className="flex items-center gap-1.5">
                                <div
                                    className="w-3 h-3 rounded-sm"
                                    style={{ backgroundColor: STATUS_COLORS[key].bg }}
                                />
                                <span className="text-gray">{label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Calendar */}
                <Card padding="md" className="shadow-sm border border-gray-medium overflow-hidden">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32 gap-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
                            <p className="text-gray animate-pulse">Cargando reservas...</p>
                        </div>
                    ) : (
                        <div className="fc-hotel-vertice">
                            <FullCalendar
                                plugins={[dayGridPlugin, interactionPlugin, listPlugin]}
                                initialView="dayGridMonth"
                                locale="es"
                                headerToolbar={{
                                    left: 'prev,next today',
                                    center: 'title',
                                    right: 'dayGridMonth,dayGridWeek,listMonth',
                                }}
                                buttonText={{
                                    today: 'Hoy',
                                    month: 'Mes',
                                    week: 'Semana',
                                    list: 'Lista',
                                }}
                                events={filteredEvents}
                                eventClick={handleEventClick}
                                eventContent={(arg: EventContentArg) => (
                                    <div className="px-1.5 py-0.5 overflow-hidden w-full cursor-pointer">
                                        <span className="text-xs font-semibold truncate block leading-tight">
                                            {arg.event.title}
                                        </span>
                                    </div>
                                )}
                                dayMaxEvents={3}
                                moreLinkText={(n) => `+${n} más`}
                                height="auto"
                                aspectRatio={1.8}
                                firstDay={1}
                                nowIndicator
                            />
                        </div>
                    )}
                </Card>

                {/* Info note */}
                <div className="flex items-start gap-3 bg-gold/5 border border-gold/20 rounded-xl px-5 py-4 text-sm text-gray">
                    <Info size={18} className="text-gold mt-0.5 shrink-0" />
                    <span>
                        Haz clic en cualquier evento del calendario para ver los detalles de la reserva.
                        {isAdmin && ' Como administrador, ves todas las reservas del hotel.'}
                    </span>
                </div>
            </div>

            {/* Event Detail Modal */}
            {selectedEvent && (
                <div
                    className="fixed inset-0 bg-dark/50 z-50 flex items-center justify-center p-6"
                    onClick={() => setSelectedEvent(null)}
                >
                    <div onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                    <Card
                        padding="lg"
                        className="w-full max-w-md shadow-2xl border-none"
                    >
                        <div className="flex flex-col gap-5">
                            {/* Modal Header */}
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                                        style={{ backgroundColor: STATUS_COLORS[selectedEvent.status]?.bg + '20' }}
                                    >
                                        <Home size={20} style={{ color: STATUS_COLORS[selectedEvent.status]?.bg }} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-playfair font-bold text-dark">
                                            Habitación #{selectedEvent.roomNumber}
                                        </h2>
                                        <p className="text-sm text-gray">{selectedEvent.roomType}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedEvent(null)}
                                    className="p-2 hover:bg-gray-light rounded-lg transition-colors text-gray"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Status Badge */}
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray font-medium">Estado:</span>
                                <Badge
                                    variant={
                                        selectedEvent.status === 'confirmed' ? 'success'
                                        : selectedEvent.status === 'cancelled' ? 'danger'
                                        : 'neutral'
                                    }
                                >
                                    {STATUS_LABEL[selectedEvent.status] ?? selectedEvent.status}
                                </Badge>
                            </div>

                            {/* Dates */}
                            {selectedEvent.checkIn && (
                                <div className="grid grid-cols-2 gap-4 bg-gray-light rounded-xl p-4">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs text-gray uppercase font-bold tracking-widest">Check-in</span>
                                        <span className="text-dark font-semibold">{selectedEvent.checkIn}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs text-gray uppercase font-bold tracking-widest">Check-out</span>
                                        <span className="text-dark font-semibold">{selectedEvent.checkOut}</span>
                                    </div>
                                </div>
                            )}

                            {/* Total */}
                            {selectedEvent.totalPrice > 0 && (
                                <div className="flex justify-between items-center pt-2 border-t border-gray-medium">
                                    <span className="text-sm font-bold text-gray uppercase tracking-widest">Total</span>
                                    <span className="text-2xl font-bold text-gold font-playfair">
                                        ${selectedEvent.totalPrice.toLocaleString()}
                                    </span>
                                </div>
                            )}

                            <Button variant="secondary" fullWidth onClick={() => setSelectedEvent(null)}>
                                Cerrar
                            </Button>
                        </div>
                    </Card>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalendarPage;
