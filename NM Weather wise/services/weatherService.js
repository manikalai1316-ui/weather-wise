const FALLBACK_WEATHER = {
  London: { temp: 15, feelsLike: 14, humidity: 72, description: 'Partly cloudy', windSpeed: 12, icon: '02d' },
  'New York': { temp: 22, feelsLike: 21, humidity: 55, description: 'Clear sky', windSpeed: 8, icon: '01d' },
  Tokyo: { temp: 28, feelsLike: 30, humidity: 68, description: 'Light rain', windSpeed: 5, icon: '10d' },
  Paris: { temp: 18, feelsLike: 17, humidity: 60, description: 'Overcast clouds', windSpeed: 10, icon: '04d' },
  Mumbai: { temp: 32, feelsLike: 36, humidity: 78, description: 'Humid with haze', windSpeed: 6, icon: '50d' },
};

const getFallbackWeather = (city) => {
  const normalized = Object.keys(FALLBACK_WEATHER).find(
    (key) => key.toLowerCase() === city.toLowerCase()
  );

  const data = normalized ? FALLBACK_WEATHER[normalized] : {
    temp: 20,
    feelsLike: 19,
    humidity: 65,
    description: 'Mild conditions',
    windSpeed: 7,
    icon: '03d',
  };

  return {
    city,
    source: 'fallback',
    temperature: data.temp,
    feelsLike: data.feelsLike,
    humidity: data.humidity,
    description: data.description,
    windSpeed: data.windSpeed,
    icon: data.icon,
    fetchedAt: new Date().toISOString(),
  };
};

const fetchWeather = async (city, country) => {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    return getFallbackWeather(city);
  }

  try {
    const query = country ? `${city},${country}` : city;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(query)}&units=metric&appid=${apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
      return getFallbackWeather(city);
    }

    const data = await response.json();

    return {
      city: data.name,
      country: data.sys?.country,
      source: 'openweathermap',
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      description: data.weather[0]?.description || 'Unknown',
      windSpeed: data.wind?.speed || 0,
      icon: data.weather[0]?.icon || '01d',
      fetchedAt: new Date().toISOString(),
    };
  } catch {
    return getFallbackWeather(city);
  }
};

module.exports = { fetchWeather, getFallbackWeather };
