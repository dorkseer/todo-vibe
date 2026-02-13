"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Coordinates, WeatherData, WeatherError } from "@/types/weather";

const REFRESH_INTERVAL = 15 * 60 * 1000; // 15 minutes

export function useWeather() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<WeatherError | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const coordsRef = useRef<Coordinates | null>(null);

  const fetchWeather = useCallback(async (coords: Coordinates) => {
    try {
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
    if (!navigator.geolocation) {
      setError({
        message: "Geolocation is not supported by your browser.",
        code: "GEOLOCATION_UNAVAILABLE",
      });
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: Coordinates = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };
        coordsRef.current = coords;
        fetchWeather(coords);
      },
      (err) => {
        const code =
          err.code === err.PERMISSION_DENIED
            ? "GEOLOCATION_DENIED"
            : "GEOLOCATION_UNAVAILABLE";
        setError({
          message:
            code === "GEOLOCATION_DENIED"
              ? "Location access was denied. Enable it in your browser settings."
              : "Unable to determine your location.",
          code,
        });
        setIsLoading(false);
      },
      { timeout: 10000 }
    );
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
