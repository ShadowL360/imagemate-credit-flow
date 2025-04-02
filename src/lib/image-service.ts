
import { ProcessedImage } from '@/types/image';
import { v4 as uuidv4 } from 'uuid';

// Mock data storage
let mockImages: ProcessedImage[] = [];
const currentTimestamp = new Date().toISOString();

// Process an image and return a Promise
export const processImage = async (file: File): Promise<ProcessedImage> => {
  // Create a new image entry
  const newImage: ProcessedImage = {
    id: uuidv4(),
    userId: 'current-user-id', // In a real app, this would be the actual user ID
    filename: file.name,
    originalUrl: URL.createObjectURL(file),
    status: 'processing',
    processingStartedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  // Add to mock database
  mockImages = [newImage, ...mockImages];
  
  // Simulate processing delay
  const processingPromise = new Promise<ProcessedImage>((resolve) => {
    setTimeout(() => {
      // Update the image status to completed
      const updatedImage = {
        ...newImage,
        status: 'completed',
        processedUrl: newImage.originalUrl, // In a real app, this would be the processed image URL
        thumbnailUrl: newImage.originalUrl, // In a real app, this would be a thumbnail
        processingCompletedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Update in mock database
      mockImages = mockImages.map(img => 
        img.id === updatedImage.id ? updatedImage : img
      );
      
      resolve(updatedImage);
    }, 5000); // 5 second delay to simulate processing
  });
  
  return newImage;
};

// Get all images for the current user
export const getUserImages = (): ProcessedImage[] => {
  return mockImages;
};

// Delete an image
export const deleteImage = (imageId: string): void => {
  mockImages = mockImages.filter(img => img.id !== imageId);
};

// Update image processing status (for demonstration)
export const updateImageStatus = (imageId: string, status: 'processing' | 'completed' | 'failed'): ProcessedImage | undefined => {
  const imageIndex = mockImages.findIndex(img => img.id === imageId);
  
  if (imageIndex === -1) return undefined;
  
  const updatedImage = {
    ...mockImages[imageIndex],
    status,
    updatedAt: new Date().toISOString(),
  };
  
  if (status === 'completed') {
    updatedImage.processingCompletedAt = new Date().toISOString();
  }
  
  mockImages[imageIndex] = updatedImage;
  return updatedImage;
};
