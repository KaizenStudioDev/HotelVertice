import React from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export const UIKitTest: React.FC = () => {
    return (
        <div className="p-10 flex flex-col gap-10 bg-gray-light min-h-screen">
            <div>
                <h1 className="text-4xl font-playfair font-bold text-dark mb-2">Hotel Vértice - UI Kit Design System</h1>
                <p className="text-gray mb-8">This page serves as an automated test for the UI primitive components.</p>
                <hr className="border-gray-medium mb-10" />
            </div>

            <section className="flex flex-col gap-6">
                <h2 className="text-2xl font-inter font-semibold text-primary border-b pb-2">1. Typography & Colors</h2>
                <div className="flex gap-4">
                    <div className="w-24 h-24 bg-gold rounded-lg shadow-sm flex items-center justify-center text-dark font-bold">Gold</div>
                    <div className="w-24 h-24 bg-primary rounded-lg shadow-sm flex items-center justify-center text-white font-bold">Primary</div>
                    <div className="w-24 h-24 bg-gray-light border border-gray-medium rounded-lg shadow-sm flex items-center justify-center text-dark font-bold text-center">Gray <br /> Light</div>
                    <div className="w-24 h-24 bg-white rounded-lg shadow-card flex items-center justify-center text-dark font-bold text-center">White <br /> Card Base</div>
                </div>
            </section>

            <section className="flex flex-col gap-6">
                <h2 className="text-2xl font-inter font-semibold text-primary border-b pb-2">2. Buttons</h2>
                <div className="flex flex-wrap gap-4 items-center">
                    <Button variant="primary">Primary Button</Button>
                    <Button variant="primary" size="lg">Large Primary</Button>
                    <Button variant="secondary">Secondary Button</Button>
                    <Button variant="outline">Outline Button</Button>
                    <Button variant="ghost">Ghost Button</Button>
                </div>
            </section>

            <section className="flex flex-col gap-6 w-full max-w-md">
                <h2 className="text-2xl font-inter font-semibold text-primary border-b pb-2">3. Forms (Input & Select)</h2>
                <Input label="Email Address" placeholder="tomas@example.com" type="email" />
                <Input label="Password (Error State)" type="password" error="La contraseña debe tener al menos 8 caracteres" />

                <Select
                    label="Room Type"
                    options={[
                        { value: 'standard', label: 'Standard Room ($100/night)' },
                        { value: 'suite', label: 'Premium Suite ($300/night)' }
                    ]}
                />
            </section>

            <section className="flex flex-col gap-6">
                <h2 className="text-2xl font-inter font-semibold text-primary border-b pb-2">4. Badges</h2>
                <div className="flex flex-wrap gap-4">
                    <Badge variant="success">Disponible</Badge>
                    <Badge variant="danger">Ocupada</Badge>
                    <Badge variant="warning">Limpieza</Badge>
                    <Badge variant="info">Mantenimiento</Badge>
                    <Badge variant="neutral">Reservada</Badge>
                </div>
            </section>

            <section className="flex flex-col gap-6 w-full max-w-2xl">
                <h2 className="text-2xl font-inter font-semibold text-primary border-b pb-2">5. Cards</h2>
                <Card hoverEffect>
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                            <h3 className="text-xl font-playfair font-bold">Suite Residencial Premium</h3>
                            <Badge variant="success">Disponible</Badge>
                        </div>
                        <p className="text-gray text-sm">Disfruta de la mejor vista a la ciudad en nuestra suite más solicitada.</p>
                        <div className="pt-4 border-t border-gray-medium flex justify-between items-center">
                            <span className="text-lg font-semibold text-gold">$350 <span className="text-sm text-gray font-normal">/ noche</span></span>
                            <Button size="sm">Reservar Ahora</Button>
                        </div>
                    </div>
                </Card>
            </section>

        </div>
    );
};

export default UIKitTest;
