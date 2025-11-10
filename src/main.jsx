import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { MusicProvider } from './context/MusicContext.jsx';
import { PlayerProvider } from './context/PlayerContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <MusicProvider>
        <PlayerProvider>
          <App />
        </PlayerProvider>
      </MusicProvider>
    </BrowserRouter>
  </React.StrictMode>
);


