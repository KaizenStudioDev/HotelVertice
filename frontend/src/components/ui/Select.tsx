import React, { type SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { value: string | number; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, error, className = '', options, id, ...props }, ref) => {
        const selectId = id || `select-${Math.random().toString(36).substring(2, 9)}`;

        return (
            <div className={`w-full flex flex-col gap-1.5 ${className}`}>
                {label && (
                    <label htmlFor={selectId} className="text-sm font-medium text-dark">
                        {label}
                    </label>
                )}
                <div className="relative">
                    <select
                        id={selectId}
                        ref={ref}
                        className={`
              w-full h-11 px-4 appearance-none
              bg-gray-light text-dark 
              border outline-none rounded-lg
              transition-all duration-200
              ${error ? 'border-danger focus:border-danger ring-1 ring-danger' : 'border-transparent focus:border-gold hover:border-gray-medium focus:ring-1 focus:ring-gold'}
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
                        {...props}
                    >
                        {/* Added a default disabled empty option for standard placeholder behavior if needed */}
                        <option value="" disabled hidden>
                            Seleccionar...
                        </option>
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    {/* Custom dropdown arrow */}
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg
                            className="w-4 h-4 text-gray"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
                {error && <span className="text-xs text-danger">{error}</span>}
            </div>
        );
    }
);

Select.displayName = 'Select';
