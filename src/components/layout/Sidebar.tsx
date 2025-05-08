import React from 'react';
import { useWeather } from '@/contexts/WeatherContext';
import { Button } from '@/components/ui/button';
import { MapPin, Star, X } from 'lucide-react';
import { motion } from 'framer-motion';

export function Sidebar() {
  const { favorites, setLocation, removeFavorite } = useWeather();

  if (favorites.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="hidden lg:block w-64 border-r border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4"
    >
      <div className="flex items-center gap-2 mb-4">
        <Star className="w-4 h-4 text-primary" />
        <h2 className="font-semibold">Favorite Locations</h2>
      </div>
      
      <div className="space-y-2">
        {favorites.map((favorite) => (
          <div
            key={favorite.id}
            className="group flex items-center justify-between p-2 rounded-md hover:bg-accent transition-colors"
          >
            <Button
              variant="ghost"
              className="flex-1 justify-start gap-2 px-2 h-auto font-normal"
              onClick={() => setLocation(favorite.name)}
            >
              <MapPin className="w-4 h-4" />
              {favorite.name}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => removeFavorite(favorite.id)}
            >
              <X className="w-4 h-4" />
              <span className="sr-only">Remove {favorite.name}</span>
            </Button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}