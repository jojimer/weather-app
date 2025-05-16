import { WeatherData } from '@/lib/types';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = import.meta.env.VITE_WEATHER_API_BASE_URL || 'https://api.weatherapi.com/v1';

/**
 * Fetch weather data for a location
 * @param location City name, zip code or lat,lon coordinates
 * @returns Weather data
 */
export async function fetchWeatherData(location: string): Promise<WeatherData> {
  try {
    // Check if we have a valid API key
    if (!API_KEY) {
      console.warn('No API key provided, using mock data');
      return getMockWeatherData(location);
    }

    // Check if we have a valid location
    if (!location || location.trim() === '') {
      throw new Error('Please provide a valid location');
    }

    // Check network connectivity
    if (!navigator.onLine) {
      throw new Error('No internet connection. Please check your network and try again.');
    }

    const response = await fetch(
      `${BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(
        location
      )}&days=5&aqi=yes&alerts=yes`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your configuration.');
      } else if (response.status === 403) {
        throw new Error('API access forbidden. Please check your subscription.');
      } else if (response.status === 404) {
        throw new Error('Location not found. Please try a different location.');
      } else if (response.status === 429) {
        throw new Error('Too many requests. Please try again later.');
      } else {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.error?.message || 
          `Weather API error: ${response.status} ${response.statusText}`
        );
      }
    }

    const data = await response.json();
    return data as WeatherData;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    
    // If it's already an Error object with a message, throw it as is
    if (error instanceof Error) {
      throw error;
    }
    
    // Otherwise, wrap it in a new Error with a generic message
    throw new Error('Failed to fetch weather data. Please try again later.');
  }
}

/**
 * Search for a location
 * @param query Search query
 * @returns Array of matching locations
 */
export async function searchLocation(query: string) {
  try {
    // Check if we have a valid API key
    if (!API_KEY) {
      console.warn('No API key provided, search functionality disabled');
      return [];
    }

    // Check if we have a valid query
    if (!query || query.trim() === '') {
      return [];
    }

    // Check network connectivity
    if (!navigator.onLine) {
      throw new Error('No internet connection. Please check your network and try again.');
    }

    const response = await fetch(
      `${BASE_URL}/search.json?key=${API_KEY}&q=${encodeURIComponent(query)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your configuration.');
      } else if (response.status === 403) {
        throw new Error('API access forbidden. Please check your subscription.');
      } else if (response.status === 429) {
        throw new Error('Too many requests. Please try again later.');
      } else {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.error?.message || 
          `Location search error: ${response.status} ${response.statusText}`
        );
      }
    }

    return await response.json();
  } catch (error) {
    console.error('Error searching for location:', error);
    throw error instanceof Error ? error : new Error('Failed to search location');
  }
}

/**
 * Mock function for development when API key is not set
 * @param location Location to get mock data for
 * @returns Mock weather data
 */
export function getMockWeatherData(location: string): WeatherData {
  return {
    location: {
      name: location || 'London',
      region: 'City of London, Greater London',
      country: 'United Kingdom',
      lat: 51.52,
      lon: -0.11,
      localtime: new Date().toISOString(),
    },
    current: {
      temp_c: 15,
      temp_f: 59,
      is_day: 1,
      condition: {
        text: 'Partly cloudy',
        icon: '//cdn.weatherapi.com/weather/64x64/day/116.png',
        code: 1003,
      },
      wind_mph: 5.6,
      wind_kph: 9,
      wind_dir: 'SW',
      pressure_mb: 1012,
      pressure_in: 29.88,
      precip_mm: 0,
      precip_in: 0,
      humidity: 72,
      cloud: 50,
      feelslike_c: 15,
      feelslike_f: 59,
      uv: 4,
      vis_km: 10,
      vis_miles: 12
    },
    forecast: {
      forecastday: [
        {
          date: new Date().toISOString().split('T')[0],
          date_epoch: Math.floor(Date.now() / 1000),
          day: {
            maxtemp_c: 18,
            maxtemp_f: 64.4,
            mintemp_c: 12,
            mintemp_f: 53.6,
            avgtemp_c: 15,
            avgtemp_f: 59,
            maxwind_mph: 8.7,
            maxwind_kph: 14,
            totalprecip_mm: 0,
            totalprecip_in: 0,
            totalsnow_cm: 0,
            avgvis_km: 10,
            avgvis_miles: 6,
            avghumidity: 72,
            daily_will_it_rain: 0,
            daily_chance_of_rain: 0,
            daily_will_it_snow: 0,
            daily_chance_of_snow: 0,
            condition: {
              text: 'Partly cloudy',
              icon: '//cdn.weatherapi.com/weather/64x64/day/116.png',
              code: 1003,
            },
            uv: 4,
          },
          astro: {
            sunrise: '06:45 AM',
            sunset: '07:30 PM',
            moonrise: '10:30 PM',
            moonset: '08:15 AM',
            moon_phase: 'Waning Gibbous',
            moon_illumination: '60',
          },
          hour: Array(24).fill(null).map((_, i) => ({
            time_epoch: Math.floor(Date.now() / 1000) + i * 3600,
            time: new Date(Date.now() + i * 3600 * 1000).toISOString(),
            temp_c: 15 + Math.sin(i / 24 * Math.PI * 2) * 3,
            temp_f: 59 + Math.sin(i / 24 * Math.PI * 2) * 5.4,
            is_day: i > 6 && i < 20 ? 1 : 0,
            condition: {
              text: 'Partly cloudy',
              icon: '//cdn.weatherapi.com/weather/64x64/day/116.png',
              code: 1003,
            },
            wind_mph: 5.6,
            wind_kph: 9,
            wind_degree: 220,
            wind_dir: 'SW',
            pressure_mb: 1012,
            pressure_in: 29.88,
            precip_mm: 0,
            precip_in: 0,
            humidity: 72,
            cloud: 50,
            feelslike_c: 15 + Math.sin(i / 24 * Math.PI * 2) * 3,
            feelslike_f: 59 + Math.sin(i / 24 * Math.PI * 2) * 5.4,
            windchill_c: 15 + Math.sin(i / 24 * Math.PI * 2) * 3,
            windchill_f: 59 + Math.sin(i / 24 * Math.PI * 2) * 5.4,
            heatindex_c: 15 + Math.sin(i / 24 * Math.PI * 2) * 3,
            heatindex_f: 59 + Math.sin(i / 24 * Math.PI * 2) * 5.4,
            dewpoint_c: 10,
            dewpoint_f: 50,
            will_it_rain: 0,
            chance_of_rain: 0,
            will_it_snow: 0,
            chance_of_snow: 0,
            vis_km: 10,
            vis_miles: 6,
            gust_mph: 8.1,
            gust_kph: 13,
            uv: 4,
          })),
        },
      ],
    },
  };
}