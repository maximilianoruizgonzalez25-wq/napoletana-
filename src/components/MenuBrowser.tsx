import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Pizza,
  Salad as SaladIcon,
  Leaf,
  Flame,
  Soup,
  Beef,
  Smile,
  IceCream,
  Coffee,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Check,
  Sparkles,
  Info
} from 'lucide-react';
import { MENU_CATEGORIES, MENU_ITEMS, EXTRA_PIZZA_INGREDIENTS } from '../data/menu';
import { MenuItem, MenuCategoryID } from '../types';

interface MenuBrowserProps {
  onAddToReservation: (items: Array<{ menuItemId: string; name: string; quantity: number }>) => void;
  selectedPreOrderItems: Array<{ menuItemId: string; name: string; quantity: number }>;
  onUpdatePreOrderQuantity: (itemId: string, delta: number) => void;
  onClearPreOrder: () => void;
  onNavigateToBooking: () => void;
}

const IconMap: Record<string, React.ComponentType<any>> = {
  Pizza,
  Salad: SaladIcon,
  Leaf,
  Flame,
  Soup,
  Beef,
  Smile,
  IceCream,
  Coffee,
};

export default function MenuBrowser({
  onAddToReservation,
  selectedPreOrderItems,
  onUpdatePreOrderQuantity,
  onClearPreOrder,
  onNavigateToBooking,
}: MenuBrowserProps) {
  const [activeCategory, setActiveCategory] = useState<MenuCategoryID>('pizzas');
  const [searchQuery, setSearchQuery] = useState('');
  const [showExtrasDialog, setShowExtrasDialog] = useState(false);

  // Filter items by category and search query
  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      const matchesCategory = item.category === activeCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return searchQuery ? matchesSearch : matchesCategory;
    });
  }, [activeCategory, searchQuery]);

  // Total count of preordered items
  const totalItemsCount = useMemo(() => {
    return selectedPreOrderItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [selectedPreOrderItems]);

  // Aggregate total sum
  const totalPrice = useMemo(() => {
    return selectedPreOrderItems.reduce((acc, cartItem) => {
      const menuItem = MENU_ITEMS.find((mi) => mi.id === cartItem.menuItemId);
      const priceVal = menuItem ? parseFloat(menuItem.price) : 0;
      return acc + priceVal * cartItem.quantity;
    }, 0);
  }, [selectedPreOrderItems]);

  const handleAddItem = (item: MenuItem) => {
    onUpdatePreOrderQuantity(item.id, 1);
  };

  const handleRemoveItem = (itemId: string) => {
    onUpdatePreOrderQuantity(itemId, -1);
  };

  return (
    <section id="menu" className="py-24 bg-gray-50 text-gray-900 scroll-mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title and Intro */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex justify-center items-center space-x-1.5 mb-3">
            <span className="h-1 w-8 bg-[#008C45] rounded"></span>
            <span className="text-xs uppercase font-bold tracking-widest text-gray-400 font-mono">Tradición & Calidad</span>
            <span className="h-1 w-8 bg-[#CD212A] rounded"></span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            NUESTRO MENÚ TRADICIONAL
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600">
            Cada plato es un viaje a Nápoles. Utilizamos fermentación de masa madre por un mínimo de 48 horas e ingredientes 100% tradicionales. ¡Arma tu pre-orden aquí para incluirla en tu reserva!
          </p>
        </div>

        {/* Search Bar & Extra Dialog Trigger */}
        <div id="menu-search-and-controls" className="max-w-xl mx-auto mb-10 flex flex-col sm:flex-row gap-3 px-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              id="menu-search-input"
              type="text"
              placeholder="Buscar plato (ej. 'Margarita', 'trufa', 'burrata')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white pl-10 pr-4 py-3 rounded-full border border-gray-200 outline-none focus:border-[#008C45] focus:ring-1 focus:ring-[#008C45] shadow-sm transition-all text-sm text-gray-800"
            />
          </div>
          <button
            id="btn-ingredients-info"
            onClick={() => setShowExtrasDialog(true)}
            className="flex items-center justify-center space-x-2 bg-white hover:bg-gray-100 border border-gray-200 px-5 py-3 rounded-full text-xs font-semibold uppercase tracking-wider text-gray-700 shadow-sm transition-colors"
          >
            <Info size={15} className="text-[#008C45]" />
            <span>Ingredientes Extras</span>
          </button>
        </div>

        {/* Category Tabs */}
        {!searchQuery && (
          <div id="category-tabs-container" className="flex overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-200 gap-2 px-2 mask-gradient mb-12 justify-start lg:justify-center">
            {MENU_CATEGORIES.map((category) => {
              const IconComp = IconMap[category.icon] || Pizza;
              const isActive = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  id={`tab-category-${category.id}`}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center space-x-2.5 px-5 py-3 rounded-full whitespace-nowrap text-sm font-semibold transition-all duration-200 shadow-sm border ${
                    isActive
                      ? 'bg-gray-900 border-gray-900 text-white'
                      : 'bg-white border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  <IconComp size={16} className={isActive ? 'text-[#008C45]' : 'text-gray-400'} />
                  <span>{category.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Active Category Description Info banner */}
        {!searchQuery && (
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto mb-10 text-xs italic text-gray-500 font-mono px-4"
          >
            * {MENU_CATEGORIES.find((c) => c.id === activeCategory)?.description}
          </motion.div>
        )}

        {/* Search fallback */}
        {searchQuery && (
          <div className="text-sm font-mono text-gray-500 mb-8 max-w-xl mx-auto px-4">
            Mostrando resultados para "{searchQuery}" ({filteredItems.length} platos encontrados):
          </div>
        )}

        {/* Menu Items Grid */}
        {filteredItems.length > 0 ? (
          <div id="menu-items-grid" className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {filteredItems.map((item) => {
              const preOrderQty = selectedPreOrderItems.find((p) => p.menuItemId === item.id)?.quantity || 0;

              return (
                <motion.div
                  key={item.id}
                  id={`menu-item-card-${item.id}`}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-gray-100 hover:border-gray-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between relative group"
                >
                  {/* Popular Indicator */}
                  {item.isPopular && (
                    <span className="absolute -top-2.5 -right-2.5 bg-gradient-to-r from-amber-500 to-[#CD212A] text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full shadow flex items-center space-x-1 z-10 animate-pulse">
                      <Sparkles size={11} />
                      <span>Recomendado</span>
                    </span>
                  )}

                  {/* Dine-In Only / No Delivery Indicator */}
                  {item.noDelivery && (
                    <span className="absolute -top-2.5 left-6 bg-slate-900 border border-slate-800 text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full shadow-sm flex items-center space-x-1.5 z-10">
                      <span>🍽️ Sólo en Sala</span>
                    </span>
                  )}

                  <div>
                    {/* Item Name & Pricing */}
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="font-serif font-bold text-lg text-gray-900 group-hover:text-[#008C45] transition-colors">
                        {item.name}
                      </h3>
                      <span className="font-mono text-md font-extrabold text-[#CD212A] bg-red-50 px-2.5 py-1 rounded-lg">
                        {item.price}$
                      </span>
                    </div>

                    {/* Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {item.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className={`text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded font-mono ${
                              tag === 'D.O.P.'
                                ? 'bg-[#008C45]/10 text-[#008C45] border border-[#008C45]/20'
                                : tag === 'Postre Tradicional' || tag === 'Acento Criollo'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Description */}
                    {item.description && (
                      <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed mb-4">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* Pre-order item controller */}
                  <div className="border-t border-gray-50 pt-4 flex items-center justify-between mt-auto">
                    <span className="text-xs text-gray-400 font-mono">
                      {item.noDelivery ? (
                        <span className="text-red-700 bg-red-50 border border-red-100 px-2 py-0.5 rounded font-sans font-bold">🍽️ No Delivery</span>
                      ) : (
                        'Pre-agrega tu plato'
                      )}
                    </span>

                    {preOrderQty > 0 ? (
                      <div className="flex items-center space-x-2.5 bg-gray-900 text-white rounded-full p-1.5 px-3 shadow-md">
                        <button
                          id={`btn-reduce-${item.id}`}
                          onClick={() => handleRemoveItem(item.id)}
                          className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-800 text-white transition-colors"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="font-mono text-sm font-bold w-5 text-center">{preOrderQty}</span>
                        <button
                          id={`btn-increase-${item.id}`}
                          onClick={() => handleAddItem(item)}
                          className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-800 text-white transition-colors"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    ) : (
                      <button
                        id={`btn-add-${item.id}`}
                        onClick={() => handleAddItem(item)}
                        className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider bg-white hover:bg-[#008C45] hover:text-white text-[#008C45] border border-[#008C45]/20 px-4 py-2.5 rounded-full transition-all duration-200 active:scale-95 shadow-sm"
                      >
                        <Plus size={13} />
                        <span>Pre-ordenar</span>
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div id="no-menu-results" className="text-center py-16 bg-white border border-dashed rounded-3xl max-w-xl mx-auto px-6 mb-16">
            <p className="text-lg text-gray-600 font-semibold mb-2">No encontramos platos que coincidan</p>
            <p className="text-sm text-gray-400 mb-4">Prueba buscando ingredientes sencillos o términos como 'Margarita' o 'Carbonara'.</p>
            <button
              id="clear-search-btn"
              onClick={() => setSearchQuery('')}
              className="bg-gray-900 text-white px-5 py-2.5 rounded-full text-xs uppercase font-bold tracking-widest shadow"
            >
              Mostrar todo el menú
            </button>
          </div>
        )}

        {/* Global Floating Order Basket/Drawer Indicator */}
        <AnimatePresence>
          {totalItemsCount > 0 && (
            <motion.div
              id="sticky-checkout-bar"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="fixed bottom-6 left-4 right-4 md:left-auto md:right-10 md:w-96 z-40 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-gray-950 via-gray-900 to-[#CD212A] text-white p-3.5 px-5 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="bg-white/20 p-2 rounded-lg relative">
                    <ShoppingBag size={18} />
                    <span className="absolute -top-1.5 -right-1.5 bg-[#008C45] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center font-mono">
                      {totalItemsCount}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Tu Pre-orden</h4>
                    <p className="text-[10px] text-gray-300 font-mono">Sincronizado con Reservas</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-300 uppercase tracking-widest">Total Estimado</p>
                  <p className="font-mono text-base font-extrabold text-white">{totalPrice.toFixed(0)}$</p>
                </div>
              </div>

              <div className="p-4 max-h-48 overflow-y-auto bg-slate-50 border-b border-gray-100 divide-y divide-gray-100">
                {selectedPreOrderItems.map((cartItem) => {
                  const itemInfo = MENU_ITEMS.find((mi) => mi.id === cartItem.menuItemId);
                  if (!itemInfo) return null;
                  return (
                    <div key={cartItem.menuItemId} className="flex items-center justify-between py-2 text-xs">
                      <div className="flex-1 pr-4">
                        <p className="font-bold text-gray-800">{itemInfo.name}</p>
                        <p className="text-[10px] text-gray-400 font-mono">{itemInfo.price}$ c/u</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onUpdatePreOrderQuantity(cartItem.menuItemId, -1)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <Minus size={12} className="text-gray-500" />
                        </button>
                        <span className="font-mono font-bold text-gray-700 min-w-[12px] text-center">{cartItem.quantity}</span>
                        <button
                          onClick={() => onUpdatePreOrderQuantity(cartItem.menuItemId, 1)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <Plus size={12} className="text-gray-500" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 bg-white flex space-x-2.5">
                <button
                  id="btn-basket-clear"
                  onClick={onClearPreOrder}
                  className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                  title="Vaciar Pre-orden"
                >
                  <Trash2 size={16} />
                </button>
                <button
                  id="btn-basket-reserve"
                  onClick={onNavigateToBooking}
                  className="flex-1 bg-[#CD212A] hover:bg-[#b01c24] text-white flex items-center justify-center space-x-2 text-xs font-bold uppercase tracking-wider py-3 rounded-xl shadow-lg transition-transform active:scale-95"
                >
                  <span>Reservar Mesa Ahora</span>
                  <Check size={14} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Extras & Ingredients Modal Dialog */}
        <AnimatePresence>
          {showExtrasDialog && (
            <div id="extras-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div
                id="extras-modal-content"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-xl bg-white rounded-2xl overflow-hidden shadow-2xl border border-gray-100 max-h-[85vh] flex flex-col"
              >
                {/* Modal Header */}
                <div className="bg-gray-900 text-white p-5 px-6 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Pizza size={20} className="text-[#008C45]" />
                    <h3 className="font-serif font-bold text-lg">Ingredientes Extras Disponibles</h3>
                  </div>
                  <button
                    id="close-extras-dialog"
                    onClick={() => setShowExtrasDialog(false)}
                    className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                  >
                    <Trash2 size={18} className="rotate-45" />
                  </button>
                </div>

                {/* Modal Scroll Content */}
                <div className="p-6 overflow-y-auto space-y-5 text-sm text-gray-700">
                  <p className="text-xs text-gray-500 leading-relaxed font-sans uppercase tracking-[0.05em]">
                    * Puedes solicitar cualquiera de estos ingredientes adicionales para personalizar tu pizza italiana D.O.P. al momento de confirmar tu reserva o tu visita.
                  </p>

                  <div className="divide-y divide-gray-100">
                    {EXTRA_PIZZA_INGREDIENTS.map((extra, index) => (
                      <div key={index} className="py-3 flex items-center justify-between gap-4">
                        <div className="text-left font-sans text-sm text-gray-700 leading-normal">{extra.name}</div>
                        <span className="font-mono text-xs font-extrabold text-[#CD212A] bg-red-50 px-2.5 py-1 rounded">
                          +{extra.price}$
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-gray-100 text-[11px] text-gray-400 leading-relaxed font-sans">
                    <strong>¿Qué significa D.O.P.?</strong> Denominación de Origen Protegida. Garantiza que la salsa se elabora exclusivamente con tomates San Marzano genuinos sembrados al pie del monte Vesubio.
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                  <button
                    id="close-extras-btn"
                    onClick={() => setShowExtrasDialog(false)}
                    className="bg-gray-900 text-white hover:bg-gray-800 text-xs uppercase tracking-widest font-bold py-3 px-6 rounded-xl shadow transition-colors"
                  >
                    Entendido
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
