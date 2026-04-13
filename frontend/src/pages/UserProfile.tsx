import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { reservationService, authService } from '../services/api';
import { generateReservationPDF } from '../services/pdfService';
import { FileText, Calendar, Shield, LogOut, User } from 'lucide-react';

const UserProfile: React.FC = () => {
    const navigate = useNavigate();
    const { user, logout, updateUser, loading: authLoading } = useAuth();
    const [activeTab, setActiveTab] = useState<'reservations' | 'data' | 'security'>('reservations');
    const [reservations, setReservations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Datos personales
    const [fullName, setFullName] = useState('');
    const [savingProfile, setSavingProfile] = useState(false);
    const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Seguridad
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [savingPassword, setSavingPassword] = useState(false);
    const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const res = await reservationService.getAll();
                setReservations(res.data);
            } catch (err) {
                // Silently fail if not logged in or error
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchReservations();
    }, [user]);

    useEffect(() => {
        if (user) setFullName(user.full_name);
    }, [user]);

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingProfile(true);
        setProfileMsg(null);
        try {
            const res = await authService.updateProfile({ full_name: fullName });
            updateUser({ full_name: res.data.full_name });
            setProfileMsg({ type: 'success', text: '¡Nombre actualizado correctamente!' });
        } catch {
            setProfileMsg({ type: 'error', text: 'Error al guardar los cambios.' });
        } finally {
            setSavingProfile(false);
        }
    };

    const handleSavePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordMsg(null);
        if (newPassword.length < 8) {
            setPasswordMsg({ type: 'error', text: 'La contraseña debe tener al menos 8 caracteres.' });
            return;
        }
        if (newPassword !== confirmPassword) {
            setPasswordMsg({ type: 'error', text: 'Las contraseñas no coinciden.' });
            return;
        }
        setSavingPassword(true);
        try {
            await authService.updatePassword({ newPassword });
            setPasswordMsg({ type: 'success', text: '¡Contraseña actualizada correctamente!' });
            setNewPassword('');
            setConfirmPassword('');
        } catch {
            setPasswordMsg({ type: 'error', text: 'Error al actualizar la contraseña.' });
        } finally {
            setSavingPassword(false);
        }
    };

    if (authLoading) return (
        <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-light gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
            <p className="text-gray animate-pulse font-medium">Validando sesión...</p>
        </div>
    );

    if (!user) return (
        <div className="w-full min-h-[60vh] flex flex-col items-center justify-center p-10 text-center bg-gray-light font-inter">
            <Card className="max-w-md p-10 flex flex-col items-center gap-6 shadow-premium border-none">
                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center text-gold">
                    <LogOut size={32} />
                </div>
                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-playfair font-bold text-dark">Sesión requerida</h2>
                    <p className="text-gray">Por favor, inicia sesión para acceder a tu perfil y gestionar tus reservas.</p>
                </div>
                <Button onClick={() => navigate('/login')} fullWidth size="lg">Ir al Inicio de Sesión</Button>
            </Card>
        </div>
    );

    return (
        <div className="w-full min-h-screen bg-gray-light py-12 px-6 lg:px-10 font-inter">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">

                {/* Sidebar Navigation */}
                <aside className="w-full md:w-64 flex flex-col gap-2">
                    <Button
                        variant={activeTab === 'reservations' ? 'secondary' : 'ghost'}
                        className="justify-start text-left gap-3"
                        onClick={() => setActiveTab('reservations')}
                    >
                        <Calendar size={18} /> Mis Reservas
                    </Button>
                    <Button
                        variant={activeTab === 'data' ? 'secondary' : 'ghost'}
                        className="justify-start text-left gap-3"
                        onClick={() => setActiveTab('data')}
                    >
                        <User size={18} /> Mis Datos
                    </Button>
                    <Button
                        variant={activeTab === 'security' ? 'secondary' : 'ghost'}
                        className="justify-start text-left gap-3"
                        onClick={() => setActiveTab('security')}
                    >
                        <Shield size={18} /> Seguridad
                    </Button>
                    <hr className="my-4 border-gray-medium" />
                    <Button onClick={logout} variant="ghost" className="justify-start text-left text-danger hover:bg-red-50 gap-3 font-bold">
                        <LogOut size={18} /> Cerrar Sesión
                    </Button>
                </aside>

                {/* Content Area */}
                <main className="flex-1 flex flex-col gap-6">

                    {activeTab === 'reservations' && (
                        <div className="flex flex-col gap-6">
                            <h1 className="text-4xl font-playfair font-bold text-dark">Mis Reservas</h1>
                            {loading ? (
                                <div className="flex flex-col gap-4">
                                    {[1, 2].map(i => (
                                        <div key={i} className="h-32 bg-white rounded-2xl animate-pulse shadow-sm border border-gray-medium"></div>
                                    ))}
                                </div>
                            ) : reservations.length === 0 ? (
                                <Card padding="lg" className="text-center py-16 border-none shadow-sm">
                                   <p className="text-gray italic">No tienes reservas aún.</p>
                                </Card>
                            ) : reservations.map((res) => (
                                <Card key={res.id} padding="md" className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-none shadow-premium transition-all hover:translate-y-[-2px] bg-white">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] font-bold text-gray uppercase tracking-[0.2em]">CÓDIGO: {res.id.slice(0, 8)}</span>
                                        <h3 className="text-2xl font-playfair font-bold text-primary">Habitación {res.rooms?.room_number}</h3>
                                        <p className="text-sm text-gray flex items-center gap-2">
                                            <Calendar size={14} className="text-gold" /> {res.check_in} — {res.check_out}
                                        </p>
                                    </div>
                                    <div className="flex flex-col sm:items-end gap-3 w-full sm:w-auto">
                                        <div className="flex items-center gap-4">
                                            <Badge variant={res.status === 'confirmed' ? 'success' : res.status === 'cancelled' ? 'danger' : 'neutral'}>
                                                {res.status.toUpperCase()}
                                            </Badge>
                                            <span className="text-2xl font-bold text-dark font-playfair">${res.total_price}</span>
                                        </div>
                                        <Button 
                                            variant="secondary" 
                                            size="sm" 
                                            className="gap-2 text-xs h-9 bg-gray-light hover:bg-gold-light/20 text-primary border-none"
                                            onClick={() => generateReservationPDF({
                                                id: res.id,
                                                guestName: user.full_name,
                                                guestEmail: user.email,
                                                roomName: `Habitación ${res.rooms?.room_number}`,
                                                checkIn: res.check_in,
                                                checkOut: res.check_out,
                                                totalPrice: parseFloat(res.total_price)
                                            })}
                                        >
                                            <FileText size={16} /> Descargar Recibo
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}

                    {activeTab === 'data' && (
                        <div className="flex flex-col gap-6">
                            <h1 className="text-4xl font-playfair font-bold text-dark">Información Personal</h1>
                            <Card padding="lg" className="border-none shadow-premium">
                                <form className="grid grid-cols-1 md:grid-cols-2 gap-8" onSubmit={handleSaveProfile}>
                                    <Input
                                        label="Nombre Completo"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="Tu nombre..."
                                        required
                                    />
                                    <Input label="Correo Electrónico" value={user.email} disabled placeholder="email@ejemplo.com" />
                                    {profileMsg && (
                                        <p className={`md:col-span-2 text-sm font-medium ${profileMsg.type === 'success' ? 'text-success' : 'text-danger'}`}>
                                            {profileMsg.text}
                                        </p>
                                    )}
                                    <div className="md:col-span-2 flex justify-end mt-4">
                                        <Button type="submit" size="lg" className="px-10" disabled={savingProfile}>
                                            {savingProfile ? 'Guardando...' : 'Guardar Cambios'}
                                        </Button>
                                    </div>
                                </form>
                            </Card>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="flex flex-col gap-6">
                            <h1 className="text-4xl font-playfair font-bold text-dark">Seguridad</h1>
                            <Card padding="lg" className="max-w-md border-none shadow-premium">
                                <form className="flex flex-col gap-6" onSubmit={handleSavePassword}>
                                    <Input
                                        label="Nueva Contraseña"
                                        type="password"
                                        placeholder="Mínimo 8 caracteres"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                    />
                                    <Input
                                        label="Confirmar Nueva Contraseña"
                                        type="password"
                                        placeholder="Repite la contraseña"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                    {passwordMsg && (
                                        <p className={`text-sm font-medium ${passwordMsg.type === 'success' ? 'text-success' : 'text-danger'}`}>
                                            {passwordMsg.text}
                                        </p>
                                    )}
                                    <div className="flex justify-end mt-4">
                                        <Button type="submit" fullWidth size="lg" disabled={savingPassword}>
                                            {savingPassword ? 'Actualizando...' : 'Actualizar Contraseña'}
                                        </Button>
                                    </div>
                                </form>
                            </Card>
                        </div>
                    )}

                </main>

            </div>
        </div>
    );
};

export default UserProfile;
