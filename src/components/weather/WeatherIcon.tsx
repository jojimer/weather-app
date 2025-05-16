import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudSnow,
  CloudLightning,
  CloudFog,
  CloudDrizzle,
  Wind,
  MoonStar,
  CloudSun,
  CloudMoon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface WeatherIconProps {
  conditionCode: number;
  isDay?: boolean;
  size?: number;
  className?: string;
}

export function WeatherIcon({ 
  conditionCode, 
  isDay = true, 
  size = 24,
  className
}: WeatherIconProps) {
  const getIcon = () => {
    // Weather condition codes from WeatherAPI.com
    switch (conditionCode) {
      // Sunny or Clear
      case 1000:
        return isDay ? Sun : MoonStar;
      
      // Partly cloudy
      case 1003:
        return isDay ? CloudSun : CloudMoon;
      
      // Cloudy
      case 1006:
      case 1009:
        return Cloud;
      
      // Mist/Fog/Freezing fog
      case 1030:
      case 1135:
      case 1147:
        return CloudFog;
      
      // Patchy rain/Drizzle
      case 1063:
      case 1150:
      case 1153:
      case 1180:
      case 1183:
      case 1240:
        return CloudDrizzle;
      
      // Rain
      case 1186:
      case 1189:
      case 1192:
      case 1195:
      case 1243:
      case 1246:
        return CloudRain;
      
      // Snow
      case 1066:
      case 1114:
      case 1117:
      case 1210:
      case 1213:
      case 1216:
      case 1219:
      case 1222:
      case 1225:
      case 1237:
      case 1252:
      case 1255:
      case 1258:
      case 1261:
      case 1264:
        return CloudSnow;
      
      // Thunderstorm
      case 1087:
      case 1273:
      case 1276:
      case 1279:
      case 1282:
        return CloudLightning;
      
      // Windy
      case 1168:
      case 1171:
        return Wind;
      
      // Default
      default:
        return isDay ? Sun : MoonStar;
    }
  };

  const IconComponent = getIcon();

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <IconComponent 
        size={size} 
        strokeWidth={1.5}
        className="text-current"
        aria-hidden="true" 
      />
    </div>
  );
}