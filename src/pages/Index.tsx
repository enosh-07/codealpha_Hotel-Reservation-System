import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hotel, Room, RoomCategory } from '@/types/hotel';
import { HotelService } from '@/services/HotelService';
import { HotelCard } from '@/components/HotelCard';
import { RoomCard } from '@/components/RoomCard';
import { BookingModal } from '@/components/BookingModal';
import { BookingManagement } from '@/components/BookingManagement';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Hotel as HotelIcon, Calendar, Star, MapPin, Users, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import hotelHeroImg from '@/assets/hotel-hero.jpg';

const Index = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<RoomCategory | 'All'>('All');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('hotels');

  const hotelService = HotelService.getInstance();
  const { toast } = useToast();
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
      return;
    }
    
    const allHotels = hotelService.getHotels();
    setHotels(allHotels);
    if (allHotels.length > 0) {
      setSelectedHotel(allHotels[0]);
    }
  }, [user, loading, navigate]);

  const handleHotelSelect = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setActiveTab('rooms');
  };

  const handleRoomBook = (room: Room) => {
    setSelectedRoom(room);
    setIsBookingModalOpen(true);
  };

  const handleBookingComplete = (bookingId: string) => {
    toast({
      title: "Booking Confirmed!",
      description: `Your reservation has been confirmed. Booking ID: ${bookingId}`,
    });
    setIsBookingModalOpen(false);
    setActiveTab('bookings');
  };

  const getFilteredRooms = () => {
    if (!selectedHotel) return [];
    return selectedCategory === 'All' 
      ? selectedHotel.rooms 
      : selectedHotel.rooms.filter(room => room.category === selectedCategory);
  };

  const categories: (RoomCategory | 'All')[] = ['All', 'Standard', 'Deluxe', 'Suite'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={hotelHeroImg}
          alt="Luxury Hotel"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl px-6">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Grand Luxury Hotel
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Experience unparalleled luxury in the heart of the city
            </p>
            <div className="flex items-center justify-center space-x-6 text-white/80">
              <div className="flex items-center">
                <Star className="w-5 h-5 mr-2 text-accent" />
                <span>5-Star Rating</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-accent" />
                <span>Prime Location</span>
              </div>
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-accent" />
                <span>World-Class Service</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* User Menu */}
        <div className="absolute top-4 right-4">
          <div className="flex items-center space-x-4 bg-black/20 backdrop-blur rounded-lg p-3">
            <div className="flex items-center space-x-2 text-white">
              <User className="w-4 h-4" />
              <span className="text-sm">{user?.email}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={signOut}
              className="text-white border-white/20 hover:bg-white/10"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 -mt-16 relative z-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="bg-card rounded-lg shadow-luxury p-6 mb-8">
            <TabsList className="grid w-full grid-cols-3 bg-secondary">
              <TabsTrigger value="hotels" className="flex items-center gap-2">
                <HotelIcon className="w-4 h-4" />
                Hotels
              </TabsTrigger>
              <TabsTrigger value="rooms" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Rooms
              </TabsTrigger>
              <TabsTrigger value="bookings" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                My Bookings
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="hotels" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Discover Our Hotels
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Choose from our collection of luxury hotels, each offering unique experiences 
                and world-class amenities.
              </p>
            </div>
            
            <div className="grid gap-8">
              {hotels.map((hotel) => (
                <HotelCard
                  key={hotel.id}
                  hotel={hotel}
                  onSelect={handleHotelSelect}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="rooms" className="space-y-6">
            {selectedHotel && (
              <>
                <div className="bg-card rounded-lg p-6 shadow-card-elegant">
                  <h2 className="text-3xl font-bold text-foreground mb-2">
                    {selectedHotel.name} - Rooms
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Choose your perfect room from our selection of categories
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "gold" : "elegant"}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                        {category !== 'All' && (
                          <Badge variant="outline" className="ml-2">
                            {selectedHotel.rooms.filter(r => r.category === category).length}
                          </Badge>
                        )}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getFilteredRooms().map((room) => (
                    <RoomCard
                      key={room.id}
                      room={room}
                      onBook={handleRoomBook}
                    />
                  ))}
                </div>

                {getFilteredRooms().length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">
                      No rooms available in the {selectedCategory} category.
                    </p>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="bookings">
            <BookingManagement />
          </TabsContent>
        </Tabs>
      </div>

      <BookingModal
        room={selectedRoom}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onBookingComplete={handleBookingComplete}
      />
    </div>
  );
};

export default Index;