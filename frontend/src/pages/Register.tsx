import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Register: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const { addToast } = useToast();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return addToast('Las contraseñas no coinciden', 'error');
        }
        setIsLoading(true);
        try {
            const res = await authService.register({ full_name: fullName, email, password });
            const { session, user: supabaseUser } = res.data.data;
            if (session) {
                const userData = {
                    id: supabaseUser.id,
                    email: supabaseUser.email,
                    full_name: supabaseUser.user_metadata.full_name,
                    role: supabaseUser.user_metadata.role
                };
                login(session.access_token, userData);
                addToast('¡Cuenta creada con éxito!', 'success');
                
                const from = (location.state as any)?.from || '/profile';
                navigate(from, { replace: true });
            } else {
                addToast('Cuenta creada. Por favor, inicia sesión.', 'success');
                navigate('/login', { state: location.state });
            }
        } catch (err: any) {
            addToast(err.response?.data?.error || 'Error al registrarse', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full flex-1 flex flex-col items-center justify-center p-6 lg:p-12 bg-gray-light min-h-[calc(100vh-72px)]">

            <div className="mb-8 text-center max-w-lg">
                <h1 className="text-3xl font-playfair font-bold text-dark mb-2">Crear Cuenta</h1>
                <p className="text-gray text-base">Únete a Hotel Vértice. Disfruta de beneficios exclusivos y acceso a todo el historial de tus reservas.</p>
            </div>

            <Card className="w-full max-w-md" padding="lg">
                <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                    <Input
                        label="Nombre Completo"
                        type="text"
                        placeholder="Ej. Juan Pérez"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />
                    <Input
                        label="Correo Electrónico"
                        type="email"
                        placeholder="tucorreo@ejemplo.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                        label="Contraseña"
                        type="password"
                        placeholder="Mínimo 8 caracteres"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Input
                        label="Confirmar Contraseña"
                        type="password"
                        placeholder="Repite tu contraseña"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    <div className="flex items-start gap-2 mt-2">
                        <input type="checkbox" className="w-4 h-4 mt-0.5 rounded border-gray-medium text-gold focus:ring-gold" required />
                        <span className="text-sm text-gray leading-tight">
                            Acepto los <a href="#" className="text-primary font-medium hover:underline">Términos y Condiciones</a> y la <a href="#" className="text-primary font-medium hover:underline">Política de Privacidad</a>
                        </span>
                    </div>

                    <Button type="submit" fullWidth disabled={isLoading}>
                        {isLoading ? 'Registrando...' : 'Crear Cuenta'}
                    </Button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-medium text-center">
                    <p className="text-sm text-gray">
                        ¿Ya tienes una cuenta?{' '}
                        <Link to="/login" className="font-medium text-primary hover:text-gold transition-colors">
                            Inicia sesión
                        </Link>
                    </p>
                </div>
            </Card>

        </div>
    );
};

export default Register;
