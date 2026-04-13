import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import UIKitTest from './pages/UIKitTest';

import Landing from './pages/Landing';
import Features from './pages/Features';
import Login from './pages/Login';
import Register from './pages/Register';
import Rooms from './pages/Rooms';
import BookingDetails from './pages/BookingDetails';
import Payment from './pages/Payment';
import PaymentConfirmation from './pages/PaymentConfirmation';
import UserProfile from './pages/UserProfile';
import AdminDashboard from './pages/AdminDashboard';
import { BookingProvider } from './context/BookingContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BookingProvider>
          <BrowserRouter>
            <Routes>
              {/* Temporary UI test route */}
              <Route path="/ui-test" element={<UIKitTest />} />

              <Route element={<MainLayout />}>
                <Route path="/" element={<Landing />} />
                <Route path="/features" element={<Features />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/rooms" element={<Rooms />} />
                <Route path="/booking-details" element={<BookingDetails />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/payment-confirmation" element={<PaymentConfirmation />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/admin" element={<AdminDashboard />} />
                {/* Add more routes here in future phases */}
              </Route>
            </Routes>
          </BrowserRouter>
        </BookingProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
