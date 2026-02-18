# Todo Vibe

A todo app with weather widget, built with Expo (React Native + React Native for Web). Runs on web, iOS, and Android from one codebase.

## Prerequisites

- Node.js 18+ (the `.nvmrc` specifies 22)
- npm
- For iOS: Xcode with iOS Simulator
- For Android: Android Studio with an emulator

## Setup

```bash
nvm use
npm install
```

### Environment variables

Copy `.env` and set your OpenWeatherMap API key for the weather widget:

```
OPENWEATHERMAP_API_KEY=your_key_here
```

The weather widget is optional — the todo functionality works without it.

## Running

### Web

```bash
npm run web
```

Opens at [http://localhost:8081](http://localhost:8081).

### iOS Simulator

```bash
npm run ios
```

### Android Emulator

```bash
npm run android
```

## Project structure

```
app/                        # Expo Router routes
  _layout.tsx               # Root layout (SafeAreaProvider)
  (tabs)/
    _layout.tsx             # Tab navigator (Todos + Weather)
    index.tsx               # Todo screen (+ weather sidebar on wide web)
    weather.tsx             # Weather screen (mobile tab)
  api/
    weather+api.ts          # Server-side weather proxy (web only)
src/
  components/               # React Native UI components
    icons/                  # SVG icon components (react-native-svg)
  hooks/
    useTodos.ts             # Todo CRUD with AsyncStorage persistence
    useWeather.ts           # Geolocation + weather fetching
  types/
    todo.ts                 # Todo type definitions
    weather.ts              # Weather type definitions
```
