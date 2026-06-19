import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MenuBrowser from './components/MenuBrowser';
import Gallery from './components/Gallery';
import ReservationForm from './components/ReservationForm';
import ActiveReservations from './components/ActiveReservations';
import Footer from './components/Footer';

import { Reservation } from './types';
import { MENU_ITEMS } from './data/menu';

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedPreOrderItems, setSelectedPreOrderItems] = useState<
    Array<{ menuItemId: string; name: string; quantity: number }>
  >([]);

  // Load reservations from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('napoletana_reservations');
      if (stored) {
        setReservations(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error loading reservations:', e);
    }
  }, []);

  // Track scroll position to update active navigation tab dynamically
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'menu', 'gallery', 'reservations'];
      const scrollPosition = window.scrollY + 180; // offset

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll handler
  const handleNavigate = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  // Add new reservation
  const handleAddReservation = (newRes: Reservation) => {
    const updated = [newRes, ...reservations];
    setReservations(updated);
    try {
      localStorage.setItem('napoletana_reservations', JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving reservation:', e);
    }
  };

  // Cancel reservation
  const handleCancelReservation = (id: string) => {
    const confirmed = window.confirm('¿Está seguro de que desea cancelar esta reserva?');
    if (!confirmed) return;

    const updated = reservations.filter((r) => r.id !== id);
    setReservations(updated);
    try {
      localStorage.setItem('napoletana_reservations', JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving reservation list:', e);
    }
  };

  // Pre-Order handlers
  const handleUpdatePreOrderQuantity = (itemId: string, delta: number) => {
    setSelectedPreOrderItems((prev) => {
      const existing = prev.find((i) => i.menuItemId === itemId);
      
      if (!existing) {
        if (delta <= 0) return prev;
        const itemInfo = MENU_ITEMS.find((mi) => mi.id === itemId);
        return [...prev, { menuItemId: itemId, name: itemInfo?.name || '', quantity: delta }];
      }

      const newQty = existing.quantity + delta;
      if (newQty <= 0) {
        return prev.filter((i) => i.menuItemId !== itemId);
      }

      return prev.map((i) => (i.menuItemId === itemId ? { ...i, quantity: newQty } : i));
    });
  };

  const handleClearPreOrder = () => {
    setSelectedPreOrderItems([]);
  };

  // Send WhatsApp formulation
  const handleSendWhatsApp = (res: Reservation) => {
    const phoneNo = '584125098158'; // Napoletana's WhatsApp number
    const type = res.type || 'dine_in';

    let msg = '';
    if (type === 'delivery') {
      msg += `*🛵 PEDIDO CON DELIVERY - NAPOLETANA 🛵*\n\n`;
    } else if (type === 'pickup') {
      msg += `*🛍️ PEDIDO PARA RETIRAR - NAPOLETANA 🛍️*\n\n`;
    } else {
      msg += `*🍕 RESERVA EN SARA - NAPOLETANA 🍕*\n\n`;
    }

    msg += `👤 *Cliente:* ${res.name}\n`;
    msg += `📞 *Teléfono:* ${res.phone}\n`;
    msg += `📅 *Fecha:* ${res.date}\n`;
    msg += `🕒 *Hora:* ${res.time}\n`;

    if (type === 'dine_in') {
      msg += `👥 *Invitados:* ${res.guests} ${res.guests === 1 ? 'persona' : 'personas'}\n`;
    } else if (type === 'delivery') {
      msg += `📍 *Zona de Envío:* ${res.deliveryZone}\n`;
      msg += `🏠 *Dirección:* ${res.deliveryAddress}\n`;
    }

    if (res.preOrderedItems && res.preOrderedItems.length > 0) {
      msg += `\n🍝 *Detalle del Pedido:*\n`;
      res.preOrderedItems.forEach((p) => {
        msg += `   • ${p.quantity}x ${p.name}\n`;
      });
      
      // Calculate total
      const subtotal = res.preOrderedItems.reduce((acc, current) => {
        const dbItem = MENU_ITEMS.find((mi) => mi.id === current.menuItemId);
        const price = dbItem ? parseFloat(dbItem.price) : 0;
        return acc + price * current.quantity;
      }, 0);

      msg += `\n💵 *Subtotal:* ${subtotal.toFixed(0)}$\n`;
      if (type === 'delivery' && res.deliveryCost !== undefined) {
        msg += `🛵 *Envío (Delivery):* ${res.deliveryCost.toFixed(2)}$\n`;
        msg += `💰 *Total de Pedido:* ${(subtotal + res.deliveryCost).toFixed(2)}$\n`;
      } else {
        msg += `💰 *Total de Pedido:* ${subtotal.toFixed(0)}$\n`;
      }
    }

    if (res.specialRequests) {
      msg += `\n💬 *Instrucciones / Notas:* _${res.specialRequests}_\n`;
    }

    if (type === 'dine_in') {
      msg += `\n_Por favor confirmar disponibilidad. ¡Muchas gracias!_`;
    } else if (type === 'delivery') {
      msg += `\n_Por favor confirmar recepción y datos de pago móvil para despacho. ¡Muchas gracias!_`;
    } else {
      msg += `\n_Por favor confirmar horario de retiro. ¡Muchas gracias!_`;
    }

    const encodedText = encodeURIComponent(msg);
    const whatsappUrl = `https://wa.me/${phoneNo}?text=${encodedText}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="font-sans antialiased text-gray-900 bg-white min-h-screen flex flex-col justify-between selection:bg-[#008C45]/20 selection:text-gray-900">
      
      {/* Navigation header */}
      <Navbar onNavigate={handleNavigate} activeSection={activeSection} />

      {/* Hero Welcome banner */}
      <Hero
        onExploreMenu={() => handleNavigate('menu')}
        onBookTable={() => handleNavigate('reservations')}
      />

      {/* Main layout frame */}
      <main className="flex-grow">
        
        {/* Dynamic active reservation console if they have active reservations */}
        {reservations.length > 0 && (
          <div className="py-12 bg-gray-50 border-b border-gray-100">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <ActiveReservations
                reservations={reservations}
                onCancel={handleCancelReservation}
                onSendWhatsApp={handleSendWhatsApp}
              />
            </div>
          </div>
        )}

        {/* Menu Browser Category list */}
        <MenuBrowser
          onAddToReservation={(items) => {
            setSelectedPreOrderItems(items);
            handleNavigate('reservations');
          }}
          selectedPreOrderItems={selectedPreOrderItems}
          onUpdatePreOrderQuantity={handleUpdatePreOrderQuantity}
          onClearPreOrder={handleClearPreOrder}
          onNavigateToBooking={() => handleNavigate('reservations')}
        />

        {/* Photography Showcase */}
        <Gallery />

        {/* Reservation Wizard */}
        <ReservationForm
          onAddReservation={handleAddReservation}
          selectedPreOrderItems={selectedPreOrderItems}
          onClearPreOrder={handleClearPreOrder}
          onSendWhatsApp={handleSendWhatsApp}
        />

      </main>

      {/* Footer layout */}
      <Footer />
    </div>
  );
}
