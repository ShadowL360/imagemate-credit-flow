import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AppHeader from '@/components/layout/AppHeader';
import ImageUploader from '@/components/imageUpload/ImageUploader';
import HistoryList from '@/components/processHistory/HistoryList';
import ImageDetailDialog from '@/components/imageUpload/ImageDetailDialog';
import { getUserImages, deleteImage } from '@/lib/image-service';
import { ProcessedImage } from '@/types/image';
import { toast } from 'sonner';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [images, setImages] = useState<ProcessedImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<ProcessedImage | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);
  
  // Get user images
  useEffect(() => {
    if (user) {
      // In a real app, this would fetch from an API
      const userImages = getUserImages();
      setImages(userImages);
    }
  }, [user]);
  
  const handleUploadSuccess = (imageData: ProcessedImage) => {
    setImages(prev => [imageData, ...prev]);
    
    // Set up polling to check for processing status
    const pollInterval = setInterval(() => {
      const updatedImages = getUserImages();
      const updatedImage = updatedImages.find(img => img.id === imageData.id);
      
      if (updatedImage?.status !== 'processing') {
        clearInterval(pollInterval);
        setImages(updatedImages);
        
        if (updatedImage?.status === 'completed') {
          toast.success('Image processing completed!');
        } else if (updatedImage?.status === 'failed') {
          toast.error('Image processing failed. Please try again.');
        }
      }
    }, 2000); // Poll every 2 seconds
    
    // Clean up interval on component unmount
    return () => clearInterval(pollInterval);
  };
  
  const handleDeleteImage = (id: string) => {
    deleteImage(id);
    setImages(prev => prev.filter(img => img.id !== id));
    toast.success('Image deleted');
  };
  
  const handleViewImage = (image: ProcessedImage) => {
    setSelectedImage(image);
    setIsDetailOpen(true);
  };
  
  // Add a function to handle password reset
  function handlePasswordReset() {
    // Get the "reset" query parameter from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const resetParam = urlParams.get('reset');
    
    // If the "reset" parameter is present, show a toast notifying the user they can reset their password
    if (resetParam === 'true') {
      toast.info("You can now reset your password in your account settings");
    }
  }
  
  // Call the handlePasswordReset function when the component mounts
  useEffect(() => {
    handlePasswordReset();
  }, []);
  
  if (!user) return null;
  
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome, {user.name || user.email?.split('@')[0]}</h1>
          <p className="text-muted-foreground">
            Upload images for processing using your credits
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <ImageUploader onUploadSuccess={handleUploadSuccess} />
          </div>
          
          <div className="lg:col-span-2">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Processing History</h2>
            </div>
            <HistoryList 
              images={images}
              onDelete={handleDeleteImage}
              onView={handleViewImage}
            />
          </div>
        </div>
      </main>
      
      <ImageDetailDialog 
        image={selectedImage}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />
    </div>
  );
};

export default Dashboard;
