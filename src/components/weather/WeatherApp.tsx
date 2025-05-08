import React from 'react';
import { WeatherCard } from './WeatherCard';
import { WeatherForecast } from './WeatherForecast';
import { WeatherDetails } from './WeatherDetails';
import { LocationSearch } from './LocationSearch';
import { useWeather } from '@/contexts/WeatherContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { WeatherIcon } from './WeatherIcon';

export function WeatherApp() {
  const { view, setView, error, loading, refreshWeather, weatherData, units } = useWeather();

  // Render error state
  if (error) {
    return (
      <div className="py-8">
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshWeather}
              disabled={loading}
            >
              <RefreshCw className={loading ? "animate-spin mr-2 h-4 w-4" : "mr-2 h-4 w-4"} />
              Retry
            </Button>
          </AlertDescription>
        </Alert>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Search for a location</h2>
            <LocationSearch />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-8">
      <Tabs value={view} onValueChange={(v) => setView(v as any)} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 p-1 gap-1">
          <TabsTrigger value="summary" className="px-2 sm:px-6 py-2">Summary</TabsTrigger>
          <TabsTrigger value="detailed" className="px-2 sm:px-6 py-2">Detailed</TabsTrigger>
          <TabsTrigger value="forecast" className="px-2 sm:px-6 py-2">Forecast</TabsTrigger>
          <TabsTrigger value="hourly" className="px-2 sm:px-6 py-2">Hourly</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <WeatherCard />
            <WeatherForecast />
          </motion.div>
        </TabsContent>
        
        <TabsContent value="detailed">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <WeatherCard />
            <WeatherDetails />
          </motion.div>
        </TabsContent>
        
        <TabsContent value="forecast">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <WeatherForecast />
          </motion.div>
        </TabsContent>
        
        <TabsContent value="hourly">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Hourly Forecast</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {weatherData?.forecast.forecastday[0].hour
                    .filter((_, index) => index % 2 === 0)
                    .map((hour) => {
                      const hourTime = new Date(hour.time);
                      const temp = units === 'metric' ? hour.temp_c : hour.temp_f;
                      const tempUnit = units === 'metric' ? '°C' : '°F';
                      const now = new Date();
                      const isPast = hourTime < now;
                      const isCurrent = 
                        hourTime <= new Date(now.getTime() + 60 * 60 * 1000) && 
                        hourTime >= new Date(now.getTime() - 60 * 60 * 1000);

                      return (
                        <motion.div
                          key={hour.time}
                          whileHover={{ scale: 1.03 }}
                          className={`flex flex-col items-center p-3 rounded-lg border ${
                            isPast && !isCurrent ? 'opacity-60' : ''
                          } ${
                            isCurrent ? 'bg-primary/5 border-primary/30' : 'border-border/50'
                          }`}
                        >
                          <p className="text-sm font-medium">
                            {hourTime.toLocaleTimeString([], { hour: 'numeric' })}
                          </p>
                          <div className="my-2">
                            <WeatherIcon 
                              conditionCode={hour.condition.code} 
                              isDay={hour.is_day === 1}
                              size={28} 
                            />
                          </div>
                          <p className="font-medium text-sm">
                            {Math.round(temp)}{tempUnit}
                          </p>
                          {hour.chance_of_rain > 0 && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {hour.chance_of_rain}% 💧
                            </p>
                          )}
                        </motion.div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}