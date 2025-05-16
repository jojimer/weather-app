import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  WeatherData, 
  FavoriteLocation, 
  Units, 
  WeatherView 
} from '@/lib/types';
import { fetchWeatherData } from '@/services/weatherService';

interface WeatherContextType {
  weatherData: WeatherData | null;
  loading: boolean;
  error: string | null;
  location: string;
  setLocation: (location: string) => void;
  favorites: FavoriteLocation[];
  addFavorite: (location: FavoriteLocation) => void;
  removeFavorite: (id: string) => void;
  units: Units;
  setUnits: (units: Units) => void;
  view: WeatherView;
  setView: (view: WeatherView) => void;
  refreshWeather: () => Promise<void>;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export function WeatherProvider({ children }: { children: ReactNode }) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<string>(() => {
    return localStorage.getItem('lastLocation') || 'London';
  });
  const [favorites, setFavorites] = useState<FavoriteLocation[]>(() => {
    const saved = localStorage.getItem('favoriteLocations');
    return saved ? JSON.parse(saved) : [];
  });
  const [units, setUnits] = useState<Units>(() => {
    return (localStorage.getItem('units') as Units) || 'metric';
  });
  const [view, setView] = useState<WeatherView>(() => {
    return (localStorage.getItem('view') as WeatherView) || 'summary';
  });

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('lastLocation', location);
    localStorage.setItem('favoriteLocations', JSON.stringify(favorites));
    localStorage.setItem('units', units);
    localStorage.setItem('view', view);
  }, [location, favorites, units, view]);

  const refreshWeather = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherData(location);
      setWeatherData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch weather data when location changes
  useEffect(() => {
    refreshWeather();
  }, [location]);

  const addFavorite = (location: FavoriteLocation) => {
    setFavorites((prevFavorites) => {
      // Don't add duplicates
      if (prevFavorites.some(fav => fav.id === location.id)) {
        return prevFavorites;
      }
      return [...prevFavorites, location];
    });
  };

  const removeFavorite = (id: string) => {
    setFavorites((prevFavorites) => 
      prevFavorites.filter((fav) => fav.id !== id)
    );
  };

  return (
    <WeatherContext.Provider
      value={{
        weatherData,
        loading,
        error,
        location,
        setLocation,
        favorites,
        addFavorite,
        removeFavorite,
        units,
        setUnits,
        view,
        setView,
        refreshWeather,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
}