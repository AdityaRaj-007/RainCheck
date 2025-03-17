//import React from "react";

import { useParams, useSearchParams } from "react-router-dom";
import { useForecastQuery, useWeatherQuery } from "../hooks/use-weather";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { AlertTriangle } from "lucide-react";
import LoadingSkeleton from "../components/LoadingSkeleton";
import CurrentWeather from "../components/CurrentWeather";
import HourlyTemperature from "../components/HourlyTemperature";
import WeatherDetails from "../components/WeatherDetails";
import WeatherForecast from "../components/WeatherForecast";
import FavoriteButton from "../components/FavoriteButton";

function CityPage() {
  const [searchParams] = useSearchParams();
  const params = useParams();

  const lat = parseFloat(searchParams.get("lat") || "0");
  const lon = parseFloat(searchParams.get("lon") || "0");

  const coordinates = { lat, lon };

  const weatherQuery = useWeatherQuery(coordinates);
  const forecastQuery = useForecastQuery(coordinates);

  if (weatherQuery.error || forecastQuery.error) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          Failed to fetch weather data. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  if (!weatherQuery.data || !forecastQuery.data || !params.cityName) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-4">
      {/* Favorite Cities */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          {params.cityName}, {weatherQuery.data.sys.country}
        </h1>
        <div>
          <FavoriteButton
            data={{ ...weatherQuery.data, name: params.cityName }}
          />
        </div>
      </div>
      {/* Current and Hourly weather */}
      <div className="grid gap-6">
        <div className="flex flex-col gap-4">
          <CurrentWeather data={weatherQuery.data} />
          <HourlyTemperature data={forecastQuery.data} />
        </div>
        <div className="grid my-5 gap-6 md:grid-cols-2 items-start">
          {/* details
          forecast */}
          <WeatherDetails data={weatherQuery.data} />

          <WeatherForecast data={forecastQuery.data} />
        </div>
      </div>
    </div>
  );
}

export default CityPage;
