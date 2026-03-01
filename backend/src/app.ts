import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import roomRoutes from './routes/roomRoutes.js';
import authRoutes from './routes/authRoutes.js';
import reservationRoutes from './routes/reservationRoutes.js';

dotenv.config();

export const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Boutique Hotel API is running');
});

app.use('/api/rooms', roomRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/reservations', reservationRoutes);

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
