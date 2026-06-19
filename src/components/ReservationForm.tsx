import React, { useState, useMemo } from 'react';
import { Calendar, Clock, Users, FileText, CheckCircle2, MessageSquare, Sparkles, MapPin, ShoppingBag } from 'lucide-react';
import { Reservation } from '../types';
import { MENU_ITEMS } from '../data/menu';

interface ReservationFormProps {
  onAddReservation: (res: Reservation) => void;
  selectedPreOrderItems: Array<{ menuItemId: string; name: string; quantity: number }>;
  onClearPreOrder: () => void;
  onSendWhatsApp: (res: Reservation) => void;
}

export const DELIVERY_ZONES = [
  { name: 'Alta Vista (Norte/Sur)', cost: 1.5 },
  { name: 'Unare (I, II, III)', cost: 2.5 },
  { name: 'Chilemex / Los Olivos / Villa Asia', cost: 2.0 },
  { name: 'Villa Granada / Campo A', cost: 2.0 },
  { name: 'San Félix (Centro / El Roble)', cost: 4.0 },
  { name: 'Castillito / Mendoza', cost: 2.5 }
];

export default function ReservationForm({
  onAddReservation,
  selectedPreOrderItems,
  onClearPreOrder,
  onSendWhatsApp,
}: ReservationFormProps) {
  const [orderType, setOrderType] = useState<'dine_in' | 'delivery' | 'pickup'>('dine_in');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('19:30'); // Default to peak dinner time
  const [guests, setGuests] = useState<number>(2);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [selectedZone, setSelectedZone] = useState(DELIVERY_ZONES[0].name);
  const [specialRequests, setSpecialRequests] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [createdReservation, setCreatedReservation] = useState<Reservation | null>(null);

  // Suggested time slots for Napoletana
  const availableTimes = [
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'
  ];

  // Pre-ordered total price
  const preOrderTotal = useMemo(() => {
    return selectedPreOrderItems.reduce((acc, cartItem) => {
      const dbItem = MENU_ITEMS.find((mi) => mi.id === cartItem.menuItemId);
      const price = dbItem ? parseFloat(dbItem.price) : 0;
      return acc + price * cartItem.quantity;
    }, 0);
  }, [selectedPreOrderItems]);

  const deliveryCost = useMemo(() => {
    if (orderType !== 'delivery') return 0;
    return DELIVERY_ZONES.find((z) => z.name === selectedZone)?.cost ?? 0;
  }, [orderType, selectedZone]);

  const grandTotal = useMemo(() => {
    return preOrderTotal + deliveryCost;
  }, [preOrderTotal, deliveryCost]);

  const nonDeliveryPreOrderItems = useMemo(() => {
    return selectedPreOrderItems.filter((cartItem) => {
      const dbItem = MENU_ITEMS.find((mi) => mi.id === cartItem.menuItemId);
      return dbItem?.noDelivery;
    });
  }, [selectedPreOrderItems]);

  const hasNonDeliveryItems = nonDeliveryPreOrderItems.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !date || !time) return;

    if (orderType === 'delivery' || orderType === 'pickup') {
      if (selectedPreOrderItems.length === 0) {
        alert('Por favor selecciona platos de nuestro menú antes de completar tu pedido.');
        return;
      }
      if (hasNonDeliveryItems) {
        const itemNames = nonDeliveryPreOrderItems.map(i => i.name).join(', ');
        alert(`No es posible pedir los siguientes platos por delivery o retiro: ${itemNames}. Son exclusivos para el salón. Por favor, elimínalos o selecciona 'Reserva' en sala.`);
        return;
      }
    }

    const newRes: Reservation = {
      id: `res-${Date.now()}`,
      type: orderType,
      name,
      phone,
      date,
      time,
      guests: orderType === 'dine_in' ? guests : undefined,
      deliveryAddress: orderType === 'delivery' ? deliveryAddress : undefined,
      deliveryZone: orderType === 'delivery' ? selectedZone : undefined,
      deliveryCost: orderType === 'delivery' ? deliveryCost : undefined,
      specialRequests: specialRequests.trim() || undefined,
      preOrderedItems: selectedPreOrderItems.length > 0 ? [...selectedPreOrderItems] : undefined,
      createdAt: new Date().toISOString(),
      status: 'confirmed',
    };

    onAddReservation(newRes);
    setCreatedReservation(newRes);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setName('');
    setPhone('');
    setDate('');
    setTime('19:30');
    setGuests(2);
    setDeliveryAddress('');
    setSelectedZone(DELIVERY_ZONES[0].name);
    setSpecialRequests('');
    setIsSubmitted(false);
    setCreatedReservation(null);
    onClearPreOrder();
  };

  // Set minimum date to today (2026-06-19)
  const todayString = '2026-06-19';

  return (
    <section id="reservations" className="py-24 bg-gray-50 text-gray-900 scroll-mt-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Reservation Title Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="flex justify-center items-center space-x-1.5 mb-3">
            <span className="h-1 w-8 bg-[#008C45] rounded"></span>
            <span className="text-xs uppercase font-bold tracking-widest text-[#CD212A] font-mono">Pide o Reserva</span>
            <span className="h-1 w-8 bg-[#008C45] rounded"></span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            RESERVAS Y DELIVERY
          </h2>
          <p className="mt-3 text-base text-gray-600">
            Asegura tu mesa o pide delivery / retiro en Ciudad Guayana. Rápido, auténtico y con confirmación directa a través de WhatsApp.
          </p>
        </div>

        {/* Action Type Tabs Selector */}
        {!isSubmitted && (
          <div className="flex justify-center mb-8 p-1.5 bg-gray-200/60 rounded-2xl max-w-md mx-auto">
            <button
              onClick={() => setOrderType('dine_in')}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
                orderType === 'dine_in'
                  ? 'bg-white text-gray-900 shadow-md scale-102 font-extrabold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>🍽️</span>
              <span>Reserva</span>
            </button>
            <button
              onClick={() => setOrderType('delivery')}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
                orderType === 'delivery'
                  ? 'bg-white text-gray-900 shadow-md scale-102 font-extrabold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>🛵</span>
              <span>Delivery</span>
            </button>
            <button
              onClick={() => setOrderType('pickup')}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
                orderType === 'pickup'
                  ? 'bg-white text-gray-900 shadow-md scale-102 font-extrabold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>🛍️</span>
              <span>Retiro</span>
            </button>
          </div>
        )}

        {/* Unified Booking wizard Card */}
        <div id="booking-wizard-card" className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          {!isSubmitted ? (
            <div className="grid grid-cols-1 md:grid-cols-12">
              
              {/* Information Left Rail */}
              <div className="md:col-span-5 bg-gray-950 text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
                {/* Italian Flag subtle stripe accent */}
                <div className="absolute top-0 left-0 w-full h-1.5 flex">
                  <div className="flex-1 bg-[#008C45]"></div>
                  <div className="flex-1 bg-white"></div>
                  <div className="flex-1 bg-[#CD212A]"></div>
                </div>

                <div className="space-y-8 z-10 relative">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-[#008C45] font-extrabold bg-white/10 px-2.5 py-1 rounded-md">
                      Napoletana Ciudad Guayana
                    </span>
                    <h3 className="font-serif text-2xl font-bold mt-4 leading-tight">
                      {orderType === 'dine_in' ? 'Tu Mesa en Sala' : orderType === 'delivery' ? 'Al Horno en tu Mesa' : 'Listo para Llevar'}
                    </h3>
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed font-sans">
                    {orderType === 'dine_in' && 'Nuestras reservas en sala se registran automáticamente de forma local. Al finalizar podras mandar una confirmación del menú por WhatsApp.'}
                    {orderType === 'delivery' && 'Disfruta de la mejor pizzería napolitana artesanal directo en tu puerta. Tiempo estimado de entrega: 30 - 50 minutos.'}
                    {orderType === 'pickup' && 'Realiza tu pedido y retíralo directamente en nuestro local en el CC Alta Vista II. ¡Listo para llevar sin esperas!'}
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-3.5 text-xs">
                      <Clock size={16} className="text-[#008C45] mt-0.5 animate-pulse" />
                      <div>
                        <p className="font-bold text-gray-200">Horarios Disponibles</p>
                        <p className="text-gray-400 font-mono mt-0.5">Lun - Sáb: 12:00 PM - 10:00 PM</p>
                        <p className="text-gray-400 font-mono">Dom: 12:00 PM - 8:00 PM</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3.5 text-xs">
                      <MapPin size={16} className="text-[#CD212A] mt-0.5" />
                      <div>
                        <p className="font-bold text-gray-200">Zona de Cobertura</p>
                        <p className="text-gray-400 mt-0.5">Delivery rápido en toda Puerto Ordaz y zonas de San Félix.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pre-ordered items summary inside the form sidebar */}
                <div className="mt-12 pt-6 border-t border-white/10 z-10 relative">
                  <div className="flex items-center space-x-2 text-[#CD212A]">
                    <Sparkles size={14} className="animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider font-mono">
                      {orderType === 'dine_in' ? 'Platos Pre-Seleccionados' : 'Tu Pedido Actual'}
                    </span>
                  </div>

                  {selectedPreOrderItems.length > 0 ? (
                    <div className="mt-3 space-y-2.5">
                      <div className="max-h-36 overflow-y-auto space-y-2 pr-1.5 scrollbar-thin">
                        {selectedPreOrderItems.map((cartItem) => {
                          const itemInfo = MENU_ITEMS.find((mi) => mi.id === cartItem.menuItemId);
                          const isNoDeliveryItem = itemInfo?.noDelivery;
                          return (
                            <div key={cartItem.menuItemId} className="flex flex-col space-y-0.5 border-b border-white/5 pb-1 last:border-0 last:pb-0">
                              <div className="flex justify-between items-center text-[11px] text-gray-300">
                                <span className="truncate max-w-[150px] font-medium flex items-center gap-1.5">
                                  {cartItem.quantity}x {itemInfo?.name}
                                  {isNoDeliveryItem && orderType !== 'dine_in' && (
                                    <span className="text-red-500 font-bold" title="Exclusivo de Sala (Dine-in Only)">⚠️</span>
                                  )}
                                </span>
                                <span className="font-mono text-gray-400">{(parseFloat(itemInfo?.price || '0') * cartItem.quantity).toFixed(0)}$</span>
                              </div>
                              {isNoDeliveryItem && orderType !== 'dine_in' && (
                                <p className="text-[9px] text-red-400 font-sans tracking-wide leading-none select-none">⚠️ Exclusivo para Consumo en Sala</p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      
                      <div className="pt-2 border-t border-white/10 space-y-1 text-xs">
                        <div className="flex justify-between text-gray-400 text-[11px]">
                          <span>Subtotal platos:</span>
                          <span className="font-mono">{preOrderTotal.toFixed(0)}$</span>
                        </div>
                        {orderType === 'delivery' && (
                          <div className="flex justify-between text-gray-400 text-[11px]">
                            <span>Delivery de domicilio ({selectedZone.split(' ')[0]}):</span>
                            <span className="font-mono">+{deliveryCost}$</span>
                          </div>
                        )}
                        <div className="flex justify-between font-bold text-white pt-1.5 text-xs">
                          <span>Total estimado:</span>
                          <span className="font-mono text-[#008C45]">{grandTotal}$</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-[11px] text-gray-500 mt-2 italic">
                        No has agregado platos del menú. Selecciona tus pizzas o platos preferidos arriba para mandarlos con esta solicitud.
                      </p>
                      {(orderType === 'delivery' || orderType === 'pickup') && (
                        <div className="mt-2.5 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-2.5 text-[10px] text-yellow-500 leading-normal">
                          ⚠️ Debes agregar artículos al carrito en la sección de menú para poder ordenar Delivery o Retiro.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Input Form Fields Right */}
              <form onSubmit={handleSubmit} className="md:col-span-7 p-8 sm:p-10 space-y-6">
                
                {/* Full name field */}
                <div className="space-y-1.5 text-left">
                  <label htmlFor="fullname" className="text-xs uppercase font-extrabold text-gray-800 tracking-wider">
                    Nombre Completo
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">👤</span>
                    <input
                      id="fullname"
                      type="text"
                      required
                      placeholder="Ej. Juan Pérez"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-gray-55/80 pl-10 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#008C45] focus:ring-1 focus:ring-[#008C45] text-sm text-gray-800 shadow-sm transition-all"
                    />
                  </div>
                </div>

                {/* Telephone Number field */}
                <div className="space-y-1.5 text-left">
                  <label htmlFor="phone" className="text-xs uppercase font-extrabold text-gray-800 tracking-wider">
                    Número de Contacto (WhatsApp)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">📞</span>
                    <input
                      id="phone"
                      type="tel"
                      required
                      placeholder="Ej. +58 412 123 4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-gray-55/80 pl-10 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#008C45] focus:ring-1 focus:ring-[#008C45] text-sm text-gray-800 shadow-sm transition-all"
                    />
                  </div>
                </div>

                {/* Delivery Fields Conditional */}
                {orderType === 'delivery' && (
                  <>
                    <div className="space-y-1.5 text-left">
                      <label htmlFor="delivery-zone" className="text-xs uppercase font-extrabold text-gray-800 tracking-wider">
                        Zona de Despacho (Ciudad Guayana)
                      </label>
                      <select
                        id="delivery-zone"
                        value={selectedZone}
                        onChange={(e) => setSelectedZone(e.target.value)}
                        className="w-full bg-gray-55/80 px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#008C45] focus:ring-1 focus:ring-[#008C45] text-sm text-gray-800 shadow-sm transition-all"
                      >
                        {DELIVERY_ZONES.map((zone) => (
                          <option key={zone.name} value={zone.name}>
                            {zone.name} (+{zone.cost}$)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label htmlFor="delivery-address" className="text-xs uppercase font-extrabold text-gray-800 tracking-wider">
                        Dirección Detallada
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-400">📍</span>
                        <textarea
                          id="delivery-address"
                          required
                          placeholder="Ej. Urb. Los Olivos, Calle Italia, Casa N° 12, Puntos de referencia..."
                          rows={2}
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          className="w-full bg-gray-55/80 pl-10 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#008C45] focus:ring-1 focus:ring-[#008C45] text-sm text-gray-800 shadow-sm transition-all resize-none"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Date & Time fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 text-left">
                    <label htmlFor="booking-date" className="text-xs uppercase font-extrabold text-gray-800 tracking-wider">
                      {orderType === 'dine_in' ? 'Fecha de Reserva' : orderType === 'delivery' ? 'Fecha de Entrega' : 'Fecha de Retiro'}
                    </label>
                    <div className="relative">
                      <input
                        id="booking-date"
                        type="date"
                        required
                        min={todayString}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-gray-55/80 pl-4 pr-3 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#008C45] focus:ring-1 focus:ring-[#008C45] text-sm text-gray-800 shadow-sm transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label htmlFor="booking-time" className="text-xs uppercase font-extrabold text-gray-800 tracking-wider">
                      {orderType === 'dine_in' ? 'Hora Sugerida' : orderType === 'delivery' ? 'Hora Máxima de Entrega' : 'Hora de Retiro'}
                    </label>
                    <select
                      id="booking-time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full bg-gray-55/80 px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#008C45] focus:ring-1 focus:ring-[#008C45] text-sm text-gray-800 shadow-sm transition-all"
                    >
                      {availableTimes.map((t) => {
                        const numericHour = parseInt(t.split(':')[0]);
                        const period = numericHour >= 12 ? 'PM' : 'AM';
                        const displayHour = numericHour > 12 ? numericHour - 12 : numericHour;
                        const minutes = t.split(':')[1];
                        return (
                          <option key={t} value={t}>
                            {displayHour}:{minutes} {period}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                {/* Dine in guests options */}
                {orderType === 'dine_in' && (
                  <div className="space-y-2 text-left animate-fade-in">
                    <div className="flex justify-between items-center">
                      <label className="text-xs uppercase font-extrabold text-gray-800 tracking-wider">
                        Número de Invitados
                      </label>
                      <span className="font-mono font-bold text-[#CD212A] text-sm bg-red-50 px-2.5 py-0.5 rounded-full">
                        {guests} {guests === 1 ? 'persona' : 'personas'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                      <button
                        type="button"
                        id="btn-guest-decrease"
                        onClick={() => setGuests(Math.max(1, guests - 1))}
                        className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border hover:bg-gray-100 font-extrabold text-[#CD212A] transition-colors"
                      >
                        -
                      </button>
                      <input
                        type="range"
                        min="1"
                        max="20"
                        value={guests}
                        onChange={(e) => setGuests(parseInt(e.target.value))}
                        className="flex-1 accent-[#CD212A]"
                      />
                      <button
                        type="button"
                        id="btn-guest-increase"
                        onClick={() => setGuests(Math.min(20, guests + 1))}
                        className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border hover:bg-gray-100 font-extrabold text-[#CD212A] transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                {/* Special Requests / Order comments */}
                <div className="space-y-1.5 text-left">
                  <label htmlFor="requests" className="text-xs uppercase font-extrabold text-gray-800 tracking-wider">
                    {orderType === 'dine_in' ? 'Requerimientos Especiales (Opcional)' : 'Notas o Comentarios Adicionales'}
                  </label>
                  <textarea
                    id="requests"
                    placeholder={
                      orderType === 'dine_in'
                        ? 'Ej. Celebración de cumpleaños, alergias, silla para bebés...'
                        : 'Ej. Traer cambio de billete de $20, pizzas cortadas en 8 trozos, etc...'
                    }
                    rows={2}
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="w-full bg-gray-55/80 p-4 rounded-xl border border-gray-200 outline-none focus:border-[#008C45] focus:ring-1 focus:ring-[#008C45] text-sm text-gray-800 shadow-sm transition-all resize-none"
                  />
                </div>

                {/* Warning about non-delivery items inside the active cart */}
                {orderType !== 'dine_in' && hasNonDeliveryItems && (
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-left space-y-2 animate-pulse">
                    <div className="flex items-center space-x-2 text-red-700">
                      <span>⚠️</span>
                      <span className="text-xs font-bold uppercase tracking-wider font-mono">¡Platos Exclusivos de Sala detectados!</span>
                    </div>
                    <p className="text-xs text-red-600 leading-relaxed font-sans">
                      Tu pre-orden contiene platos que sólo pueden consumirse en el local: <strong>{nonDeliveryPreOrderItems.map(p => p.name).join(', ')}</strong>. Por favor, elimínalos del carrito en la sección de menú o cámbiate a la opción de <strong>Reserva 🍽️</strong> para continuar.
                    </p>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  id="btn-submit-booking-wizard"
                  disabled={orderType !== 'dine_in' && hasNonDeliveryItems}
                  className={`w-full py-4 px-6 rounded-xl font-bold uppercase tracking-wider text-sm shadow-lg transition-all flex items-center justify-center space-x-3 active:scale-[0.99] ${
                    orderType !== 'dine_in' && hasNonDeliveryItems
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                      : 'bg-[#CD212A] hover:bg-[#b01c24] text-white hover:shadow-xl'
                  }`}
                >
                  <CheckCircle2 size={18} />
                  <span>
                    {orderType === 'dine_in' && 'Registrar Reserva Online'}
                    {orderType === 'delivery' && 'Completar Pedido con Delivery'}
                    {orderType === 'pickup' && 'Programar Retiro en Local'}
                  </span>
                </button>
              </form>
            </div>
          ) : (
            /* Success Booking Panel */
            <div id="booking-success-payout" className="p-8 sm:p-12 text-center space-y-6">
              <div className="w-16 h-16 bg-[#008C45]/15 text-[#008C45] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={36} />
              </div>

              <div className="space-y-4">
                <h3 className="font-serif font-extrabold text-2xl text-gray-900 uppercase">
                  {orderType === 'dine_in' && '¡Reserva Registrada Exitosamente!'}
                  {orderType === 'delivery' && '¡Pedido de Delivery Registrado!'}
                  {orderType === 'pickup' && '¡Pedido de Retiro Listo para Enviar!'}
                </h3>
                <div className="text-sm text-gray-650 max-w-lg mx-auto leading-relaxed">
                  {orderType === 'dine_in' && (
                    <p>
                      Gracias <strong>{name}</strong>. Tu reserva para <strong>{guests} {guests === 1 ? 'persona' : 'personas'}</strong> el día <strong>{date}</strong> a las <strong>{time}</strong> se ha guardado perfectamente en tu navegador de respaldo.
                    </p>
                  )}
                  {orderType === 'delivery' && (
                    <p>
                      ¡Excelente, <strong>{name}</strong>! Tu pedido con despacho para <strong>{selectedZone}</strong> el día <strong>{date}</strong> a las <strong>{time}</strong> ha sido pre-registrado de forma local con éxito.
                    </p>
                  )}
                  {orderType === 'pickup' && (
                    <p>
                      ¡Todo listo, <strong>{name}</strong>! Tu retiro presencial en nuestro restaurante (Alta Vista II) el día <strong>{date}</strong> a las <strong>{time}</strong> ha sido reservado.
                    </p>
                  )}
                </div>
              </div>

              {/* WhatsApp Call to Action card */}
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 max-w-xl mx-auto space-y-4">
                <div className="flex items-center space-x-2 text-[#008C45] justify-center">
                  <MessageSquare size={16} />
                  <span className="text-xs uppercase font-bold tracking-widest font-mono">
                    {orderType === 'dine_in' ? 'Respaldo Inmediato WhatsApp' : 'Completar Pedido con WhatsApp Directo'}
                  </span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {orderType === 'dine_in'
                    ? 'Para asegurar tu mesa de forma directa con nuestro personal de Napoletana, te recomendamos pulsar el botón a continuación para enviar tu confirmación pre-formateada por WhatsApp:'
                    : 'Para que el restaurante pueda comenzar a cocinar tu pedido italiano, debes enviar el ticket pre-formateado al WhatsApp oficial de Napoletana pulsando el botón verde:'}
                </p>

                <button
                  id="btn-secondary-send-whatsapp-confirm"
                  onClick={() => createdReservation && onSendWhatsApp(createdReservation)}
                  className="w-full sm:w-auto bg-[#008C45] hover:bg-[#007037] text-white py-3.5 px-8 rounded-xl font-bold uppercase tracking-wider text-xs shadow hover:shadow-md transition-all inline-flex items-center justify-center space-x-2.5"
                >
                  <span>
                    {orderType === 'dine_in' && 'Enviar Reserva por WhatsApp'}
                    {orderType === 'delivery' && 'Enviar Pedido de Delivery por WhatsApp'}
                    {orderType === 'pickup' && 'Enviar Pedido de Retiro por WhatsApp'}
                  </span>
                  <span>💬</span>
                </button>
              </div>

              <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  id="btn-register-other-booking"
                  onClick={handleReset}
                  className="text-xs font-bold text-[#CD212A] hover:text-[#b01c24] uppercase tracking-widest py-2 px-4 transition-colors font-extrabold"
                >
                  Registrar otra solicitud o pedido
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
