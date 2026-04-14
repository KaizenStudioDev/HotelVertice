import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, User, Settings, LogOut, Calendar, ClipboardList } from 'lucide-react';

const Navbar: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const close = () => setIsOpen(false);

    const handleLogout = () => {
        logout();
        close();
        navigate('/');
    };

    return (
        <nav className="w-full bg-primary sticky top-0 z-50 shadow-lg border-b border-gold/20">
            <div className="h-20 flex items-center justify-between px-6 lg:px-12">
                {/* Brand */}
                <Link to="/" onClick={close} className="flex items-center gap-3 hover:opacity-90 transition-opacity">
                    <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center text-primary font-bold shadow-gold/20 shadow-xl">
                        V
                    </div>
                    <span className="text-2xl font-playfair font-bold text-gold tracking-tighter">
                        HOTEL VÉRTICE
                    </span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-10">
                    <Link to="/" className="text-white hover:text-gold text-sm font-medium transition-colors uppercase tracking-[0.2em]">Inicio</Link>
                    <Link to="/features" className="text-white hover:text-gold text-sm font-medium transition-colors uppercase tracking-[0.2em]">Características</Link>
                    <Link to="/rooms" className="text-white hover:text-gold text-sm font-medium transition-colors uppercase tracking-[0.2em]">Habitaciones</Link>
                    {user && (
                        <Link to="/calendar" className="text-white hover:text-gold text-sm font-medium transition-colors uppercase tracking-[0.2em]">Calendario</Link>
                    )}

                    {user ? (
                        <div className="flex items-center gap-6 ml-4 pl-6 border-l border-white/10">
                            <Link to="/profile" className="flex items-center gap-2 text-white hover:text-gold transition-colors">
                                <User size={18} className="text-gold" />
                                <span className="text-xs font-bold uppercase tracking-widest">{user.full_name.split(' ')[0]}</span>
                            </Link>
                            {user.role === 'admin' && (
                                <Link to="/admin" className="p-2 bg-gold/10 rounded-lg text-gold hover:bg-gold/20 transition-colors" title="Admin Dashboard">
                                    <Settings size={18} />
                                </Link>
                            )}
                            {user.role === 'receptionist' && (
                                <Link to="/receptionist" className="p-2 bg-gold/10 rounded-lg text-gold hover:bg-gold/20 transition-colors" title="Panel Recepción">
                                    <ClipboardList size={18} />
                                </Link>
                            )}
                            <button
                                onClick={handleLogout}
                                className="p-2 text-gray-medium hover:text-danger hover:bg-red-500/10 rounded-lg transition-all"
                                title="Cerrar Sesión"
                            >
                                <LogOut size={18} />
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="h-10 px-6 bg-gold text-primary rounded-xl flex items-center justify-center font-bold text-sm hover:bg-gold-light transition-all shadow-lg shadow-gold/20">
                            INICIAR SESIÓN
                        </Link>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden text-gold p-2 hover:bg-gold/10 rounded-lg transition-colors"
                    onClick={() => setIsOpen(prev => !prev)}
                    aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-primary border-t border-gold/20 px-6 pb-6 flex flex-col gap-2">
                    <Link to="/" onClick={close} className="py-3 text-white hover:text-gold text-sm font-medium uppercase tracking-[0.2em] border-b border-white/10">Inicio</Link>
                    <Link to="/features" onClick={close} className="py-3 text-white hover:text-gold text-sm font-medium uppercase tracking-[0.2em] border-b border-white/10">Características</Link>
                    <Link to="/rooms" onClick={close} className="py-3 text-white hover:text-gold text-sm font-medium uppercase tracking-[0.2em] border-b border-white/10">Habitaciones</Link>
                    {user && (
                        <Link to="/calendar" onClick={close} className="py-3 flex items-center gap-3 text-white hover:text-gold text-sm font-medium uppercase tracking-[0.2em] border-b border-white/10">
                            <Calendar size={16} className="text-gold" />Calendario
                        </Link>
                    )}

                    {user ? (
                        <>
                            <Link to="/profile" onClick={close} className="py-3 flex items-center gap-3 text-white hover:text-gold border-b border-white/10">
                                <User size={18} className="text-gold" />
                                <span className="text-sm font-bold uppercase tracking-widest">{user.full_name}</span>
                            </Link>
                            {user.role === 'admin' && (
                                <Link to="/admin" onClick={close} className="py-3 flex items-center gap-3 text-gold hover:text-gold-light border-b border-white/10">
                                    <Settings size={18} />
                                    <span className="text-sm font-bold uppercase tracking-widest">Panel Admin</span>
                                </Link>
                            )}
                            {user.role === 'receptionist' && (
                                <Link to="/receptionist" onClick={close} className="py-3 flex items-center gap-3 text-gold hover:text-gold-light border-b border-white/10">
                                    <ClipboardList size={18} />
                                    <span className="text-sm font-bold uppercase tracking-widest">Panel Recepción</span>
                                </Link>
                            )}
                            <button onClick={handleLogout} className="py-3 flex items-center gap-3 text-danger hover:text-red-400 text-sm font-bold uppercase tracking-widest mt-2">
                                <LogOut size={18} /> Cerrar Sesión
                            </button>
                        </>
                    ) : (
                        <Link to="/login" onClick={close} className="mt-4 h-12 bg-gold text-primary rounded-xl flex items-center justify-center font-bold text-sm">
                            INICIAR SESIÓN
                        </Link>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
