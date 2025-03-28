import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  const [city, setCity] = useState('Delhi');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState('');

  const apiKey = '32f289694e268d3947a8509327579843';

  const fetchWeatherData = async (cityName) => {
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`;

    try {
      const [currentRes, forecastRes] = await Promise.all([
        fetch(currentUrl),
        fetch(forecastUrl),
      ]);

      if (!currentRes.ok || !forecastRes.ok) {
        throw new Error('City not found or API error');
      }

      const currentData = await currentRes.json();
      const forecastData = await forecastRes.json();

      // Filter forecast: Get one entry per day (around 12:00 PM)
      const dailyForecast = forecastData.list.filter((item) =>
        item.dt_txt.includes('12:00:00')
      );

      setWeather(currentData);
      setForecast(dailyForecast);
      setError('');
    } catch (err) {
      console.error(err);
      setError('City not found or failed to fetch data.');
      setWeather(null);
      setForecast([]);
    }
  };

  useEffect(() => {
    fetchWeatherData(city);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeatherData(city);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold text-center">📊 Dashboard</h1>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex justify-center gap-2">
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="border border-gray-300 rounded-xl p-2 w-60"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition"
        >
          Search
        </button>
      </form>

      {/* Error */}
      {error && <div className="text-red-500 text-center">{error}</div>}

      {/* Current Weather */}
      {weather && (
        <div className="bg-blue-100 p-4 rounded-xl shadow text-center">
          <h2 className="text-xl font-semibold">Weather in {weather.name}</h2>
          <p>🌡️ Temp: {weather.main.temp}°C</p>
          <p>💧 Humidity: {weather.main.humidity}%</p>
          <p>☁️ Description: {weather.weather[0].description}</p>
        </div>
      )}

      {/* 5-Day Forecast */}
      {forecast.length > 0 && (
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4 text-center">📅 5-Day Forecast</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            {forecast.map((day, index) => (
              <div
                key={index}
                className="bg-blue-50 p-4 rounded-lg text-center shadow-sm"
              >
                <p className="font-medium">{new Date(day.dt_txt).toLocaleDateString()}</p>
                <p>🌡️ {day.main.temp}°C</p>
                <p>☁️ {day.weather[0].main}</p>
                <p className="text-sm text-gray-600">{day.weather[0].description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
