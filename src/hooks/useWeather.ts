import { useState, useEffect, useCallback, useRef } from "react";
import { Platform } from "react-native";
import * as Location from "expo-location";
import { Coordinates, WeatherData, WeatherError } from "@/types/weather";

const REFRESH_INTERVAL = 15 * 60 * 1000; // 15 minutes

export function useWeather() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<WeatherError | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const coordsRef = useRef<Coordinates | null>(null);

  const fetchWeather = useCallback(async (coords: Coordinates) => {
    try {
      // On web, use the API route; on native, API routes aren't available
      if (Platform.OS !== "web") {
        setError({
          message: "Weather is currently available on web only.",
          code: "API_ERROR",
        });
        setIsLoading(false);
        return;
      }

      const res = await fetch(
        `/api/weather?lat=${coords.lat}&lon=${coords.lon}`
      );
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError({
          message: body.error || "Failed to fetch weather data",
          code: "API_ERROR",
        });
        setIsLoading(false);
        return;
      }
      const data: WeatherData = await res.json();
      setWeatherData(data);
      setError(null);
    } catch {
      setError({
        message: "Network error. Check your connection.",
        code: "NETWORK_ERROR",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setError({
            message: "Location access was denied. Enable it in your settings.",
            code: "GEOLOCATION_DENIED",
          });
          setIsLoading(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        const coords: Coordinates = {
          lat: location.coords.latitude,
          lon: location.coords.longitude,
        };
        coordsRef.current = coords;
        fetchWeather(coords);
      } catch {
        setError({
          message: "Unable to determine your location.",
          code: "GEOLOCATION_UNAVAILABLE",
        });
        setIsLoading(false);
      }
    })();
  }, [fetchWeather]);

  // Auto-refresh
  useEffect(() => {
    if (!coordsRef.current) return;
    const interval = setInterval(() => {
      if (coordsRef.current) {
        fetchWeather(coordsRef.current);
      }
    }, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [weatherData, fetchWeather]);

  const refresh = useCallback(() => {
    if (coordsRef.current) {
      setIsLoading(true);
      fetchWeather(coordsRef.current);
    }
  }, [fetchWeather]);

  return { weatherData, error, isLoading, refresh };
}
