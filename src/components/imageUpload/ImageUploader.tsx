
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import AuthModal from '../auth/AuthModal';
import { processImage } from '@/lib/image-service';

interface ImageUploaderProps {
  onUploadSuccess: (imageData: any) => void;
}

const ImageUploader = ({ onUploadSuccess }: ImageUploaderProps) => {
  const { user, updateCredits } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFile: File) => {
    // Reset previous state
    setError(null);
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(selectedFile.type)) {
      setError('Please upload a valid image file (JPG, PNG, WEBP)');
      return;
    }
    
    // Validate file size (5MB max)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }
    
    setFile(selectedFile);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleUpload = async () => {
    if (!file || !user || user.credits === undefined) return;
    
    if (!user) {
      toast.error('Please log in to upload images');
      return;
    }
    
    if (user.credits < 1) {
      toast.error('Not enough credits. Please add more credits to continue.');
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Process the image and deduct credit
      const result = await processImage(file);
      
      // Update credits
      updateCredits((user.credits || 0) - 1);
      
      // Pass the uploaded data to parent component
      onUploadSuccess(result);
      
      // Reset form
      clearFile();
      
      toast.success('Image uploaded and processing started');
    } catch (err) {
      toast.error('Failed to upload image');
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };
  
  const renderUploadZone = () => {
    if (preview) {
      return (
        <div className="relative rounded-lg overflow-hidden h-48">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-full object-cover"
          />
          <Button
            size="icon"
            variant="destructive"
            className="absolute top-2 right-2"
            onClick={clearFile}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      );
    }
    
    return (
      <div
        className={`image-upload-drop ${isDragging ? 'active' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="p-3 rounded-full bg-primary/10">
            <Upload className="h-6 w-6 text-primary" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium mb-1">Drag & drop an image or click to browse</p>
            <p className="text-xs text-muted-foreground">
              Supports JPG, PNG, WEBP (max 5MB)
            </p>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/jpeg,image/png,image/jpg,image/webp"
          onChange={handleInputChange}
        />
      </div>
    );
  };
  
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-medium">Upload New Image</h3>
              <p className="text-sm text-muted-foreground">
                Each upload costs 1 credit
              </p>
            </div>
            {user && user.credits !== undefined && (
              <div className="text-sm text-muted-foreground">
                {user.credits} credits available
              </div>
            )}
          </div>
          
          {renderUploadZone()}
          
          {error && (
            <div className="flex items-center gap-2 text-destructive text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}
          
          {user ? (
            <Button 
              className="w-full"
              onClick={handleUpload}
              disabled={!file || isUploading || (user.credits !== undefined && user.credits < 1)}
            >
              {isUploading ? 'Processing...' : 'Upload & Process Image'}
            </Button>
          ) : (
            <AuthModal 
              trigger={
                <Button className="w-full">
                  Login to Upload
                </Button>
              }
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageUploader;
