import {
  WeatherData,
  CurrentWeather,
  HourlyForecast,
  DailyForecast,
} from "@/types/weather";

const OWM_BASE = "https://api.openweathermap.org/data/2.5";

interface OWMCurrentResponse {
  name: string;
  main: { temp: number; feels_like: number; humidity: number };
  weather: { description: string; icon: string }[];
  wind: { speed: number };
}

interface OWMForecastEntry {
  dt: number;
  main: { temp: number; temp_max: number; temp_min: number };
  weather: { description: string; icon: string }[];
}

interface OWMForecastResponse {
  list: OWMForecastEntry[];
}

function normalizeCurrent(data: OWMCurrentResponse): CurrentWeather {
  return {
    temp: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    humidity: data.main.humidity,
    windSpeed: Math.round(data.wind.speed),
    locationName: data.name,
  };
}

function normalizeHourly(list: OWMForecastEntry[]): HourlyForecast[] {
  return list.slice(0, 6).map((entry) => ({
    time: entry.dt,
    temp: Math.round(entry.main.temp),
    icon: entry.weather[0].icon,
    description: entry.weather[0].description,
  }));
}

function normalizeDaily(list: OWMForecastEntry[]): DailyForecast[] {
  const dayMap = new Map<
    string,
    { temps: number[]; highs: number[]; lows: number[]; icon: string; description: string; dt: number }
  >();

  for (const entry of list) {
    const date = new Date(entry.dt * 1000);
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

    if (!dayMap.has(key)) {
      dayMap.set(key, {
        temps: [],
        highs: [],
        lows: [],
        icon: entry.weather[0].icon,
        description: entry.weather[0].description,
        dt: entry.dt,
      });
    }

    const day = dayMap.get(key)!;
    day.temps.push(entry.main.temp);
    day.highs.push(entry.main.temp_max);
    day.lows.push(entry.main.temp_min);
  }

  const days = Array.from(dayMap.values()).slice(1, 6);

  return days.map((day) => ({
    date: day.dt,
    tempHigh: Math.round(Math.max(...day.highs)),
    tempLow: Math.round(Math.min(...day.lows)),
    icon: day.icon,
    description: day.description,
  }));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon || isNaN(Number(lat)) || isNaN(Number(lon))) {
    return Response.json(
      { error: "Valid lat and lon query parameters are required" },
      { status: 400 }
    );
  }

  const apiKey = process.env.OPENWEATHERMAP_API_KEY;
  if (!apiKey || apiKey === "your_api_key_here") {
    return Response.json(
      { error: "OpenWeatherMap API key not configured" },
      { status: 500 }
    );
  }

  try {
    const [currentRes, forecastRes] = await Promise.all([
      fetch(
        `${OWM_BASE}/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`
      ),
      fetch(
        `${OWM_BASE}/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`
      ),
    ]);

    if (!currentRes.ok || !forecastRes.ok) {
      return Response.json(
        { error: "Failed to fetch weather data" },
        { status: 502 }
      );
    }

    const currentData: OWMCurrentResponse = await currentRes.json();
    const forecastData: OWMForecastResponse = await forecastRes.json();

    const weatherData: WeatherData = {
      current: normalizeCurrent(currentData),
      hourly: normalizeHourly(forecastData.list),
      daily: normalizeDaily(forecastData.list),
      fetchedAt: Date.now(),
    };

    return Response.json(weatherData, {
      headers: {
        "Cache-Control": "s-maxage=600, stale-while-revalidate=300",
      },
    });
  } catch {
    return Response.json(
      { error: "Network error fetching weather data" },
      { status: 502 }
    );
  }
}
