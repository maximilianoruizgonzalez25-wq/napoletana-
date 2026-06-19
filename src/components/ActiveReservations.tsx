import { Trash2, Calendar, Clock, Users, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Reservation } from '../types';

interface ActiveReservationsProps {
  reservations: Reservation[];
  onCancel: (id: string) => void;
  onSendWhatsApp: (reservation: Reservation) => void;
}

export default function ActiveReservations({
  reservations,
  onCancel,
  onSendWhatsApp,
}: ActiveReservationsProps) {
  if (reservations.length === 0) {
    return null;
  }

  return (
    <div id="active-bookings-list" className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm">
      <div className="flex items-center space-x-2.5 mb-6">
        <span className="w-2.5 h-2.5 rounded-full bg-[#008C45]"></span>
        <h3 className="font-serif font-extrabold text-xl text-gray-900 uppercase tracking-tight">
          Mis Reservas y Pedidos Activos ({reservations.length})
        </h3>
      </div>

      <p className="text-xs text-gray-500 mb-6 leading-relaxed">
        Estas son tus solicitudes registradas localmente en este dispositivo. Puedes guardarlas o enviar una confirmación directa al restaurante por WhatsApp.
      </p>

      <div className="space-y-4">
        {reservations.map((res) => {
          const type = res.type || 'dine_in';
          let typeLabel = 'Mesa para';
          let iconPrefix = '🍕';
          if (type === 'delivery') {
            typeLabel = 'Delivery para';
            iconPrefix = '🛵';
          } else if (type === 'pickup') {
            typeLabel = 'Retiro en Local para';
            iconPrefix = '🛍️';
          }

          return (
            <div
              key={res.id}
              id={`booking-card-${res.id}`}
              className="border border-gray-100 rounded-2xl p-5 bg-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-gray-200 transition-colors"
            >
              {/* Booking Details Group */}
              <div className="space-y-2 flex-grow">
                <div className="flex items-center space-x-2 text-gray-900 font-bold text-sm">
                  <span className="text-lg">{iconPrefix}</span>
                  <span className="text-[#008C45] font-extrabold text-xs uppercase font-mono tracking-wider">
                    {type === 'delivery' ? 'Domicilio' : type === 'pickup' ? 'Llevar' : 'Sala'}
                  </span>
                  <span className="text-gray-300">•</span>
                  <span>{typeLabel}: {res.name}</span>
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-gray-600 font-mono">
                  <div className="flex items-center space-x-1.5">
                    <Calendar size={13} className="text-gray-400" />
                    <span>{res.date}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Clock size={13} className="text-gray-400" />
                    <span>{res.time}</span>
                  </div>
                  {type === 'dine_in' && (
                    <div className="flex items-center space-x-1.5">
                      <Users size={13} className="text-gray-400" />
                      <span>{res.guests} personas</span>
                    </div>
                  )}
                  {type === 'delivery' && res.deliveryZone && (
                    <div className="flex items-center space-x-1.5 text-[#CD212A] font-semibold">
                      <span>📍 Zona: {res.deliveryZone} ({res.deliveryCost}$ delivery)</span>
                    </div>
                  )}
                </div>

                {type === 'delivery' && res.deliveryAddress && (
                  <div className="text-xs text-gray-700 bg-white border border-gray-105 p-3 rounded-xl shadow-sm mt-1">
                    <span className="font-extrabold uppercase text-[10px] text-gray-400 block tracking-wider mb-0.5">Dirección de Despacho:</span>
                    <span>{res.deliveryAddress}</span>
                  </div>
                )}

                {res.preOrderedItems && res.preOrderedItems.length > 0 && (
                  <div className="pt-2">
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Platos Solicitados:</p>
                    <p className="text-xs text-gray-600 font-medium">
                      {res.preOrderedItems.map((item) => `${item.quantity}x ${item.name}`).join(', ')}
                    </p>
                  </div>
                )}

                {res.specialRequests && (
                  <div className="text-xs italic text-gray-500 bg-white border border-gray-100 p-2 rounded-lg mt-1">
                    Nota: "{res.specialRequests}"
                  </div>
                )}
              </div>

              {/* Actions for bookings */}
              <div className="flex items-center space-x-3 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-gray-200/60 justify-end shrink-0">
                <button
                  id={`btn-cancel-booking-${res.id}`}
                  onClick={() => onCancel(res.id)}
                  className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors font-semibold text-xs"
                  title="Cancelar"
                >
                  <Trash2 size={16} />
                </button>

                <button
                  id={`btn-whatsapp-booking-${res.id}`}
                  onClick={() => onSendWhatsApp(res)}
                  className="flex items-center space-x-1.5 bg-[#008C45] hover:bg-[#007037] text-white text-xs font-bold uppercase tracking-wider py-2.5 px-4 rounded-xl shadow-md transition-transform active:scale-95 animate-pulse"
                >
                  <span>Pedir/Confirmar</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
