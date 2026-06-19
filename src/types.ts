export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: string;
  category: MenuCategoryID;
  tags?: string[]; // e.g. "D.O.P.", "Contiene Pescado", "Fines de Semana", "Popular", "Picante"
  isPopular?: boolean;
  noDelivery?: boolean;
}

export type MenuCategoryID =
  | 'pizzas'
  | 'entradas'
  | 'ensaladas'
  | 'risottos'
  | 'pastas'
  | 'secondi'
  | 'bambinos'
  | 'dolce'
  | 'bebidas_cafe';

export interface MenuCategory {
  id: MenuCategoryID;
  label: string;
  icon: string; // lucide icon name
  description?: string;
}

export interface Reservation {
  id: string;
  type?: 'dine_in' | 'delivery' | 'pickup';
  name: string;
  phone: string;
  date: string;
  time: string;
  guests?: number;
  deliveryAddress?: string;
  deliveryZone?: string;
  deliveryCost?: number;
  specialRequests?: string;
  preOrderedItems?: Array<{ menuItemId: string; name: string; quantity: number }>;
  createdAt: string;
  status: 'confirmed' | 'pending';
}
