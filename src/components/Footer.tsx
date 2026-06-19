import { Heart, Instagram, Phone, MapPin, Clock } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="app-footer" className="bg-gray-950 text-white pt-16 pb-8 border-t border-gray-900 relative">
      
      {/* Upper Subtle flag horizontal band */}
      <div className="absolute top-0 left-0 right-0 h-1 flex">
        <div className="flex-1 bg-[#008C45]"></div>
        <div className="w-24 bg-white"></div>
        <div className="flex-1 bg-[#CD212A]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Logo & Slogan Column */}
          <div className="space-y-4 md:col-span-1 text-left">
            <div>
              <span className="font-sans tracking-widest text-xl font-extrabold uppercase text-white">
                NAPOLETANA
              </span>
              <p className="text-[9px] tracking-[0.3em] uppercase text-gray-400 font-semibold -mt-1">
                Trattoria & Pizzería
              </p>
            </div>
            
            <p className="text-xs text-gray-450 leading-relaxed font-serif italic pr-4">
              "Mangiare per vivere e non vivere per mangiare."
              <br />
              Nuestra pasión por el sabor tradicional italiano se refleja en cada pizza de masa madre y pasta fresca hecha en casa.
            </p>
          </div>

          {/* Location Details Column */}
          <div className="space-y-4 text-left">
            <h4 className="text-xs uppercase tracking-widest font-bold text-emerald-400 font-mono">Ubicación</h4>
            <div className="space-y-2.5 text-xs text-gray-400">
              <div className="flex items-start space-x-2.5">
                <MapPin size={15} className="text-[#008C45] shrink-0 mt-0.5" />
                <p>
                  CC Alta Vista II, Local PB-10, <br />
                  Ciudad Guayana 8050, Bolívar, <br />
                  Venezuela.
                </p>
              </div>
            </div>
          </div>

          {/* Schedule Column */}
          <div className="space-y-4 text-left">
            <h4 className="text-xs uppercase tracking-widest font-bold text-gray-100 font-mono">Horario de Sala</h4>
            <div className="space-y-2.5 text-xs text-gray-400">
              <div className="flex items-start space-x-2.5">
                <Clock size={15} className="text-white shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-350">Martes a Domingos:</p>
                  <p className="font-mono mt-0.5">12:00 PM - 10:00 PM</p>
                  <p className="text-[10px] text-gray-500 mt-1">* Lunes Cerrado por descanso del personal.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact / Social Column */}
          <div className="space-y-4 text-left">
            <h4 className="text-xs uppercase tracking-widest font-bold text-[#CD212A] font-mono">Contacto Directo</h4>
            <div className="space-y-2.5 text-xs text-gray-400">
              <a
                href="https://wa.me/584125098158"
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-2.5 hover:text-green-400 transition-colors"
              >
                <Phone size={15} className="text-green-500 shrink-0" />
                <span className="font-mono text-sm font-semibold">+58 412 509 8158</span>
              </a>

              <a
                href="https://instagram.com/napoletana.ve"
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-2.5 hover:text-pink-400 transition-colors"
              >
                <Instagram size={15} className="text-pink-500 shrink-0" />
                <span className="font-mono">@napoletana.ve</span>
              </a>
            </div>
          </div>

        </div>

        {/* Lower copyright bar */}
        <div className="pt-8 border-t border-gray-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div className="text-center sm:text-left">
            <p>&copy; {currentYear} Napoletana Trattoria & Pizzería. Todos los derechos reservados.</p>
            <p className="text-[10px] text-gray-650 mt-0.5 font-sans">
              Platos tradicionales con denominación de origen protegida (D.O.P.) San Marzano.
            </p>
          </div>

          <div className="flex items-center space-x-1 justify-center sm:justify-end">
            <span>Hecho con</span>
            <Heart size={11} className="text-[#CD212A] fill-[#CD212A]" />
            <span>para los amantes de la pizza artesanal.</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
