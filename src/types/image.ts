
export interface ProcessedImage {
  id: string;
  userId: string;
  filename: string;
  originalUrl: string;
  processedUrl?: string;
  thumbnailUrl?: string;
  status: 'processing' | 'completed' | 'failed';
  processingStartedAt: string;
  processingCompletedAt?: string;
  createdAt: string;
  updatedAt: string;
}
