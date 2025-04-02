
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AuthModal from '@/components/auth/AuthModal';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowRight, Image as ImageIcon, Zap, Shield } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // If user is logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  
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
                  Process Images
                </span>{' '}
                with Credit-Based System
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
        
        <section className="py-16 bg-gradient-to-b from-background to-muted/50">
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
                  Each processing uses one credit. Purchase more credits as needed.
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
                  <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
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
              © 2023 ImageMate. All rights reserved.
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
