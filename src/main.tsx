
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Use a try/catch block to help identify any initialization errors
try {
  const root = document.getElementById('root');
  if (!root) throw new Error('Root element not found');
  
  createRoot(root).render(<App />);
} catch (error) {
  console.error('Application failed to initialize:', error);
}
