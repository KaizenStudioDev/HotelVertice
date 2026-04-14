import React, { createContext, useContext, useState, type ReactNode } from 'react';

export const calcNights = (checkIn: string, checkOut: string): number => {
    const ms = new Date(checkOut).getTime() - new Date(checkIn).getTime();
    return Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)));
};

const formatDate = (d: Date): string => d.toISOString().split('T')[0];

export interface BookingState {
    checkIn: string;
    checkOut: string;
    guests: number;
    roomId?: number;
    roomName?: string;
    pricePerNight?: number;
    totalPrice?: number;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    reservationId?: string;
}

interface BookingContextType {
    booking: BookingState;
    updateBooking: (updates: Partial<BookingState>) => void;
    resetBooking: () => void;
}

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

const initialBooking: BookingState = {
    checkIn: formatDate(today),
    checkOut: formatDate(tomorrow),
    guests: 1,
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [booking, setBooking] = useState<BookingState>(initialBooking);

    const updateBooking = (updates: Partial<BookingState>) => {
        setBooking((prev) => ({ ...prev, ...updates }));
    };

    const resetBooking = () => {
        setBooking(initialBooking);
    };

    return (
        <BookingContext.Provider value={{ booking, updateBooking, resetBooking }}>
            {children}
        </BookingContext.Provider>
    );
};

export const useBooking = () => {
    const context = useContext(BookingContext);
    if (context === undefined) {
        throw new Error('useBooking must be used within a BookingProvider');
    }
    return context;
};
