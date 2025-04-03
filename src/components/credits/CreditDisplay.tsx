
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger
} from '@/components/ui/dialog';
import { PlusCircle, Coins } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const CreditDisplay = () => {
  const { user, updateCredits } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleAddCredits = async (amount: number) => {
    if (!user || user.credits === undefined) return;
    
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      const newCredits = (user.credits || 0) + amount;
      await updateCredits(newCredits);
      setIsProcessing(false);
      setIsDialogOpen(false);
      toast.success(`Added ${amount} credits to your account`);
    } catch (err) {
      setIsProcessing(false);
      toast.error('Failed to add credits');
    }
  };

  if (!user || user.credits === undefined) return null;

  return (
    <div className="flex items-center">
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 rounded-full mr-2">
        <Coins className="h-4 w-4 text-primary" />
        <span className="font-medium text-sm">{user.credits} credits</span>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <PlusCircle className="h-4 w-4" />
            <span>Add</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Credits</DialogTitle>
            <DialogDescription>
              Purchase credits to process more images.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            <Button 
              variant="outline" 
              className="flex flex-col p-6 h-auto"
              onClick={() => handleAddCredits(10)}
              disabled={isProcessing}
            >
              <span className="text-2xl font-bold">10</span>
              <span className="text-muted-foreground">€9.99</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex flex-col p-6 h-auto"
              onClick={() => handleAddCredits(25)}
              disabled={isProcessing}
            >
              <span className="text-2xl font-bold">25</span>
              <span className="text-muted-foreground">€19.99</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex flex-col p-6 h-auto"
              onClick={() => handleAddCredits(50)}
              disabled={isProcessing}
            >
              <span className="text-2xl font-bold">50</span>
              <span className="text-muted-foreground">€34.99</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex flex-col p-6 h-auto border-primary"
              onClick={() => handleAddCredits(100)}
              disabled={isProcessing}
            >
              <div className="absolute -top-1 -right-1 bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                Best Value
              </div>
              <span className="text-2xl font-bold">100</span>
              <span className="text-muted-foreground">€59.99</span>
            </Button>
          </div>
          
          <DialogFooter>
            <Button 
              variant="ghost" 
              onClick={() => setIsDialogOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreditDisplay;
