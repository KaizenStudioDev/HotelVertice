import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

interface PDFData {
  id: string;
  guestName: string;
  guestEmail: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
}

export const generateReservationPDF = (data: PDFData) => {
  const doc = new jsPDF() as any;

  // Header Colors & Styling
  const primaryColor = [13, 27, 42]; // Hotel Primary
  const goldColor = [201, 173, 116]; // Hotel Gold

  // Logo Placeholder / Text Brand
  doc.setFillColor(...goldColor);
  doc.roundedRect(20, 15, 12, 12, 2, 2, 'F');
  doc.setTextColor(...primaryColor);
  doc.setFont('playfair', 'bold');
  doc.setFontSize(22);
  doc.text('HOTEL VÉRTICE', 38, 25);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('Comprobante de Reserva Oficial', 38, 30);

  // Horizontal Line
  doc.setDrawColor(230, 230, 230);
  doc.line(20, 40, 190, 40);

  // Reservation ID & Date
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`NÚMERO DE RESERVA: ${data.id.toUpperCase()}`, 20, 50);
  doc.setFont('helvetica', 'normal');
  doc.text(`Fecha de emisión: ${new Date().toLocaleDateString()}`, 150, 50);

  // Tables for Details
  doc.autoTable({
    startY: 60,
    head: [['Detalles del Huésped', '']],
    body: [
      ['Nombre:', data.guestName],
      ['Email:', data.guestEmail],
    ],
    theme: 'plain',
    headStyles: { textColor: goldColor, fontStyle: 'bold', fontSize: 12 },
    columnStyles: { 0: { fontStyle: 'bold', width: 50 } },
  });

  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 10,
    head: [['Detalles de la Habitación', '']],
    body: [
      ['Habitación:', data.roomName],
      ['Check-In:', data.checkIn],
      ['Check-Out:', data.checkOut],
    ],
    theme: 'plain',
    headStyles: { textColor: goldColor, fontStyle: 'bold', fontSize: 12 },
    columnStyles: { 0: { fontStyle: 'bold', width: 50 } },
  });

  // Final Price Section
  const finalY = doc.lastAutoTable.finalY + 20;
  doc.setFillColor(...primaryColor);
  doc.rect(130, finalY - 10, 60, 20, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text('TOTAL PAGADO', 135, finalY);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...goldColor);
  doc.text(`$${data.totalPrice}`, 135, finalY + 7);

  // Footer
  doc.setTextColor(150, 150, 150);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.text('Gracias por elegir Hotel Vértice. La estancia de sus sueños comienza aquí.', 105, 280, { align: 'center' });

  doc.save(`Reserva_HotelVertice_${data.id.slice(0, 8)}.pdf`);
};
