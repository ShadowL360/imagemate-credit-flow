
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Download, Eye, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { ProcessedImage } from '@/types/image';
import { formatDistanceToNow } from 'date-fns';

interface HistoryListProps {
  images: ProcessedImage[];
  onDelete: (id: string) => void;
  onView: (image: ProcessedImage) => void;
}

const HistoryList = ({ images, onDelete, onView }: HistoryListProps) => {
  if (images.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 flex flex-col items-center justify-center text-center h-48">
          <div className="p-3 rounded-full bg-muted mb-3">
            <Clock className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-1">No processed images yet</h3>
          <p className="text-sm text-muted-foreground">
            Images you process will appear here
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {images.map((image) => (
        <Card key={image.id} className="overflow-hidden">
          <div className="flex flex-col sm:flex-row">
            <div className="w-full sm:w-32 h-32 relative bg-muted">
              <img
                src={image.thumbnailUrl || image.originalUrl}
                alt={image.filename}
                className="w-full h-full object-cover"
              />
              {image.status === 'processing' && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="animate-pulse-slow text-white text-sm font-medium">
                    Processing...
                  </div>
                </div>
              )}
            </div>
            
            <CardContent className="flex-1 p-4">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div className="truncate font-medium pr-2">
                      {image.filename}
                    </div>
                    <StatusBadge status={image.status} />
                  </div>
                  
                  <div className="text-sm text-muted-foreground mb-2">
                    Uploaded {formatDistanceToNow(new Date(image.createdAt), { addSuffix: true })}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8"
                    onClick={() => onView(image)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  
                  {image.status === 'completed' && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  )}
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 text-muted-foreground hover:text-destructive"
                    onClick={() => onDelete(image.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
      ))}
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'completed':
      return <Badge variant="default" className="bg-green-600">Completed</Badge>;
    case 'processing':
      return <Badge variant="outline" className="animate-pulse border-blue-400 text-blue-600">Processing</Badge>;
    case 'failed':
      return <Badge variant="destructive">Failed</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export default HistoryList;
