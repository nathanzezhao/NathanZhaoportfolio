import { createRoot } from 'react-dom/client';
import './screen.css';
import App from './WheelPage.jsx';
import { Analytics } from '@vercel/analytics/react';

createRoot(document.getElementById('root')).render(
  <>
    <App />
    <Analytics />
  </>
);
