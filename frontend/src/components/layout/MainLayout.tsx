import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './PageTransition';

const MainLayout: React.FC = () => {
    const location = useLocation();

    return (
        <div className="min-h-screen flex flex-col bg-gray-medium font-inter">
            <Navbar />
            <main className="flex-1 w-full bg-white md:bg-gray-medium overflow-x-hidden">
                <AnimatePresence mode="wait">
                    <PageTransition key={location.pathname}>
                        <Outlet />
                    </PageTransition>
                </AnimatePresence>
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
