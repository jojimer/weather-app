import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useWeather } from '@/contexts/WeatherContext';
import { Settings, Thermometer, LayoutDashboard } from 'lucide-react';

export function Footer() {
  const { units, setUnits, view, setView } = useWeather();

  const viewOptions = [
    { value: 'summary', label: 'Summary', icon: LayoutDashboard },
    { value: 'detailed', label: 'Detailed', icon: LayoutDashboard },
    { value: 'forecast', label: 'Forecast', icon: LayoutDashboard },
    { value: 'hourly', label: 'Hourly', icon: LayoutDashboard },
  ];

  return (
    <footer className="sticky bottom-0 z-50 w-full border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-14 items-center md:justify-between justify-center">
          <div className="hidden md:block text-xs text-muted-foreground">
            <p>© 2025 Weather Hub. Powered by WeatherAPI.com</p>
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Thermometer className="w-4 h-4 mr-2" />
                  {units === 'metric' ? 'Metric (°C)' : 'Imperial (°F)'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Temperature Units</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => setUnits('metric')}
                  className={units === 'metric' ? "bg-muted" : ""}
                >
                  <Thermometer className="w-4 h-4 mr-2" />
                  Metric (°C, km/h)
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setUnits('imperial')}
                  className={units === 'imperial' ? "bg-muted" : ""}
                >
                  <Thermometer className="w-4 h-4 mr-2" />
                  Imperial (°F, mph)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  View Options
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Display Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {viewOptions.map((option) => (
                  <DropdownMenuItem 
                    key={option.value}
                    onClick={() => setView(option.value as any)}
                    className={view === option.value ? "bg-muted" : ""}
                  >
                    <option.icon className="w-4 h-4 mr-2" />
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </footer>
  );
}