import { Hotel, Room, Booking, RoomCategory } from '@/types/hotel';
import standardRoomImg from '@/assets/standard-room.jpg';
import deluxeRoomImg from '@/assets/deluxe-room.jpg';
import suiteRoomImg from '@/assets/suite-room.jpg';
import hotelHeroImg from '@/assets/hotel-hero.jpg';

export class HotelService {
  private static instance: HotelService;
  private hotels: Hotel[] = [];
  private bookings: Booking[] = [];

  private constructor() {
    this.initializeData();
    this.loadFromStorage();
  }

  public static getInstance(): HotelService {
    if (!HotelService.instance) {
      HotelService.instance = new HotelService();
    }
    return HotelService.instance;
  }

  private initializeData(): void {
    const sampleRooms: Room[] = [
      {
        id: 'room-1',
        category: 'Standard',
        name: 'Standard Double Room',
        description: 'Comfortable room with modern amenities and city view',
        price: 120,
        capacity: 2,
        amenities: ['Free WiFi', 'Air Conditioning', 'TV', 'Room Service'],
        imageUrl: standardRoomImg,
        available: true,
      },
      {
        id: 'room-2',
        category: 'Standard',
        name: 'Standard Twin Room',
        description: 'Cozy room with twin beds perfect for friends or colleagues',
        price: 110,
        capacity: 2,
        amenities: ['Free WiFi', 'Air Conditioning', 'TV', 'Coffee Maker'],
        imageUrl: standardRoomImg,
        available: true,
      },
      {
        id: 'room-3',
        category: 'Deluxe',
        name: 'Deluxe King Room',
        description: 'Spacious room with premium furnishings and ocean view',
        price: 200,
        capacity: 2,
        amenities: ['Free WiFi', 'Air Conditioning', 'TV', 'Minibar', 'Balcony', 'Room Service'],
        imageUrl: deluxeRoomImg,
        available: true,
      },
      {
        id: 'room-4',
        category: 'Deluxe',
        name: 'Deluxe Suite',
        description: 'Elegant suite with separate living area and marble bathroom',
        price: 280,
        capacity: 4,
        amenities: ['Free WiFi', 'Air Conditioning', 'TV', 'Minibar', 'Balcony', 'Room Service', 'Living Area'],
        imageUrl: deluxeRoomImg,
        available: true,
      },
      {
        id: 'room-5',
        category: 'Suite',
        name: 'Presidential Suite',
        description: 'Ultimate luxury with panoramic views and premium amenities',
        price: 500,
        capacity: 6,
        amenities: ['Free WiFi', 'Air Conditioning', 'TV', 'Minibar', 'Balcony', 'Room Service', 'Living Area', 'Jacuzzi', 'Butler Service'],
        imageUrl: suiteRoomImg,
        available: true,
      },
      {
        id: 'room-6',
        category: 'Suite',
        name: 'Royal Suite',
        description: 'Opulent suite with multiple rooms and exclusive services',
        price: 750,
        capacity: 8,
        amenities: ['Free WiFi', 'Air Conditioning', 'TV', 'Minibar', 'Balcony', 'Room Service', 'Living Area', 'Jacuzzi', 'Butler Service', 'Private Chef'],
        imageUrl: suiteRoomImg,
        available: true,
      },
    ];

    this.hotels = [
      {
        id: 'hotel-1',
        name: 'Grand Luxury Hotel',
        description: 'Experience unparalleled luxury in the heart of the city',
        address: '123 Luxury Avenue, Downtown District',
        rating: 5,
        imageUrl: hotelHeroImg,
        rooms: sampleRooms,
      },
    ];
  }

  private saveToStorage(): void {
    localStorage.setItem('hotelBookings', JSON.stringify(this.bookings));
    localStorage.setItem('hotelRooms', JSON.stringify(this.hotels[0]?.rooms || []));
  }

  private loadFromStorage(): void {
    try {
      const savedBookings = localStorage.getItem('hotelBookings');
      if (savedBookings) {
        this.bookings = JSON.parse(savedBookings);
      }

      const savedRooms = localStorage.getItem('hotelRooms');
      if (savedRooms && this.hotels[0]) {
        this.hotels[0].rooms = JSON.parse(savedRooms);
      }
    } catch (error) {
      console.error('Error loading from storage:', error);
    }
  }

  public getHotels(): Hotel[] {
    return this.hotels;
  }

  public getHotelById(id: string): Hotel | undefined {
    return this.hotels.find(hotel => hotel.id === id);
  }

  public getRoomsByCategory(category?: RoomCategory): Room[] {
    const allRooms = this.hotels.flatMap(hotel => hotel.rooms);
    return category ? allRooms.filter(room => room.category === category) : allRooms;
  }

  public getRoomById(roomId: string): Room | undefined {
    return this.hotels.flatMap(hotel => hotel.rooms).find(room => room.id === roomId);
  }

  public createBooking(booking: Omit<Booking, 'id' | 'bookingDate' | 'status'>): Booking {
    const newBooking: Booking = {
      ...booking,
      id: `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      bookingDate: new Date().toISOString(),
      status: 'confirmed',
    };

    this.bookings.push(newBooking);
    this.saveToStorage();
    return newBooking;
  }

  public getBookings(): Booking[] {
    return this.bookings;
  }

  public cancelBooking(bookingId: string): boolean {
    const booking = this.bookings.find(b => b.id === bookingId);
    if (booking) {
      booking.status = 'cancelled';
      this.saveToStorage();
      return true;
    }
    return false;
  }

  public isRoomAvailable(roomId: string, checkIn: string, checkOut: string): boolean {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const conflictingBookings = this.bookings.filter(booking => 
      booking.roomId === roomId && 
      booking.status === 'confirmed' &&
      ((new Date(booking.checkIn) <= checkInDate && new Date(booking.checkOut) > checkInDate) ||
       (new Date(booking.checkIn) < checkOutDate && new Date(booking.checkOut) >= checkOutDate) ||
       (new Date(booking.checkIn) >= checkInDate && new Date(booking.checkOut) <= checkOutDate))
    );

    return conflictingBookings.length === 0;
  }
}