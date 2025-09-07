import { Hotel } from '@/types/hotel';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, MapPin } from 'lucide-react';

interface HotelCardProps {
  hotel: Hotel;
  onSelect: (hotel: Hotel) => void;
}

export const HotelCard = ({ hotel, onSelect }: HotelCardProps) => {
  return (
    <Card className="overflow-hidden shadow-card-elegant hover:shadow-luxury transition-smooth">
      <div className="relative h-64">
        <img
          src={hotel.imageUrl}
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 bg-gradient-gold text-accent-foreground px-3 py-1 rounded-full text-sm font-semibold">
          {hotel.rating} ★
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-2xl font-bold text-foreground mb-2">{hotel.name}</h3>
        <p className="text-muted-foreground mb-4 line-clamp-2">{hotel.description}</p>
        
        <div className="flex items-center text-muted-foreground mb-6">
          <MapPin className="w-4 h-4 mr-2" />
          <span className="text-sm">{hotel.address}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {hotel.rooms.length} rooms available
          </div>
          <Button 
            variant="luxury" 
            size="lg"
            onClick={() => onSelect(hotel)}
            className="px-8"
          >
            View Rooms
          </Button>
        </div>
      </div>
    </Card>
  );
};