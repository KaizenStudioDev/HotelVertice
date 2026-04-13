import React from 'react';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
    className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
    children,
    variant = 'neutral',
    className = '',
}) => {
    const variantClasses = {
        success: 'bg-successLight text-success border border-success/20',
        warning: 'bg-amber-100 text-amber-700 border border-amber-200',
        danger: 'bg-red-100 text-danger border border-red-200',
        info: 'bg-blue-100 text-blue-700 border border-blue-200',
        neutral: 'bg-gray-light text-gray-700 border border-gray-medium',
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}>
            {children}
        </span>
    );
};
