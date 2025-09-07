import { useState } from 'react';
import { Room, BookingFormData } from '@/types/hotel';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Users, CreditCard } from 'lucide-react';
import { HotelService } from '@/services/HotelService';

interface BookingModalProps {
  room: Room | null;
  isOpen: boolean;
  onClose: () => void;
  onBookingComplete: (bookingId: string) => void;
}

export const BookingModal = ({ room, isOpen, onClose, onBookingComplete }: BookingModalProps) => {
  const [formData, setFormData] = useState<BookingFormData>({
    checkIn: '',
    checkOut: '',
    guests: 1,
    customerName: '',
    customerEmail: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'details' | 'payment' | 'confirmation'>('details');

  const hotelService = HotelService.getInstance();

  const calculateNights = () => {
    if (!formData.checkIn || !formData.checkOut) return 0;
    const checkIn = new Date(formData.checkIn);
    const checkOut = new Date(formData.checkOut);
    const diffTime = checkOut.getTime() - checkIn.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    return room ? room.price * calculateNights() : 0;
  };

  const handleInputChange = (field: keyof BookingFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    if (step === 'details') {
      setStep('payment');
    } else if (step === 'payment') {
      processBooking();
    }
  };

  const processBooking = async () => {
    if (!room) return;

    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const hotel = hotelService.getHotels()[0]; // Using first hotel for now
    const booking = hotelService.createBooking({
      hotelId: hotel.id,
      roomId: room.id,
      hotelName: hotel.name,
      roomName: room.name,
      roomCategory: room.category,
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
      guests: formData.guests,
      totalPrice: calculateTotal(),
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
    });

    setIsProcessing(false);
    setStep('confirmation');
    onBookingComplete(booking.id);
  };

  const resetModal = () => {
    setStep('details');
    setFormData({
      checkIn: '',
      checkOut: '',
      guests: 1,
      customerName: '',
      customerEmail: '',
    });
    onClose();
  };

  if (!room) return null;

  const isFormValid = formData.checkIn && formData.checkOut && formData.customerName && formData.customerEmail && formData.guests > 0;

  return (
    <Dialog open={isOpen} onOpenChange={resetModal}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {step === 'details' && 'Booking Details'}
            {step === 'payment' && 'Payment'}
            {step === 'confirmation' && 'Booking Confirmed!'}
          </DialogTitle>
        </DialogHeader>

        {step === 'details' && (
          <div className="space-y-6">
            <div className="bg-gradient-subtle p-4 rounded-lg">
              <h3 className="font-semibold text-foreground">{room.name}</h3>
              <p className="text-sm text-muted-foreground">{room.category} Room</p>
              <p className="text-lg font-bold text-foreground">${room.price} / night</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="checkIn" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Check-in
                </Label>
                <Input
                  id="checkIn"
                  type="date"
                  value={formData.checkIn}
                  onChange={(e) => handleInputChange('checkIn', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <Label htmlFor="checkOut">Check-out</Label>
                <Input
                  id="checkOut"
                  type="date"
                  value={formData.checkOut}
                  onChange={(e) => handleInputChange('checkOut', e.target.value)}
                  min={formData.checkIn || new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="guests" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Guests
              </Label>
              <Input
                id="guests"
                type="number"
                min="1"
                max={room.capacity}
                value={formData.guests}
                onChange={(e) => handleInputChange('guests', parseInt(e.target.value))}
              />
            </div>

            <div>
              <Label htmlFor="customerName">Full Name</Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={(e) => handleInputChange('customerName', e.target.value)}
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <Label htmlFor="customerEmail">Email</Label>
              <Input
                id="customerEmail"
                type="email"
                value={formData.customerEmail}
                onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                placeholder="Enter your email"
              />
            </div>

            {calculateNights() > 0 && (
              <div className="bg-accent/10 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span>{calculateNights()} nights</span>
                  <span className="font-bold text-lg">${calculateTotal()}</span>
                </div>
              </div>
            )}

            <Button 
              variant="luxury" 
              size="lg" 
              className="w-full" 
              onClick={handleNextStep}
              disabled={!isFormValid}
            >
              Continue to Payment
            </Button>
          </div>
        )}

        {step === 'payment' && (
          <div className="space-y-6">
            <div className="bg-gradient-subtle p-4 rounded-lg">
              <h3 className="font-semibold">{room.name}</h3>
              <p className="text-sm text-muted-foreground">
                {calculateNights()} nights • {formData.guests} guests
              </p>
              <p className="text-2xl font-bold text-foreground">${calculateTotal()}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <CreditCard className="w-5 h-5" />
                <span>Payment Simulation</span>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-lg text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  This is a demo payment process
                </p>
                <p className="font-semibold">Processing payment of ${calculateTotal()}</p>
              </div>
            </div>

            <Button 
              variant="gold" 
              size="lg" 
              className="w-full" 
              onClick={handleNextStep}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Complete Booking'}
            </Button>
          </div>
        )}

        {step === 'confirmation' && (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 bg-gradient-gold rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl">✓</span>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-foreground mb-2">Booking Confirmed!</h3>
              <p className="text-muted-foreground">
                Your reservation for {room.name} has been confirmed.
              </p>
            </div>

            <div className="bg-gradient-subtle p-4 rounded-lg text-left">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Guest:</span>
                  <span className="font-semibold">{formData.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Check-in:</span>
                  <span className="font-semibold">{new Date(formData.checkIn).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Check-out:</span>
                  <span className="font-semibold">{new Date(formData.checkOut).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span className="font-bold text-lg">${calculateTotal()}</span>
                </div>
              </div>
            </div>

            <Button variant="luxury" size="lg" className="w-full" onClick={resetModal}>
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};