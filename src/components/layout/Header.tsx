import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Sun, 
  Moon, 
  Laptop, 
  Search, 
  MapPin,
  RefreshCw, 
  Menu,
  X
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useWeather } from '@/contexts/WeatherContext';
import { useGeolocation } from '@/hooks/useGeolocation';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function Header() {
  const { theme, setTheme } = useTheme();
  const { 
    setLocation, 
    refreshWeather,
    loading,
    favorites
  } = useWeather();
  const { latitude, longitude, loading: geoLoading } = useGeolocation();
  const [searchInput, setSearchInput] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setLocation(searchInput);
      setSearchInput('');
      setIsMenuOpen(false);
    }
  };

  const useCurrentLocation = async () => {
    if (latitude && longitude) {
      setLocation(`${latitude},${longitude}`);
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
            <h1 className="text-xl font-semibold">
              <span className="bg-gradient-to-r from-blue-400 to-purple-600 dark:from-blue-300 dark:to-purple-500 bg-clip-text text-transparent">
                Weather Hub
              </span>
            </h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:flex-1 md:items-center md:justify-end md:gap-4">
            <form onSubmit={handleSearch} className="flex max-w-sm items-center space-x-2">
              <Input
                type="text"
                placeholder="Search location..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full"
              />
              <Button type="submit" size="icon">
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </Button>
            </form>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={useCurrentLocation}
                disabled={geoLoading || !latitude}
                title="Use my location"
              >
                <MapPin className="h-4 w-4" />
                <span className="sr-only">Use my location</span>
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={() => refreshWeather()}
                disabled={loading}
                title="Refresh weather data"
              >
                <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
                <span className="sr-only">Refresh</span>
              </Button>

              {favorites.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Favorites
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {favorites.map((fav) => (
                      <DropdownMenuItem 
                        key={fav.id}
                        onClick={() => setLocation(fav.name)}
                      >
                        <MapPin className="mr-2 h-4 w-4" />
                        {fav.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  {theme === 'light' && <Sun className="h-5 w-5" />}
                  {theme === 'dark' && <Moon className="h-5 w-5" />}
                  {theme === 'system' && <Laptop className="h-5 w-5" />}
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme('light')}>
                  <Sun className="mr-2 h-4 w-4" />
                  <span>Light</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>
                  <Moon className="mr-2 h-4 w-4" />
                  <span>Dark</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')}>
                  <Laptop className="mr-2 h-4 w-4" />
                  <span>System</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                className="md:hidden fixed inset-0 bg-background/80 backdrop-blur-sm"
                onClick={() => setIsMenuOpen(false)}
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                className="md:hidden fixed inset-y-0 left-0 w-full max-w-xs bg-background"
              >
                <div className="flex h-16 items-center justify-between px-4 border-b">
                  <h2 className="text-lg font-semibold">Menu</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close menu</span>
                  </Button>
                </div>

                <div className="flex flex-col h-[calc(100vh-4rem)] bg-background p-4">
                  <form onSubmit={handleSearch} className="flex items-center space-x-2">
                    <Input
                      type="text"
                      placeholder="Search location..."
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      className="w-full"
                    />
                    <Button type="submit" size="icon">
                      <Search className="h-4 w-4" />
                      <span className="sr-only">Search</span>
                    </Button>
                  </form>

                  <div className="mt-4 space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={useCurrentLocation}
                      disabled={geoLoading || !latitude}
                      className="w-full justify-start"
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      Use my location
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        refreshWeather();
                        setIsMenuOpen(false);
                      }}
                      disabled={loading}
                      className="w-full justify-start"
                    >
                      <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
                      Refresh weather data
                    </Button>

                    {favorites.length > 0 && (
                      <>
                        <div className="h-px bg-border my-4" />
                        <h3 className="text-sm font-medium mb-2">Favorite Locations</h3>
                        {favorites.map((fav) => (
                          <Button
                            key={fav.id}
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setLocation(fav.name);
                              setIsMenuOpen(false);
                            }}
                            className="w-full justify-start"
                          >
                            <MapPin className="h-4 w-4 mr-2" />
                            {fav.name}
                          </Button>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}