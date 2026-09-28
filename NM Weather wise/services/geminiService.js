const { GoogleGenerativeAI } = require('@google/generative-ai');

const buildFallbackSummary = (weather) => {
  const temp = weather.temperature;
  const condition = weather.description;

  let advice = 'Conditions are moderate. Dress in layers and stay prepared for changes.';

  if (temp >= 30) {
    advice = 'It is quite warm. Stay hydrated, wear light clothing, and avoid prolonged sun exposure.';
  } else if (temp <= 10) {
    advice = 'It is chilly outside. Wear a warm jacket and consider a scarf or gloves.';
  } else if (condition.includes('rain')) {
    advice = 'Rain is expected. Carry an umbrella and wear waterproof footwear.';
  }

  return {
    summary: `Currently in ${weather.city}, expect ${condition} with a temperature of ${temp}°C (feels like ${weather.feelsLike}°C). Humidity is around ${weather.humidity}% with winds at ${weather.windSpeed} m/s.`,
    recommendation: advice,
    source: 'fallback',
  };
};

const buildFallbackRecommendations = (weather) => {
  const activities = [];
  const clothing = [];

  if (weather.temperature >= 25 && !weather.description.includes('rain')) {
    activities.push('Outdoor picnic', 'Cycling', 'Walking tour');
    clothing.push('Light t-shirt', 'Shorts or breathable pants', 'Sunglasses');
  } else if (weather.temperature <= 12) {
    activities.push('Visit a museum', 'Coffee shop reading', 'Indoor fitness');
    clothing.push('Warm coat', 'Scarf', 'Closed shoes');
  } else if (weather.description.includes('rain')) {
    activities.push('Indoor shopping', 'Art gallery visit', 'Cooking at home');
    clothing.push('Waterproof jacket', 'Umbrella', 'Water-resistant shoes');
  } else {
    activities.push('City walk', 'Park visit', 'Outdoor photography');
    clothing.push('Light jacket', 'Comfortable sneakers', 'Casual layers');
  }

  return {
    activities,
    clothing,
    summary: `Based on ${weather.description} and ${weather.temperature}°C in ${weather.city}, here are tailored suggestions.`,
    source: 'fallback',
  };
};

const getGeminiModel = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
};

const generateWeatherSummary = async (weather) => {
  const model = getGeminiModel();

  if (!model) {
    return buildFallbackSummary(weather);
  }

  try {
    const prompt = `You are a friendly weather assistant. Given this weather data for ${weather.city}:
- Temperature: ${weather.temperature}°C (feels like ${weather.feelsLike}°C)
- Condition: ${weather.description}
- Humidity: ${weather.humidity}%
- Wind: ${weather.windSpeed} m/s

Provide a JSON response with exactly two keys:
1. "summary": A natural language weather summary (2-3 sentences)
2. "recommendation": Personalized advice for clothing and general preparedness (1-2 sentences)

Return ONLY valid JSON, no markdown.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(text);

    return {
      summary: parsed.summary,
      recommendation: parsed.recommendation,
      source: 'gemini',
    };
  } catch {
    return buildFallbackSummary(weather);
  }
};

const generateRecommendations = async (weather) => {
  const model = getGeminiModel();

  if (!model) {
    return buildFallbackRecommendations(weather);
  }

  try {
    const prompt = `You are a travel and lifestyle assistant. Given weather in ${weather.city}:
- Temperature: ${weather.temperature}°C
- Condition: ${weather.description}
- Humidity: ${weather.humidity}%

Provide a JSON response with exactly three keys:
1. "activities": array of 3 outdoor/indoor activity suggestions
2. "clothing": array of 3 clothing recommendations
3. "summary": one sentence explaining the recommendations

Return ONLY valid JSON, no markdown.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(text);

    return {
      activities: parsed.activities,
      clothing: parsed.clothing,
      summary: parsed.summary,
      source: 'gemini',
    };
  } catch {
    return buildFallbackRecommendations(weather);
  }
};

module.exports = {
  generateWeatherSummary,
  generateRecommendations,
  buildFallbackSummary,
  buildFallbackRecommendations,
};
