import { motion } from 'motion/react';
import { Calendar, Compass, ArrowDown, MapPin, Clock } from 'lucide-react';
import heroImage from '../assets/images/napoletana_hero_1781888406226.jpg';

interface HeroProps {
  onExploreMenu: () => void;
  onBookTable: () => void;
}

export default function Hero({ onExploreMenu, onBookTable }: HeroProps) {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden pt-16"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Napoletana Trattoria & Pizzería"
          className="w-full h-full object-cover object-center opacity-65 scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-black/70"></div>
      </div>

      {/* Decorative vertical stripes resembling Italian Flag on side (Very subtle) */}
      <div className="absolute top-0 right-0 bottom-0 w-2 flex flex-col z-10 opacity-70">
        <div className="flex-1 bg-[#008C45]"></div>
        <div className="flex-1 bg-white"></div>
        <div className="flex-1 bg-[#CD212A]"></div>
      </div>

      {/* Hero Content */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white z-20 flex flex-col justify-center min-h-[80vh]">
        
        {/* Badge */}
        <motion.div
          id="hero-badge"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full mb-6 mx-auto"
        >
          <span className="w-2 h-2 rounded-full bg-[#008C45] animate-pulse"></span>
          <span className="text-xs uppercase font-semibold tracking-widest text-[#008C45]">Trattoria & Pizzería Tradicional</span>
          <span className="w-2 h-2 rounded-full bg-[#CD212A] animate-pulse"></span>
        </motion.div>

        {/* Headings */}
        <motion.h1
          id="hero-title"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-serif text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-tight uppercase"
        >
          Sabor <span className="text-[#008C45]">Auténtico</span>, <br />
          Receta <span className="text-white relative inline-block">
            Italiana
            <span className="absolute -bottom-1 left-0 right-0 h-1.5 bg-[#CD212A] rounded-full"></span>
          </span>
        </motion.h1>

        <motion.p
          id="hero-description"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-6 text-lg sm:text-xl text-gray-200 max-w-3xl mx-auto font-sans leading-relaxed"
        >
          Ingredientes importados con la denominación de origen protegida <span className="text-emerald-400 font-semibold font-mono text-sm border border-emerald-400/30 px-1.5 py-0.5 rounded">D.O.P.</span>, masa madre de fermentación lenta y pastas frescas hechas a mano con amor en Venezuela.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          id="hero-actions"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
        >
          <button
            id="hero-cta-menu"
            onClick={onExploreMenu}
            className="w-full sm:w-auto flex items-center justify-center space-x-3 bg-white text-gray-950 font-bold uppercase tracking-wider text-sm py-4 px-8 rounded-full shadow-lg hover:bg-gray-100 transition-colors active:scale-95 group"
          >
            <Compass size={18} className="group-hover:rotate-45 transition-transform duration-300" />
            <span>Explorar El Menú</span>
          </button>
          
          <button
            id="hero-cta-reserve"
            onClick={onBookTable}
            className="w-full sm:w-auto flex items-center justify-center space-x-3 bg-[#CD212A] text-white font-bold uppercase tracking-wider text-sm py-4 px-8 rounded-full shadow-lg hover:bg-[#b01c24] transition-colors active:scale-95 border border-[#CD212A]"
          >
            <span>🛵</span>
            <span>Pedir Delivery o Reservar</span>
          </button>
        </motion.div>

        {/* Highlight footer bar in Hero */}
        <motion.div
          id="hero-footer-info"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-16 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-8 border-t border-white/10 text-gray-300"
        >
          <div className="flex items-center space-x-3 justify-center sm:justify-start">
            <div className="p-2 bg-white/5 rounded-lg border border-white/10">
              <MapPin size={18} className="text-[#008C45]" />
            </div>
            <div className="text-left">
              <p className="text-xs text-gray-400 uppercase tracking-widest font-mono font-medium">Ubicación</p>
              <p className="text-sm font-semibold">Ciudad Guayana, Bolívar, VE</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 justify-center">
            <div className="p-2 bg-white/5 rounded-lg border border-white/10">
              <Clock size={18} className="text-white" />
            </div>
            <div className="text-left">
              <p className="text-xs text-gray-400 uppercase tracking-widest font-mono font-medium">Horario de Atención</p>
              <p className="text-sm font-semibold">Lun - Sáb: 12:00 PM - 10:00 PM</p>
              <p className="text-sm font-semibold">Dom: 12:00 PM - 8:00 PM</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 justify-center sm:justify-end col-span-1 sm:col-span-2 md:col-span-1">
            <div className="p-2 bg-white/5 rounded-lg border border-white/10">
              <span className="text-xs font-bold text-[#CD212A] font-mono">D.O.P.</span>
            </div>
            <div className="text-left">
              <p className="text-xs text-gray-400 uppercase tracking-widest font-mono font-medium">Autenticidad</p>
              <p className="text-sm font-semibold">Tomate San Marzano Certificado</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Floating Arrow down */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white animate-bounce pointer-events-none hidden sm:block opacity-65">
        <ArrowDown size={24} />
      </div>
    </section>
  );
}
