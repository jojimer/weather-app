import React from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { WeatherProvider } from '@/contexts/WeatherContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Sidebar } from '@/components/layout/Sidebar';
import { WeatherApp } from '@/components/weather/WeatherApp';

function App() {
  return (
    <ThemeProvider>
      <WeatherProvider>
        <div className="min-h-screen w-full flex flex-col bg-background">
          <Header />
          <div className="flex-1 w-full flex">
            <Sidebar />
            <main className="flex-1 w-full overflow-x-hidden">
              <div className="max-w-5xl mx-auto px-4">
                <WeatherApp />
              </div>
            </main>
          </div>
          <Footer />
        </div>
      </WeatherProvider>
    </ThemeProvider>
  );
}

export default App;