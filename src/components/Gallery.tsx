import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ZoomIn, X, ChevronLeft, ChevronRight, Compass } from 'lucide-react';

import pizzaImg from '../assets/images/pizza_margherita_1781888422013.jpg';
import pastaImg from '../assets/images/pasta_carbonara_1781888441176.jpg';
import dessertImg from '../assets/images/tiramisu_dessert_1781888458323.jpg';

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
}

export default function Gallery() {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const galleryItems: GalleryItem[] = [
    {
      id: 'gal-pizza',
      title: 'Pizza Margherita D.O.P.',
      description: 'Nuestra icónica pizza con salsa de tomate San Marzano importado, mozzarella de búfala fresca derretida, aceite extra virgen y hojas de albahaca recién cortadas de nuestro huerto.',
      imageUrl: pizzaImg,
      category: 'Pizzas al Horno',
    },
    {
      id: 'gal-pasta',
      title: 'Linguine a la Carbonara Legítimo',
      description: 'Una joya romana elaborada con yemas de huevo seleccionadas, abundante queso de oveja Pecorino Romano, guanciale crujiente y pimienta negra molida gruesa.',
      imageUrl: pastaImg,
      category: 'Pasta Artesanal',
    },
    {
      id: 'gal-dessert',
      title: 'Tiramisú de la Casa',
      description: 'Crema esponjosa a base de queso mascarpone importado, capas de plantillas sumergidas en espresso artesanal y una generosa lluvia de cacao venezolano amargo.',
      imageUrl: dessertImg,
      category: 'Dolce del Cielo',
    },
  ];

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIdx !== null) {
      setSelectedIdx((selectedIdx + 1) % galleryItems.length);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIdx !== null) {
      setSelectedIdx((selectedIdx - 1 + galleryItems.length) % galleryItems.length);
    }
  };

  return (
    <section id="gallery" className="py-24 bg-white text-gray-900 scroll-mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Block */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex justify-center items-center space-x-1.5 mb-3">
            <span className="h-1 w-8 bg-[#008C45] rounded"></span>
            <span className="text-xs uppercase font-bold tracking-widest text-[#008C45] font-mono">El Arte de Servir</span>
            <span className="h-1 w-8 bg-[#CD212A] rounded"></span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            NUESTRO ARTE CULINARIO
          </h2>
          <p className="mt-4 text-sm sm:text-base text-gray-600">
            Una mirada de cerca a las preparaciones tradicionales que salen de nuestras cocinas todos los días. Auténticos colores y texturas de Italia.
          </p>
        </div>

        {/* Gallery Grid (Bento style card layouts) */}
        <div id="gallery-cards-grid" className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {galleryItems.map((item, idx) => (
            <motion.div
              key={item.id}
              id={`gallery-item-${item.id}`}
              className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shadow-sm group hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedIdx(idx)}
              whileHover={{ y: -4 }}
            >
              {/* Image Container with Zoom effect */}
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-200">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                
                {/* Image Overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5 pt-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between text-white">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest font-mono text-emerald-400 font-bold bg-black/40 px-2 py-0.5 rounded-full mb-1 inline-block">
                      {item.category}
                    </span>
                    <h3 className="font-serif font-bold text-base leading-tight">{item.title}</h3>
                  </div>
                  <div className="bg-white/20 hover:bg-white/30 backdrop-blur-md p-2 rounded-full text-white">
                    <ZoomIn size={16} />
                  </div>
                </div>
              </div>

              {/* Text Card details */}
              <div className="p-5 text-left bg-white">
                <span className="text-[10px] uppercase tracking-widest font-semibold font-mono text-[#008C45] mb-1 inline-block">
                  {item.category}
                </span>
                <h3 className="font-serif font-extrabold text-lg text-gray-900 group-hover:text-[#CD212A] transition-colors mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-600 font-sans leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Big Quote / Slogan Separator */}
        <div id="gallery-quote" className="mt-20 py-12 px-6 rounded-3xl bg-gradient-to-br from-[#008C45]/5 via-white to-[#CD212A]/5 border border-gray-100 max-w-4xl mx-auto text-center">
          <p className="font-serif italic text-xl sm:text-2xl text-gray-800 leading-relaxed max-w-2xl mx-auto">
            "Mangiare per vivere e non vivere per mangiare."
          </p>
          <div className="flex justify-center items-center space-x-1.5 mt-4">
            <div className="w-4 h-0.5 bg-[#008C45]"></div>
            <p className="text-xs font-mono uppercase tracking-[0.2em] font-bold text-gray-400">
              Buon Appetito!
            </p>
            <div className="w-4 h-0.5 bg-[#CD212A]"></div>
          </div>
        </div>

        {/* Lightbox / Slideshow Overlay */}
        <AnimatePresence>
          {selectedIdx !== null && (
            <div
              id="lightbox-backdrop"
              onClick={() => setSelectedIdx(null)}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md"
            >
              {/* Close Button */}
              <button
                id="lightbox-close"
                onClick={() => setSelectedIdx(null)}
                className="absolute top-6 right-6 p-2 rounded-full text-white/75 hover:text-white hover:bg-white/10 transition-colors z-50"
              >
                <X size={24} />
              </button>

              {/* Prev Button */}
              <button
                id="lightbox-prev"
                onClick={handlePrev}
                className="absolute left-4 p-2 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors z-50"
              >
                <ChevronLeft size={36} />
              </button>

              {/* Next Button */}
              <button
                id="lightbox-next"
                onClick={handleNext}
                className="absolute right-4 p-2 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors z-50"
              >
                <ChevronRight size={36} />
              </button>

              {/* Slider Content */}
              <motion.div
                id="lightbox-content"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="max-w-4xl w-full bg-transparent flex flex-col items-center"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="aspect-[4/3] w-full max-h-[60vh] rounded-2xl overflow-hidden shadow-2xl relative bg-black">
                  <img
                    src={galleryItems[selectedIdx].imageUrl}
                    alt={galleryItems[selectedIdx].title}
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Subtle watermarked logo inside slides */}
                  <div className="absolute top-4 left-4 bg-black/40 text-white/70 text-[9px] uppercase tracking-[0.2em] px-2 py-1 rounded font-mono">
                    Napoletana VE
                  </div>
                </div>

                {/* Text explanation under image */}
                <div className="mt-6 text-center text-white max-w-2xl px-4">
                  <span className="text-xs uppercase tracking-[0.2em] font-mono font-bold text-emerald-400 mb-1.5 inline-block">
                    {galleryItems[selectedIdx].category}
                  </span>
                  <h3 className="font-serif text-2xl font-extrabold mb-3">
                    {galleryItems[selectedIdx].title}
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed font-sans">
                    {galleryItems[selectedIdx].description}
                  </p>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
