import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { WalletProvider } from './WalletContext';
import 'typeface-jetbrains-mono';



createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <WalletProvider>
    <App />
  </WalletProvider>
  // </StrictMode>
);
