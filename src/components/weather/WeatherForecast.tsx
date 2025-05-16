import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { WeatherIcon } from './WeatherIcon';
import { useWeather } from '@/contexts/WeatherContext';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export function WeatherForecast() {
  const { weatherData, loading, error, units } = useWeather();

  if (loading) {
    return (
      <Card className="w-full mx-auto mt-4">
        <CardHeader>
          <CardTitle><Skeleton className="h-8 w-32" /></CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error || !weatherData) {
    return null;
  }

  const { forecast } = weatherData;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="w-full mx-auto mt-4">
        <CardHeader>
          <CardTitle>5-Day Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="daily" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="hourly">Hourly</TabsTrigger>
            </TabsList>
            
            <TabsContent value="daily">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-4">
                {forecast.forecastday.map((day) => {
                  const date = new Date(day.date);
                  const isToday = new Date().toDateString() === date.toDateString();
                  const maxTemp = units === 'metric' ? day.day.maxtemp_c : day.day.maxtemp_f;
                  const minTemp = units === 'metric' ? day.day.mintemp_c : day.day.mintemp_f;
                  const tempUnit = units === 'metric' ? '°C' : '°F';
                  
                  return (
                    <motion.div
                      key={day.date}
                      whileHover={{ scale: 1.03 }}
                      className={cn(
                        "bg-card p-3 rounded-lg border border-border/50",
                        isToday && "bg-primary/5 border-primary/30"
                      )}
                    >
                      <div className="text-center">
                        <p className="font-medium">
                          {isToday ? 'Today' : format(date, 'EEE')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(date, 'MMM d')}
                        </p>
                        
                        <div className="my-3 flex justify-center">
                          <WeatherIcon 
                            conditionCode={day.day.condition.code} 
                            size={36} 
                          />
                        </div>
                        
                        <p className="text-xs text-center text-muted-foreground">
                          {day.day.condition.text}
                        </p>
                        
                        <div className="mt-2 flex justify-between items-center px-2">
                          <span className="font-medium">
                            {Math.round(maxTemp)}{tempUnit}
                          </span>
                          <span className="text-muted-foreground text-sm">
                            {Math.round(minTemp)}{tempUnit}
                          </span>
                        </div>
                        
                        <div className="mt-2 text-xs grid grid-cols-2 gap-1">
                          <div className="text-left text-muted-foreground">
                            Humidity:
                          </div>
                          <div className="text-right">
                            {day.day.avghumidity}%
                          </div>
                          <div className="text-left text-muted-foreground">
                            UV Index:
                          </div>
                          <div className="text-right">
                            {day.day.uv}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </TabsContent>
            
            <TabsContent value="hourly">
              <div className="mt-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {forecast.forecastday[0].hour
                    .filter((_, index) => index % 2 === 0) // Show every 2 hours
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
                          className={cn(
                            "flex flex-col items-center p-3 rounded-lg border border-border/50",
                            isPast && !isCurrent && "opacity-60",
                            isCurrent && "bg-primary/5 border-primary/30"
                          )}
                        >
                          <p className="text-sm font-medium">
                            {format(hourTime, 'h a')}
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
                          <p className="text-xs text-muted-foreground mt-1">
                            {hour.chance_of_rain > 0 && `${hour.chance_of_rain}% 💧`}
                          </p>
                        </motion.div>
                      );
                    })}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}