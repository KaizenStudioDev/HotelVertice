import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const { addToast } = useToast();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await authService.login({ email, password });
            const { session, user: supabaseUser } = res.data.data;
            const userData = {
                id: supabaseUser.id,
                email: supabaseUser.email,
                full_name: supabaseUser.user_metadata.full_name,
                role: supabaseUser.user_metadata.role
            };
            login(session.access_token, userData);
            addToast('¡Bienvenido de nuevo!', 'success');
            
            const from = (location.state as any)?.from || '/profile';
            navigate(from, { replace: true });
        } catch (err: any) {
            addToast(err.response?.data?.error || 'Error al iniciar sesión', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full flex-1 flex flex-col items-center justify-center p-6 lg:p-12 bg-gray-light min-h-[calc(100vh-72px)]">

            <div className="mb-8 text-center">
                <h1 className="text-3xl font-playfair font-bold text-dark mb-2">Bienvenido de nuevo</h1>
                <p className="text-gray text-base">Inicia sesión en Hotel Vértice para gestionar tus reservas.</p>
            </div>

            <Card className="w-full max-w-md" padding="lg">
                <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
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
                        placeholder="••••••••"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 rounded border-gray-medium text-gold focus:ring-gold" />
                            <span className="text-sm text-gray">Recordarme</span>
                        </label>
                        <a href="#" className="text-sm font-medium text-gold hover:underline">¿Olvidaste tu contraseña?</a>
                    </div>

                    <Button type="submit" fullWidth disabled={isLoading}>
                        {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
                    </Button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-medium text-center">
                    <p className="text-sm text-gray">
                        ¿No tienes una cuenta?{' '}
                        <Link to="/register" className="font-medium text-primary hover:text-gold transition-colors">
                            Regístrate ahora
                        </Link>
                    </p>
                </div>
            </Card>

        </div>
    );
};

export default Login;
