
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AuthModal from '@/components/auth/AuthModal';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowRight, Image as ImageIcon, Zap, Shield } from 'lucide-react';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious 
} from '@/components/ui/carousel';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Image transformation examples
  const transformationExamples = [
    {
      original: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=800&h=600",
      transformed: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=800&h=600&blend=111827&blend-mode=normal&sat=-100",
      title: "Monochromatic Effect"
    },
    {
      original: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&h=600",
      transformed: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&h=600&blur=50",
      title: "Blur Effect"
    },
    {
      original: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&h=600",
      transformed: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&h=600&duotone=6366f1,1e3a8a",
      title: "Duotone Effect"
    }
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container flex items-center justify-between h-16">
          <div className="font-bold text-xl flex items-center">
            <span className="bg-gradient-to-r from-imagemate-purple to-imagemate-blue bg-clip-text text-transparent">
              ImageMate
            </span>
          </div>
          
          <div>
            <AuthModal />
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        <section className="py-20 md:py-28">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-imagemate-purple to-imagemate-blue bg-clip-text text-transparent">
                  Transform Images
                </span>{' '}
                with Our Credit System
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8">
                Upload, process, and transform your images easily with our credit-based processing system.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <AuthModal 
                  trigger={
                    <Button size="lg" className="gap-2">
                      Get Started
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  }
                />
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* New demonstration carousel section */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-4">See What We Can Do</h2>
            <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
              Transform your images with our powerful processing features. Check out some examples below:
            </p>
            
            <div className="max-w-4xl mx-auto px-8">
              <Carousel className="w-full">
                <CarouselContent>
                  {transformationExamples.map((example, index) => (
                    <CarouselItem key={index} className="md:basis-1/2">
                      <div className="p-2">
                        <div className="rounded-lg overflow-hidden shadow-lg bg-card">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                            <div>
                              <p className="text-sm font-medium mb-2 text-muted-foreground">Original</p>
                              <AspectRatio ratio={4/3} className="bg-muted rounded-md overflow-hidden">
                                <img 
                                  src={example.original} 
                                  alt="Original image" 
                                  className="object-cover w-full h-full"
                                />
                              </AspectRatio>
                            </div>
                            <div>
                              <p className="text-sm font-medium mb-2 text-muted-foreground">Transformed</p>
                              <AspectRatio ratio={4/3} className="bg-muted rounded-md overflow-hidden">
                                <img 
                                  src={example.transformed} 
                                  alt="Transformed image" 
                                  className="object-cover w-full h-full"
                                />
                              </AspectRatio>
                            </div>
                          </div>
                          <div className="p-4 border-t">
                            <h3 className="font-medium">{example.title}</h3>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="hidden md:block">
                  <CarouselPrevious className="left-0" />
                  <CarouselNext className="right-0" />
                </div>
              </Carousel>
            </div>
          </div>
        </section>
        
        <section className="py-16">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <ImageIcon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Upload Images</h3>
                <p className="text-muted-foreground">
                  Upload your images through our simple and intuitive interface.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Process & Transform</h3>
                <p className="text-muted-foreground">
                  Our system automatically processes your images in the background.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Credit System</h3>
                <p className="text-muted-foreground">
                  Each processing uses a credit. Buy more credits as needed.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16">
          <div className="container">
            <div className="bg-card rounded-lg shadow-lg overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <h2 className="text-3xl font-bold mb-4">Ready to Start?</h2>
                  <p className="text-muted-foreground mb-6">
                    Create an account and get 3 free credits to test our service.
                  </p>
                  <div>
                    <AuthModal 
                      defaultView="register"
                      trigger={
                        <Button size="lg">
                          Create Free Account
                        </Button>
                      }
                    />
                  </div>
                </div>
                <div className="bg-gradient-to-br from-imagemate-purple to-imagemate-blue p-8 md:p-12 text-white">
                  <h3 className="text-2xl font-bold mb-6">Benefits</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="mr-3 mt-1">✓</div>
                      <p>Fast background processing</p>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-3 mt-1">✓</div>
                      <p>Secure image storage</p>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-3 mt-1">✓</div>
                      <p>Download processed results</p>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-3 mt-1">✓</div>
                      <p>Flexible credit system</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="border-t py-6">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="font-medium mb-4 md:mb-0">
              © 2024 ImageMate. All rights reserved.
            </div>
            <div className="flex gap-4">
              <Button variant="link" size="sm">Terms</Button>
              <Button variant="link" size="sm">Privacy</Button>
              <Button variant="link" size="sm">Contact</Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
