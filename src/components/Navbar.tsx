import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Phone, Instagram, Utensils, Calendar } from 'lucide-react';

interface NavbarProps {
  onNavigate: (section: string) => void;
  activeSection: string;
}

export default function Navbar({ onNavigate, activeSection }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'hero', label: 'Inicio' },
    { id: 'menu', label: 'Nuestro Menú' },
    { id: 'gallery', label: 'Galería' },
    { id: 'reservations', label: 'Pedidos y Reservas' },
  ];

  const handleItemClick = (sectionId: string) => {
    onNavigate(sectionId);
    setIsOpen(false);
  };

  return (
    <nav
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md py-3 border-b border-gray-100'
          : 'bg-gradient-to-b from-black/60 to-transparent py-5 text-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div
            id="nav-logo"
            onClick={() => handleItemClick('hero')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            {/* Styled Italian Flag Stripes */}
            <div className="flex flex-col space-y-0.5 justify-center mr-1 h-8">
              <div className="flex space-x-0.5 h-6 w-5">
                <div className="w-1.5 h-full bg-[#008C45] rounded-l-sm"></div>
                <div className="w-1.5 h-full bg-slate-100"></div>
                <div className="w-1.5 h-full bg-[#CD212A] rounded-r-sm"></div>
              </div>
            </div>
            <div>
              <span
                className={`font-sans tracking-widest text-xl font-extrabold uppercase transition-colors ${
                  scrolled ? 'text-gray-900' : 'text-white'
                }`}
              >
                NAPOLETANA
              </span>
              <p className="text-[9px] tracking-[0.3em] uppercase opacity-80 font-semibold -mt-1.5">
                Trattoria & Pizzería
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div id="desktop-nav" className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-6">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  id={`nav-btn-${item.id}`}
                  onClick={() => handleItemClick(item.id)}
                  className={`relative font-medium text-sm tracking-wide uppercase transition-colors py-1 ${
                    activeSection === item.id
                      ? scrolled
                        ? 'text-[#008C45]'
                        : 'text-white font-semibold'
                      : scrolled
                      ? 'text-gray-600 hover:text-gray-900'
                      : 'text-gray-200 hover:text-white'
                  }`}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#CD212A]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Quick Contact & Social */}
            <div className="flex items-center space-x-4 border-l pl-6 border-gray-300/40">
              <a
                href="https://instagram.com/napoletana.ve"
                target="_blank"
                rel="noreferrer"
                id="navbar-ig-link"
                className={`transition-colors p-1.5 rounded-full ${
                  scrolled
                    ? 'text-gray-600 hover:bg-gray-100 hover:text-pink-600'
                    : 'text-gray-200 hover:bg-white/10 hover:text-pink-400'
                }`}
                title="Siguenos en Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://wa.me/584125098158"
                target="_blank"
                rel="noreferrer"
                id="navbar-wa-link"
                className={`transition-colors p-1.5 rounded-full ${
                  scrolled
                    ? 'text-gray-600 hover:bg-gray-100 hover:text-green-600'
                    : 'text-gray-200 hover:bg-white/10 hover:text-green-400'
                }`}
                title="Llámanos o escríbenos"
              >
                <Phone size={18} />
              </a>
              <button
                id="navbar-reserve-cta"
                onClick={() => handleItemClick('reservations')}
                className={`flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider px-4 py-2.5 rounded-full transition-transform active:scale-95 ${
                  scrolled
                    ? 'bg-[#CD212A] text-white hover:bg-[#b01c24]'
                    : 'bg-white text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span>🍕</span>
                <span>Pedir o Reservar</span>
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-3">
            <button
              id="mobile-phone-link"
              onClick={() => handleItemClick('reservations')}
              className={`p-2 rounded-full ${scrolled ? 'text-gray-700' : 'text-white bg-black/25'}`}
            >
              <Calendar size={18} />
            </button>
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-md ${
                scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
              }`}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu-container"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-white border-b border-gray-100 overflow-hidden shadow-lg"
          >
            <div className="px-4 pt-2 pb-6 space-y-4 text-gray-800">
              <div className="flex flex-col space-y-2 mt-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    id={`mobile-nav-${item.id}`}
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-base font-semibold tracking-wide uppercase transition-colors ${
                      activeSection === item.id
                        ? 'bg-[#008C45]/10 text-[#008C45]'
                        : 'hover:bg-gray-50 text-gray-700 hover:text-gray-950'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 flex flex-col space-y-3">
                <a
                  href="https://wa.me/584125098158"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-3 text-sm text-gray-700 hover:text-[#008C45] px-3"
                >
                  <Phone size={18} className="text-[#008C45]" />
                  <span className="font-medium">+58 412 509 8158</span>
                </a>
                <a
                  href="https://instagram.com/napoletana.ve"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-3 text-sm text-gray-700 hover:text-pink-600 px-3"
                >
                  <Instagram size={18} className="text-pink-600" />
                  <span className="font-medium">@napoletana.ve</span>
                </a>

                <div className="px-3 pt-2">
                  <button
                    id="mobile-reserve-cta-btn"
                    onClick={() => handleItemClick('reservations')}
                    className="w-full text-center bg-[#CD212A] text-white uppercase text-sm tracking-wider font-bold py-3 px-4 rounded-xl shadow-md flex items-center justify-center space-x-2"
                  >
                    <span>🛵</span>
                    <span>Pedir o Reservar</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
