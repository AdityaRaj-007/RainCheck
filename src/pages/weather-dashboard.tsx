//import React from "react";
import { Button } from "../components/ui/button";
import { AlertTriangle, MapPin, RefreshCw } from "lucide-react";
import { useGeolocation } from "../hooks/use-geolocation";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import {
  useForecastQuery,
  useReverseGeocodeQuery,
  useWeatherQuery,
} from "../hooks/use-weather";
import CurrentWeather from "../components/CurrentWeather";
import HourlyTemperature from "../components/HourlyTemperature";
import WeatherDetails from "../components/WeatherDetails";
import WeatherForecast from "../components/WeatherForecast";
import FavoritesCities from "../components/FavoritesCities";

function WeatherDashboard() {
  const {
    coordinates,
    error: locationError,
    getLocation,
    isLoading: locationLoading,
  } = useGeolocation();

  //console.log(coordinates);

  const locationQuery = useReverseGeocodeQuery(coordinates);
  const weatherQuery = useWeatherQuery(coordinates);
  const forecastQuery = useForecastQuery(coordinates);
  //console.log(locationQuery);
  //console.log(weatherQuery.data);
  //console.log(forecastQuery);

  const handleRefresh = () => {
    getLocation();
    if (coordinates) {
      forecastQuery.refetch();
      weatherQuery.refetch();
      locationQuery.refetch();
    }
  };

  if (locationLoading) {
    return <LoadingSkeleton />;
  }

  if (locationError) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Location Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>{locationError}</p>
          <Button onClick={getLocation} variant={"outline"} className="w-fit">
            <MapPin className="mr-2 h-4 w-4" />
            Enable Location
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!coordinates) {
    return (
      <Alert>
        <AlertTitle>Location Required</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>Please enable location access to see your local weather.</p>
          <Button onClick={getLocation} variant={"outline"} className="w-fit">
            <MapPin className="mr-2 h-4 w-4" />
            Enable Location
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  const locationName = locationQuery.data?.[0];

  if (weatherQuery.error || forecastQuery.error) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>Failed to fetch weather data. Please try again.</p>
          <Button onClick={handleRefresh} variant={"outline"} className="w-fit">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!weatherQuery.data || !forecastQuery.data) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-4">
      {/* Favorite Cities */}
      <FavoritesCities />
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">My Location</h1>
        <Button
          variant={"outline"}
          size={"icon"}
          onClick={handleRefresh}
          disabled={weatherQuery.isFetching || forecastQuery.isFetching}
        >
          <RefreshCw
            className={`h-4 w-4 ${
              weatherQuery.isFetching ? "animate-spin" : ""
            }`}
          />
        </Button>
      </div>
      {/* Current and Hourly weather */}
      <div className="grid gap-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <CurrentWeather
            data={weatherQuery.data}
            locationName={locationName}
          />
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

export default WeatherDashboard;
