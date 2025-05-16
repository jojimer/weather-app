import { useState, useEffect, useRef } from 'react';
import { 
  Command, 
  CommandInput, 
  CommandList, 
  CommandEmpty, 
  CommandGroup, 
  CommandItem 
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown, MapPin } from 'lucide-react';
import { useWeather } from '@/contexts/WeatherContext';
import { cn } from '@/lib/utils';

interface LocationOption {
  id: string;
  name: string;
  region: string;
  country: string;
}

export function LocationSearch() {
  const { location, setLocation } = useWeather();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [options, setOptions] = useState<LocationOption[]>([]);
  const [loading, setLoading] = useState(false);
  const searchTimeout = useRef<number | null>(null);

  // Fetch location suggestions when search query changes
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setOptions([]);
      return;
    }

    // Clear previous timeout
    if (searchTimeout.current) {
      window.clearTimeout(searchTimeout.current);
    }

    // Set new timeout to debounce API calls
    searchTimeout.current = window.setTimeout(async () => {
      setLoading(true);
      try {
        // Replace with mocked data for demo
        // In real app: const results = await searchLocation(searchQuery);
        const mockResults = [
          { id: '1', name: 'London', region: 'City of London', country: 'United Kingdom' },
          { id: '2', name: 'New York', region: 'New York', country: 'United States of America' },
          { id: '3', name: 'Paris', region: 'Ile-de-France', country: 'France' },
          { id: '4', name: 'Tokyo', region: 'Tokyo', country: 'Japan' },
          { id: '5', name: 'Sydney', region: 'New South Wales', country: 'Australia' },
        ].filter(loc => 
          loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          loc.country.toLowerCase().includes(searchQuery.toLowerCase())
        );
        
        setOptions(mockResults);
      } catch (error) {
        console.error('Error searching locations:', error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (searchTimeout.current) {
        window.clearTimeout(searchTimeout.current);
      }
    };
  }, [searchQuery]);

  const handleSelect = (selectedLocation: string) => {
    setLocation(selectedLocation);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <div className="flex items-center truncate">
            <MapPin className="mr-2 h-4 w-4" />
            <span className="truncate">{location}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput 
            placeholder="Search location..." 
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          {loading && (
            <div className="py-6 text-center text-sm text-muted-foreground">
              Searching locations...
            </div>
          )}
          <CommandList>
            <CommandEmpty>No locations found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.id}
                  onSelect={() => handleSelect(option.name)}
                  className="cursor-pointer"
                >
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          location === option.name
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      <span>{option.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground pl-6">
                      {option.region}, {option.country}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}