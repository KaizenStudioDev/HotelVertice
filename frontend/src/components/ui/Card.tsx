import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
    children,
    className = '',
    padding = 'md',
    hoverEffect = false,
}) => {
    const paddingClasses = {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
    };

    const baseClasses = 'bg-white rounded-[16px] border border-gray-medium shadow-sm overflow-hidden';
    const hoverClasses = hoverEffect ? 'transition-transform duration-300 hover:-translate-y-1 hover:shadow-card cursor-pointer' : '';

    return (
        <div className={`${baseClasses} ${paddingClasses[padding]} ${hoverClasses} ${className}`}>
            {children}
        </div>
    );
};
