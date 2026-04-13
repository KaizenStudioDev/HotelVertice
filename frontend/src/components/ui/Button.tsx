import React, { type ButtonHTMLAttributes } from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    className = '',
    disabled = false,
    ...props
}) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-xl font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-xs';

    const variantClasses = {
        primary: 'bg-gold hover:bg-gold-light text-primary shadow-lg shadow-gold/20 focus:ring-gold border-none',
        secondary: 'bg-primary hover:bg-primary-light text-white shadow-lg shadow-primary/20 focus:ring-primary border-none',
        outline: 'border-2 border-gold text-gold hover:bg-gold hover:text-primary shadow-sm focus:ring-gold',
        ghost: 'bg-transparent text-gray hover:bg-gray-light/50 hover:text-primary focus:ring-gray border-none',
        danger: 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 focus:ring-red-500 border-none',
    };

    const sizeClasses = {
        sm: 'h-9 px-4',
        md: 'h-12 px-8',
        lg: 'h-14 px-10 text-sm',
    };

    const widthClass = fullWidth ? 'w-full' : '';

    return (
        <motion.button
            whileHover={!disabled ? { scale: 1.02, y: -2 } : {}}
            whileTap={!disabled ? { scale: 0.98 } : {}}
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
            disabled={disabled}
            {...(props as any)}
        >
            {children}
        </motion.button>
    );
};
