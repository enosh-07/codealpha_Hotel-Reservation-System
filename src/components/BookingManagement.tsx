import { useState, useEffect } from 'react';
import { Booking } from '@/types/hotel';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, CreditCard, MapPin, X } from 'lucide-react';
import { HotelService } from '@/services/HotelService';
import { useToast } from '@/hooks/use-toast';

export const BookingManagement = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const hotelService = HotelService.getInstance();
  const { toast } = useToast();

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = () => {
    const allBookings = hotelService.getBookings();
    setBookings(allBookings.sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime()));
  };

  const handleCancelBooking = (bookingId: string) => {
    const success = hotelService.cancelBooking(bookingId);
    if (success) {
      loadBookings();
      toast({
        title: "Booking Cancelled",
        description: "Your booking has been successfully cancelled.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to cancel booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const calculateNights = (checkIn: string, checkOut: string) => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = checkOutDate.getTime() - checkInDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">No Bookings Yet</h3>
        <p className="text-muted-foreground">Your booking history will appear here once you make a reservation.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-foreground">My Bookings</h2>
        <Badge variant="outline" className="px-3 py-1">
          {bookings.filter(b => b.status === 'confirmed').length} Active
        </Badge>
      </div>

      <div className="grid gap-6">
        {bookings.map((booking) => (
          <Card key={booking.id} className="overflow-hidden shadow-card-elegant">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-1">
                    {booking.roomName}
                  </h3>
                  <div className="flex items-center text-muted-foreground text-sm mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    {booking.hotelName}
                  </div>
                  <Badge className={getStatusColor(booking.status)}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </Badge>
                </div>
                
                {booking.status === 'confirmed' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCancelBooking(booking.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </Button>
                )}
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-accent" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Check-in</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(booking.checkIn).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-accent" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Check-out</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(booking.checkOut).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-accent" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Guests</p>
                    <p className="text-sm text-muted-foreground">{booking.guests}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5 text-accent" />
                  <span className="text-sm text-muted-foreground">
                    {calculateNights(booking.checkIn, booking.checkOut)} nights
                  </span>
                </div>
                
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-2xl font-bold text-foreground">${booking.totalPrice}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Booking ID: {booking.id}</span>
                  <span>Booked: {new Date(booking.bookingDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};