import React, { type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className = '', id, ...props }, ref) => {
        // Generate a unique ID if none provided, useful for linking label and input
        const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

        return (
            <div className={`w-full flex flex-col gap-1.5 ${className}`}>
                {label && (
                    <label htmlFor={inputId} className="text-sm font-medium text-dark">
                        {label}
                    </label>
                )}
                <input
                    id={inputId}
                    ref={ref}
                    className={`
            w-full h-11 px-4 
            bg-gray-light text-dark 
            border outline-none rounded-lg
            transition-all duration-200
            placeholder:text-gray
            ${error ? 'border-danger focus:border-danger ring-1 ring-danger' : 'border-transparent focus:border-gold hover:border-gray-medium focus:ring-1 focus:ring-gold'}
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
                    {...props}
                />
                {error && <span className="text-xs text-danger">{error}</span>}
            </div>
        );
    }
);

Input.displayName = 'Input';
