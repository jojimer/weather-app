import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Droplets, 
  Wind, 
  Compass, 
  Thermometer, 
  Sun, 
  Moon, 
  CloudRain,
  Gauge,
  Eye
} from 'lucide-react';
import { useWeather } from '@/contexts/WeatherContext';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export function WeatherDetails() {
  const { weatherData, loading, error, units } = useWeather();

  if (loading) {
    return (
      <Card className="w-full mx-auto mt-4">
        <CardHeader>
          <CardTitle><Skeleton className="h-8 w-32" /></CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array(8)
              .fill(null)
              .map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !weatherData) {
    return null;
  }

  const { current, forecast } = weatherData;
  const today = forecast.forecastday[0];
  
  // Convert values based on selected units
  const pressure = units === 'metric' ? current.pressure_mb : current.pressure_in;
  const pressureUnit = units === 'metric' ? 'mb' : 'in';
  const wind = units === 'metric' ? current.wind_kph : current.wind_mph;
  const windUnit = units === 'metric' ? 'km/h' : 'mph';
  const visibility = units === 'metric' ? current.vis_km : current.vis_miles;
  const visibilityUnit = units === 'metric' ? 'km' : 'mi';
  const precipitation = units === 'metric' ? current.precip_mm : current.precip_in;
  const precipitationUnit = units === 'metric' ? 'mm' : 'in';

  // Get air quality level
  const getAirQualityLevel = () => {
    if (!current.air_quality) return 'Unavailable';
    
    const aqi = current.air_quality['us-epa-index'];
    switch (aqi) {
      case 1: return 'Good';
      case 2: return 'Moderate';
      case 3: return 'Unhealthy for Sensitive Groups';
      case 4: return 'Unhealthy';
      case 5: return 'Very Unhealthy';
      case 6: return 'Hazardous';
      default: return 'Unavailable';
    }
  };

  // Get air quality color
  const getAirQualityColor = () => {
    if (!current.air_quality) return 'text-muted-foreground';
    
    const aqi = current.air_quality['us-epa-index'];
    switch (aqi) {
      case 1: return 'text-green-500';
      case 2: return 'text-yellow-500';
      case 3: return 'text-orange-500';
      case 4: return 'text-red-500';
      case 5: return 'text-purple-500';
      case 6: return 'text-rose-900';
      default: return 'text-muted-foreground';
    }
  };

  const detailItems = [
    { 
      icon: Thermometer, 
      label: 'Feels Like', 
      value: units === 'metric' ? current.feelslike_c : current.feelslike_f, 
      unit: units === 'metric' ? '°C' : '°F' 
    },
    { 
      icon: Droplets, 
      label: 'Humidity', 
      value: current.humidity, 
      unit: '%' 
    },
    { 
      icon: Wind, 
      label: 'Wind', 
      value: wind, 
      unit: windUnit 
    },
    { 
      icon: Compass, 
      label: 'Wind Direction', 
      value: current.wind_dir, 
      unit: '' 
    },
    { 
      icon: Gauge, 
      label: 'Pressure', 
      value: pressure, 
      unit: pressureUnit 
    },
    { 
      icon: Eye, 
      label: 'Visibility', 
      value: visibility, 
      unit: visibilityUnit 
    },
    { 
      icon: CloudRain, 
      label: 'Precipitation', 
      value: precipitation, 
      unit: precipitationUnit 
    },
    { 
      icon: Sun, 
      label: 'UV Index', 
      value: current.uv, 
      unit: '' 
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="w-full mx-auto mt-4">
        <CardHeader>
          <CardTitle>Weather Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {detailItems.map((item, index) => (
              <motion.div
                key={item.label}
                whileHover={{ scale: 1.05 }}
                className="bg-card rounded-lg p-4 border border-border/50 flex flex-col items-center justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <item.icon className="h-6 w-6 mb-2 text-primary" />
                <h3 className="text-sm font-medium">{item.label}</h3>
                <p className="text-2xl font-bold mt-1">
                  {typeof item.value === 'number' ? Math.round(item.value) : item.value}
                  <span className="text-sm font-normal ml-1">{item.unit}</span>
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card rounded-lg p-4 border border-border/50">
              <h3 className="text-sm font-medium flex items-center">
                <Sun className="h-4 w-4 mr-2 text-amber-500" />
                Sunrise & Sunset
              </h3>
              <div className="mt-4 flex justify-between items-center">
                <div className="flex flex-col items-center">
                  <Sun className="h-8 w-8 text-amber-500 mb-2" />
                  <p className="text-sm text-muted-foreground">Sunrise</p>
                  <p className="text-lg font-semibold">{today.astro.sunrise}</p>
                </div>
                <div className="h-0.5 flex-1 mx-4 bg-gradient-to-r from-amber-500 to-indigo-600 rounded-full opacity-30" />
                <div className="flex flex-col items-center">
                  <Moon className="h-8 w-8 text-indigo-600 mb-2" />
                  <p className="text-sm text-muted-foreground">Sunset</p>
                  <p className="text-lg font-semibold">{today.astro.sunset}</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg p-4 border border-border/50">
              <h3 className="text-sm font-medium">Air Quality</h3>
              <div className="mt-4">
                <p className={cn("text-lg font-semibold", getAirQualityColor())}>
                  {getAirQualityLevel()}
                </p>
                
                {current.air_quality && (
                  <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div className="text-muted-foreground">PM2.5:</div>
                    <div>{Math.round(current.air_quality.pm2_5)}</div>
                    <div className="text-muted-foreground">PM10:</div>
                    <div>{Math.round(current.air_quality.pm10)}</div>
                    <div className="text-muted-foreground">Ozone:</div>
                    <div>{Math.round(current.air_quality.o3)}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}