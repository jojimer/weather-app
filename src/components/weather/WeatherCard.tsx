import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { WeatherIcon } from './WeatherIcon';
import { useWeather } from '@/contexts/WeatherContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Wind, Droplets, Thermometer } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export function WeatherCard() {
  const { weatherData, loading, error, units, addFavorite, favorites } = useWeather();

  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-16 w-16 rounded-full" />
            </div>
            <Skeleton className="h-24 w-full" />
            <div className="grid grid-cols-3 gap-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-md mx-auto bg-destructive/10">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-destructive">Error Loading Weather</h3>
            <p className="text-sm mt-2">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!weatherData) {
    return null;
  }

  const { location, current } = weatherData;
  const temperature = units === 'metric' ? current.temp_c : current.temp_f;
  const feelsLike = units === 'metric' ? current.feelslike_c : current.feelslike_f;
  const wind = units === 'metric' ? current.wind_kph : current.wind_mph;
  const windUnit = units === 'metric' ? 'km/h' : 'mph';
  
  const isLocationFavorited = favorites.some(
    (fav) => fav.name === location.name
  );

  // Get background gradient based on weather condition and time of day
  const getBackgroundClass = () => {
    const isDay = current.is_day === 1;
    const conditionCode = current.condition.code;
    
    // Clear or sunny
    if (conditionCode === 1000) {
      return isDay 
        ? 'bg-gradient-to-br from-blue-400 to-blue-600' 
        : 'bg-gradient-to-br from-indigo-900 to-purple-900';
    }
    
    // Partly cloudy
    if (conditionCode === 1003) {
      return isDay 
        ? 'bg-gradient-to-br from-blue-300 to-blue-500' 
        : 'bg-gradient-to-br from-indigo-800 to-purple-800';
    }
    
    // Cloudy
    if (conditionCode === 1006 || conditionCode === 1009) {
      return isDay 
        ? 'bg-gradient-to-br from-blue-300 to-gray-400' 
        : 'bg-gradient-to-br from-gray-700 to-gray-900';
    }
    
    // Rain
    if ([1063, 1150, 1153, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246].includes(conditionCode)) {
      return isDay 
        ? 'bg-gradient-to-br from-blue-400 to-gray-500' 
        : 'bg-gradient-to-br from-blue-900 to-gray-800';
    }
    
    // Snow
    if ([1066, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1237, 1252, 1255, 1258, 1261, 1264].includes(conditionCode)) {
      return isDay 
        ? 'bg-gradient-to-br from-blue-50 to-blue-200' 
        : 'bg-gradient-to-br from-blue-800 to-blue-950';
    }
    
    // Thunderstorm
    if ([1087, 1273, 1276, 1279, 1282].includes(conditionCode)) {
      return isDay 
        ? 'bg-gradient-to-br from-gray-600 to-gray-800' 
        : 'bg-gradient-to-br from-gray-800 to-gray-950';
    }
    
    // Default
    return isDay 
      ? 'bg-gradient-to-br from-blue-400 to-blue-600' 
      : 'bg-gradient-to-br from-indigo-900 to-purple-900';
  };

  const handleAddFavorite = () => {
    if (!isLocationFavorited) {
      addFavorite({
        id: `${location.lat}-${location.lon}`,
        name: location.name,
        lat: location.lat,
        lon: location.lon,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <Card className={cn(
        "w-full max-w-md mx-auto overflow-hidden backdrop-blur-sm border-none shadow-xl",
        "dark:shadow-blue-900/20",
        getBackgroundClass()
      )}>
        <CardContent className="p-6 text-white">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">{location.name}</h2>
                {!isLocationFavorited && (
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10" 
                    onClick={handleAddFavorite}
                  >
                    <Star className="h-4 w-4" />
                    <span className="sr-only">Add to favorites</span>
                  </Button>
                )}
              </div>
              <p className="text-sm text-white/80">{location.region}, {location.country}</p>
              <Badge variant="outline" className="mt-2 bg-white/10 text-white border-none">
                {new Date(location.localtime).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </Badge>
            </div>
            <div className="flex items-center">
              <WeatherIcon 
                conditionCode={current.condition.code} 
                isDay={current.is_day === 1}
                size={48}
                className="text-white"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-center mb-6">
            <div className="text-center">
              <h1 className="text-6xl font-bold mb-2">
                {Math.round(temperature)}°{units === 'metric' ? 'C' : 'F'}
              </h1>
              <p className="text-xl text-white/90 mb-1">{current.condition.text}</p>
              <p className="text-sm text-white/80">
                Feels like {Math.round(feelsLike)}°{units === 'metric' ? 'C' : 'F'}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center justify-center bg-white/10 rounded-lg p-3">
              <Wind className="h-5 w-5 mb-2" />
              <span className="text-sm font-medium">Wind</span>
              <span className="text-xs">
                {Math.round(wind)} {windUnit}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center bg-white/10 rounded-lg p-3">
              <Droplets className="h-5 w-5 mb-2" />
              <span className="text-sm font-medium">Humidity</span>
              <span className="text-xs">{current.humidity}%</span>
            </div>
            <div className="flex flex-col items-center justify-center bg-white/10 rounded-lg p-3">
              <Thermometer className="h-5 w-5 mb-2" />
              <span className="text-sm font-medium">UV Index</span>
              <span className="text-xs">{current.uv}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}