
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';
import { ProcessedImage } from '@/types/image';

interface ImageDetailDialogProps {
  image: ProcessedImage | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ImageDetailDialog = ({ image, open, onOpenChange }: ImageDetailDialogProps) => {
  if (!image) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{image.filename}</DialogTitle>
          <DialogDescription>
            Uploaded on {new Date(image.createdAt).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Original Image</h3>
            <div className="rounded-md overflow-hidden border bg-muted">
              <img
                src={image.originalUrl}
                alt="Original"
                className="w-full h-auto object-contain max-h-[400px]"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Processed Image</h3>
            <div className="rounded-md overflow-hidden border bg-muted">
              {image.status === 'completed' ? (
                <img
                  src={image.processedUrl}
                  alt="Processed"
                  className="w-full h-auto object-contain max-h-[400px]"
                />
              ) : (
                <div className="flex items-center justify-center h-full min-h-[200px]">
                  {image.status === 'processing' ? (
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                      <p className="text-sm text-muted-foreground">Processing your image...</p>
                    </div>
                  ) : (
                    <p className="text-destructive">Processing failed</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
          
          {image.status === 'completed' && (
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageDetailDialog;
