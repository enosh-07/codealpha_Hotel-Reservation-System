export type RoomCategory = 'Standard' | 'Deluxe' | 'Suite';

export interface Room {
  id: string;
  category: RoomCategory;
  name: string;
  description: string;
  price: number;
  capacity: number;
  amenities: string[];
  imageUrl: string;
  available: boolean;
}

export interface Hotel {
  id: string;
  name: string;
  description: string;
  address: string;
  rating: number;
  imageUrl: string;
  rooms: Room[];
}

export interface Booking {
  id: string;
  hotelId: string;
  roomId: string;
  hotelName: string;
  roomName: string;
  roomCategory: RoomCategory;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  customerName: string;
  customerEmail: string;
  status: 'confirmed' | 'cancelled';
  bookingDate: string;
}

export interface BookingFormData {
  checkIn: string;
  checkOut: string;
  guests: number;
  customerName: string;
  customerEmail: string;
}