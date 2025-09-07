import { Room } from '@/types/hotel';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Wifi, Tv, Coffee, Car } from 'lucide-react';

interface RoomCardProps {
  room: Room;
  onBook: (room: Room) => void;
}

const amenityIcons: Record<string, React.ReactNode> = {
  'Free WiFi': <Wifi className="w-4 h-4" />,
  'TV': <Tv className="w-4 h-4" />,
  'Coffee Maker': <Coffee className="w-4 h-4" />,
  'Parking': <Car className="w-4 h-4" />,
};

export const RoomCard = ({ room, onBook }: RoomCardProps) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Standard':
        return 'bg-secondary text-secondary-foreground';
      case 'Deluxe':
        return 'bg-gradient-primary text-primary-foreground';
      case 'Suite':
        return 'bg-gradient-gold text-accent-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="overflow-hidden shadow-card-elegant hover:shadow-luxury transition-smooth">
      <div className="relative h-48">
        <img
          src={room.imageUrl}
          alt={room.name}
          className="w-full h-full object-cover"
        />
        <Badge className={`absolute top-4 left-4 ${getCategoryColor(room.category)}`}>
          {room.category}
        </Badge>
        {!room.available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold">Not Available</span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-foreground">{room.name}</h3>
          <div className="flex items-center text-muted-foreground">
            <Users className="w-4 h-4 mr-1" />
            <span className="text-sm">{room.capacity}</span>
          </div>
        </div>
        
        <p className="text-muted-foreground mb-4 text-sm">{room.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {room.amenities.slice(0, 4).map((amenity, index) => (
            <div key={index} className="flex items-center text-xs text-muted-foreground">
              {amenityIcons[amenity] || <div className="w-2 h-2 bg-accent rounded-full" />}
              <span className="ml-1">{amenity}</span>
            </div>
          ))}
          {room.amenities.length > 4 && (
            <span className="text-xs text-muted-foreground">
              +{room.amenities.length - 4} more
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-foreground">${room.price}</span>
            <span className="text-muted-foreground text-sm ml-1">/ night</span>
          </div>
          <Button 
            variant={room.available ? "gold" : "outline"} 
            size="lg"
            onClick={() => onBook(room)}
            disabled={!room.available}
            className="px-6"
          >
            {room.available ? 'Book Now' : 'Unavailable'}
          </Button>
        </div>
      </div>
    </Card>
  );
};