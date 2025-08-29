"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useFetch } from "../hooks/useFetch";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useToggle } from "../hooks/useToggle";
import { useWindowSize } from "../hooks/useWindowSize";
import { gsap } from "gsap";

export default function WeatherApp() {
  const [city, setCity] = useLocalStorage("lastCity", "Berlin");
  const [inputCity, setInputCity] = useState("");
  const [isCelsius, toggleUnit] = useToggle(true);
  const { width } = useWindowSize();
  const weatherRef = useRef(null);
  const currentWeatherRef = useRef(null);
  const forecastRef = useRef(null);

  const [coordinates, setCoordinates] = useState({ lat: 52.52, lon: 13.41 });
  const [cityError, setCityError] = useState("");

  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${coordinates.lat}&longitude=${coordinates.lon}&current=temperature_2m,wind_speed_10m,weather_code&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=auto`;

  const { data: weatherData, loading, error } = useFetch(weatherUrl);

  useEffect(() => {
    gsap.fromTo(
      weatherRef.current,
      {
        scale: 0.8,
        opacity: 0,
        rotationY: -90,
      },
      {
        scale: 1,
        opacity: 1,
        rotationY: 0,
        duration: 1.5,
        ease: "back.out(1.7)",
      }
    );

    gsap.to(weatherRef.current, {
      y: -8,
      duration: 3.5,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
    });
  }, []);

  useEffect(() => {
    if (weatherData && currentWeatherRef.current) {
      gsap.fromTo(
        currentWeatherRef.current,
        {
          scale: 0,
          rotation: 180,
        },
        {
          scale: 1,
          rotation: 0,
          duration: 1,
          ease: "elastic.out(1, 0.5)",
        }
      );

      const tempElement =
        currentWeatherRef.current.querySelector(".temperature");
      if (tempElement) {
        gsap.fromTo(
          tempElement,
          { scale: 0.5, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            ease: "bounce.out",
            delay: 0.3,
          }
        );
      }
    }

    if (weatherData && forecastRef.current) {
      gsap.fromTo(
        forecastRef.current.children,
        {
          x: -50,
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          delay: 0.5,
        }
      );
    }
  }, [weatherData]);

  const convertTemp = (temp) => {
    if (isCelsius) return Math.round(temp);
    return Math.round((temp * 9) / 5 + 32);
  };

  const handleCitySearch = async () => {
    if (!inputCity.trim()) return;

    gsap.to(weatherRef.current, {
      scale: 0.95,
      duration: 0.2,
      yoyo: true,
      repeat: 1,
    });

    try {
      const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        inputCity
      )}&limit=1`;
      const geocodeResponse = await fetch(geocodeUrl);
      const geocodeData = await geocodeResponse.json();

      let coords;
      if (geocodeData && geocodeData.length > 0) {
        coords = {
          lat: Number.parseFloat(geocodeData[0].lat),
          lon: Number.parseFloat(geocodeData[0].lon),
        };
        setCityError("");
        console.log(
          "[v0] Found city via geocoding:",
          inputCity,
          "Coords:",
          coords
        );
      } else {
        const cityCoords = {
          Berlin: { lat: 52.52, lon: 13.41 },
          London: { lat: 51.51, lon: -0.13 },
          "New York": { lat: 40.71, lon: -74.01 },
          Tokyo: { lat: 35.68, lon: 139.69 },
          Sydney: { lat: -33.87, lon: 151.21 },
          Paris: { lat: 48.85, lon: 2.35 },
          Moscow: { lat: 55.76, lon: 37.62 },
          Mumbai: { lat: 19.08, lon: 72.88 },
          "Los Angeles": { lat: 34.05, lon: -118.24 },
          Chicago: { lat: 41.88, lon: -87.63 },
          Toronto: { lat: 43.65, lon: -79.38 },
          Bangkok: { lat: 13.76, lon: 100.5 },
          Singapore: { lat: 1.35, lon: 103.82 },
          Dubai: { lat: 25.2, lon: 55.27 },
          Cairo: { lat: 30.04, lon: 31.24 },
          "São Paulo": { lat: -23.55, lon: -46.63 },
          "Mexico City": { lat: 19.43, lon: -99.13 },
          Seoul: { lat: 37.57, lon: 126.98 },
          Madrid: { lat: 40.42, lon: -3.7 },
          Jakarta: { lat: -6.21, lon: 106.85 },
          Surabaya: { lat: -7.25, lon: 112.75 },
          Bandung: { lat: -6.91, lon: 107.61 },
          Medan: { lat: 3.59, lon: 98.67 },
          Semarang: { lat: -6.97, lon: 110.42 },
          Makassar: { lat: -5.15, lon: 119.43 },
          Palembang: { lat: -2.99, lon: 104.76 },
          Tangerang: { lat: -6.18, lon: 106.63 },
          Depok: { lat: -6.4, lon: 106.82 },
          Bekasi: { lat: -6.24, lon: 107.0 },
          Yogyakarta: { lat: -7.8, lon: 110.36 },
          Malang: { lat: -7.98, lon: 112.63 },
          Bogor: { lat: -6.6, lon: 106.8 },
          Batam: { lat: 1.13, lon: 104.05 },
          Pekanbaru: { lat: 0.53, lon: 101.45 },
          Banjarmasin: { lat: -3.32, lon: 114.59 },
          Samarinda: { lat: -0.5, lon: 117.15 },
          Denpasar: { lat: -8.65, lon: 115.22 },
          Balikpapan: { lat: -1.24, lon: 116.83 },
          Pontianak: { lat: -0.03, lon: 109.32 },
          Manado: { lat: 1.49, lon: 124.84 },
          Jayapura: { lat: -2.53, lon: 140.72 },
          Ambon: { lat: -3.7, lon: 128.18 },
          Mataram: { lat: -8.58, lon: 116.12 },
          Kupang: { lat: -10.17, lon: 123.61 },
        };

        coords = cityCoords[inputCity];
        if (!coords) {
          const cityKey = Object.keys(cityCoords).find(
            (key) =>
              key.toLowerCase().includes(inputCity.toLowerCase()) ||
              inputCity.toLowerCase().includes(key.toLowerCase())
          );
          coords = cityKey ? cityCoords[cityKey] : null;
        }

        if (!coords) {
          setCityError(`Kota "${inputCity}" tidak ditemukan.`);
          return;
        } else {
          setCityError("");
        }
        console.log(
          "[v0] Using fallback city coords:",
          inputCity,
          "Coords:",
          coords
        );
      }

      setCoordinates(coords);
      setCity(inputCity || "Berlin");
      setInputCity("");
    } catch (error) {
      console.error("[v0] Error geocoding city:", error);
      setCityError("Terjadi kesalahan saat mencari kota.");
      setCoordinates({ lat: 52.52, lon: 13.41 });
      setCity("Berlin");
      setInputCity("");
    }
  };

  const handleToggleUnit = () => {
    if (currentWeatherRef.current) {
      gsap.to(currentWeatherRef.current, {
        rotationY: 180,
        duration: 0.3,
        onComplete: () => {
          toggleUnit();
          gsap.to(currentWeatherRef.current, {
            rotationY: 0,
            duration: 0.3,
          });
        },
      });
    } else {
      toggleUnit();
    }
  };

  const isMobile = width < 768;

  return (
    <div className="space-y-6">
      <Card
        ref={weatherRef}
        className="bg-white/10 backdrop-blur-lg border-white/20 transform-gpu"
        style={{
          boxShadow:
            "0 25px 50px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)",
        }}
      >
        <CardHeader className="pb-4 sm:pb-6">
          <CardTitle className="text-xl sm:text-2xl text-white text-center bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Aplikasi Cuaca - {city}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 space-y-4 sm:space-y-6">
          <div
            className={`flex ${
              isMobile ? "flex-col" : "flex-row"
            } gap-3 sm:gap-4`}
          >
            <Input
              value={inputCity}
              onChange={(e) => setInputCity(e.target.value)}
              placeholder="Ketik nama kota apa saja di Indonesia atau dunia..."
              className="bg-white/20 border-white/30 text-white placeholder:text-white/70 transition-all duration-300 focus:scale-105 transform-gpu text-sm sm:text-base"
              style={{
                boxShadow: "inset 0 2px 10px rgba(0,0,0,0.2)",
              }}
              onKeyPress={(e) => e.key === "Enter" && handleCitySearch()}
            />
            <Button
              onClick={handleCitySearch}
              className="whitespace-nowrap transition-all duration-300 hover:scale-110 transform-gpu text-sm sm:text-base px-4 sm:px-6"
              style={{
                background: "linear-gradient(45deg, #4ecdc4, #44a08d)",
                boxShadow: "0 10px 25px rgba(68, 160, 141, 0.4)",
              }}
            >
              Search Weather
            </Button>
          </div>

          {cityError && (
            <div className="text-red-400 text-center p-2 bg-red-500/10 rounded-lg text-sm sm:text-base">
              {cityError}
            </div>
          )}

          <div className="text-center text-white/50 text-xs">
            Coordinates: {coordinates.lat.toFixed(2)},{" "}
            {coordinates.lon.toFixed(2)}
          </div>

          {loading && (
            <div className="text-center py-6 sm:py-8">
              <div className="animate-spin rounded-full h-10 sm:h-12 w-10 sm:w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-white animate-pulse text-sm sm:text-base">
                Loading weather data...
              </p>
            </div>
          )}

          {error && (
            <div className="text-red-300 text-center p-3 sm:p-4 bg-red-500/20 rounded-lg animate-bounce text-sm sm:text-base">
              Error loading weather data: {error}
            </div>
          )}

          {weatherData && (
            <div
              className={`grid ${
                isMobile ? "grid-cols-1" : "grid-cols-2"
              } gap-4 sm:gap-6`}
            >
              <Card
                ref={currentWeatherRef}
                className="bg-white/20 border-white/30 transform-gpu"
                style={{
                  boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
                }}
              >
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-white text-base sm:text-lg flex justify-between items-center">
                    Current Weather
                    <Button
                      onClick={handleToggleUnit}
                      size="sm"
                      className="ml-2 transition-all duration-300 hover:scale-110 transform-gpu text-xs px-3 py-1"
                      style={{
                        background: "linear-gradient(45deg, #ff6b6b, #ee5a24)",
                        boxShadow: "0 5px 15px rgba(255, 107, 107, 0.4)",
                      }}
                    >
                      °{isCelsius ? "F" : "C"}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  <div className="text-center">
                    <div
                      className="temperature text-3xl sm:text-4xl font-bold text-white mb-2"
                      style={{
                        textShadow: "0 0 20px rgba(255,255,255,0.5)",
                      }}
                    >
                      {convertTemp(weatherData.current.temperature_2m)}°
                      {isCelsius ? "C" : "F"}
                    </div>
                    <div className="text-white/70 text-sm sm:text-base">
                      Wind: {weatherData.current.wind_speed_10m} km/h
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card
                className="bg-white/20 border-white/30"
                style={{
                  boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
                }}
              >
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-white text-base sm:text-lg">
                    24h Forecast
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  <div
                    ref={forecastRef}
                    className="space-y-2 max-h-32 sm:max-h-40 overflow-y-auto"
                  >
                    {weatherData.hourly.temperature_2m
                      .slice(0, 8)
                      .map((temp, index) => (
                        <div
                          key={index}
                          className="flex justify-between text-white/80 text-xs sm:text-sm p-2 rounded bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-105 transform-gpu"
                        >
                          <span>{index * 3}:00</span>
                          <span>
                            {convertTemp(temp)}°{isCelsius ? "C" : "F"}
                          </span>
                          <span>
                            {weatherData.hourly.relative_humidity_2m[index]}%
                          </span>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
