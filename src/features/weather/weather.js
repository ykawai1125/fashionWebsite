const apiKey = '2019d3616b9dc63ec653e457e55eb69e';
const city = 'Toronto';

async function fetchWeather() {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();

  if (data.cod !== 200) {
    console.error('Error fetching weather:', data.message);
    return;
  }

  const temp = data.main.temp;
  const condition = data.weather[0].description;
  const high = data.main.temp_max;
  const low = data.main.temp_min;

  document.getElementById('city').textContent = `${data.name}, ${data.sys.country}`;
  document.getElementById('condition').textContent = `Condition: ${condition}`;
  document.getElementById('temperature').textContent = `Temperature: ${Math.round(temp)}°C (H: ${Math.round(high)}°C / L: ${Math.round(low)}°C)`;

// Add this part to show a message based on temperature
   let message = '';
   if (temp >= 30) {
     message = "It's really hot today! I recommend you wear short t-shirt and short pant.\n Have a good day.";
   } else if (temp >= 23) {
     message = "It's a bit today. I recommend you wear t-shirt and long pant.\n Have a good day.";
   } else if (temp >= 10) {
     message = "A bit chilly. I recommend you take a light jacket.\n Have a good day.";
   } else {
     message = "It's cold! Be careful, I recommend you wear winter Jacket.\n Have a good day.";
   }

document.getElementById('message').textContent = message;

}

fetchWeather();
