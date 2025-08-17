const searchBtn = document.getElementById("search");
const cityInput = document.getElementById("city");
const result = document.getElementById("result");

searchBtn.addEventListener("click", async () => {
  const city = cityInput.value.trim();
  if (!city) {
    alert("Please enter a city");
    return;
  }

  try {
    const weather = await getWeather(city);
    showWeather(weather, city);
  } catch (error) {
    result.innerHTML = `<p style="color:red">Error: ${error.message}</p>`;
  }
});

async function getWeather(city) {
  const url = `https://wttr.in/${city}?format=j1`;

  console.log("📡 Fetching:", url);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("City not found");
  }

  const data = await response.json();
  return data;
}

function showWeather(data, city) {
  const current = data.current_condition[0];
  result.innerHTML = `
    <h2>${city}</h2>
    <p>🌡️ Temperature: ${current.temp_C} °C</p>
    <p>☁️ Weather: ${current.weatherDesc[0].value}</p>
    <p>💨 Wind: ${current.windspeedKmph} km/h</p>
  `;
}
