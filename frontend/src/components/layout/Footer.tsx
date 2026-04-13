

const Footer: React.FC = () => {
    return (
        <footer className="w-full bg-primary pt-12 px-6 lg:px-10 pb-8 flex flex-col gap-8">
            <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-0">

                {/* Brand Section */}
                <div className="flex flex-col gap-4 max-w-sm">
                    <span className="text-white text-xl font-playfair font-medium">Hotel Vértice</span>
                    <p className="text-white text-sm opacity-80 leading-relaxed text-balance">
                        Experiencia de lujo premium en el corazón de la ciudad
                    </p>
                </div>

                {/* Contact info section */}
                <div className="flex flex-col gap-4">
                    <span className="text-white text-base font-semibold">Contacto</span>
                    <div className="flex flex-col gap-2 opacity-80">
                        <div className="flex items-center gap-2">
                            <span className="text-white text-sm">📍 Av. Principal 123, Ciudad</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-white text-sm">📞 +34 900 123 456</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-white text-sm">✉️ info@hotelvertice.com</span>
                        </div>
                    </div>
                </div>

                {/* Social Link mocks */}
                <div className="flex flex-col gap-4">
                    <span className="text-white text-base font-semibold">Síguenos</span>
                    <div className="flex items-center gap-4">
                        <div className="w-9 h-9 bg-gold rounded-xl p-2 cursor-pointer hover:bg-gold-light transition-colors"></div>
                        <div className="w-9 h-9 bg-gold rounded-xl p-2 cursor-pointer hover:bg-gold-light transition-colors"></div>
                        <div className="w-9 h-9 bg-gold rounded-xl p-2 cursor-pointer hover:bg-gold-light transition-colors"></div>
                    </div>
                </div>
            </div>

            <div className="pt-8 border-t border-white/10 opacity-60 w-full flex justify-center md:justify-start">
                <p className="text-white text-sm text-center">
                    © 2026 Hotel Vértice. Todos los derechos reservados.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
