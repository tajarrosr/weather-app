// List of major Philippine cities for validation
const philippineCities = [
    'manila', 'quezon city', 'davao', 'caloocan', 'cebu city', 'zamboanga',
    'antipolo', 'pasig', 'taguig', 'valenzuela', 'dasmariñas', 'calamba',
    'makati', 'marikina', 'muntinlupa', 'las piñas', 'paranaque', 'bacoor',
    'iloilo', 'general santos', 'san jose del monte', 'bacolod', 'fairview',
    'cagayan de oro', 'parañaque', 'malolos', 'san pedro', 'navotas',
    'malabon', 'mandaluyong', 'baguio', 'legazpi', 'batangas', 'lipa',
    'san fernando', 'cabanatuan', 'lucena', 'imus', 'butuan', 'angeles',
    'tarlac', 'bago', 'trece martires', 'naga', 'olongapo', 'koronadal',
    'valencia', 'tayabas', 'bayawan', 'batac', 'cauayan', 'gapan',
    'san carlos', 'danao', 'sagay', 'bais', 'tabaco', 'borongan',
    'surigao', 'tandag', 'bislig', 'malaybalay', 'iligan', 'ozamiz',
    'dipolog', 'dapitan', 'pagadian', 'cotabato', 'kidapawan', 'tacurong',
    'marbel', 'puerto princesa', 'roxas', 'iloilo city', 'kalibo',
    'san jose', 'calapan', 'mamburao', 'boac', 'vigan', 'laoag',
    'tuguegarao', 'santiago', 'ilagan', 'cauayan', 'tabuk', 'bangued',
    'la trinidad', 'bontoc', 'mayoyao', 'lagawe', 'lamitan', 'isabela',
    'jolo', 'bongao', 'panglima sugala', 'languyan', 'mapun', 'siasi',
    'parang', 'maimbung', 'hadji panglima tahil', 'lugus', 'pandami',
    'omar', 'tipo-tipo', 'sapa-sapa', 'tapul', 'turtle islands'
];

// API configuration
const API_KEY = 'api_key'; // Replace with your actual API key, get from https://openweathermap.org/
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// DOM elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('errorMessage');
const weatherContainer = document.getElementById('weatherContainer');
const currentTime = document.getElementById('currentTime');
const currentDate = document.getElementById('currentDate');

function initApp() {
    updateDateTime();
    setInterval(updateDateTime, 1000); 
    
    searchBtn.addEventListener('click', handleWeatherSearch);
    cityInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleWeatherSearch();
        }
    });
}

// Update current date and time
function updateDateTime() {
    const now = new Date();
    
    // Format time in Philippine timezone
    const timeOptions = {
        timeZone: 'Asia/Manila',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    };
    
    // Format date
    const dateOptions = {
        timeZone: 'Asia/Manila',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    
    currentTime.textContent = now.toLocaleTimeString('en-PH', timeOptions);
    currentDate.textContent = now.toLocaleDateString('en-PH', dateOptions);
}

// Validate if city is in the Philippines
function isPhilippineCity(city) {
    const normalizedCity = city.toLowerCase().trim();
    return philippineCities.includes(normalizedCity);
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    weatherContainer.style.display = 'none';
}

function hideError() {
    errorMessage.style.display = 'none';
}

function showLoading() {
    loading.style.display = 'block';
    searchBtn.disabled = true;
    searchBtn.textContent = 'Loading...';
}

function hideLoading() {
    loading.style.display = 'none';
    searchBtn.disabled = false;
    searchBtn.textContent = 'Get Weather';
}

// Fetch weather data using async/await
async function fetchWeatherData(city) {
    try {
        const url = `${API_BASE_URL}?q=${encodeURIComponent(city)},PH&appid=${API_KEY}&units=metric`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            throw new Error('City not found in the Philippines. Please check the spelling and try again.');
        } else if (error.response && error.response.status === 401) {
            throw new Error('Weather service is currently unavailable. Please try again later.');
        } else {
            throw new Error('Failed to fetch weather data. Please check your internet connection and try again.');
        }
    }
}

// Display weather data
function displayWeatherData(weatherData) {
    const cityName = weatherData.name;
    const country = weatherData.sys.country;
    const temperature = Math.round(weatherData.main.temp);
    const feelsLike = Math.round(weatherData.main.feels_like);
    const humidity = weatherData.main.humidity;
    const pressure = weatherData.main.pressure;
    const windSpeed = weatherData.wind.speed;
    const description = weatherData.weather[0].description;

    // Update DOM elements
    document.getElementById('weatherCity').textContent = `${cityName}, ${country}`;
    document.getElementById('temperature').textContent = `${temperature}°C`;
    document.getElementById('weatherDescription').textContent = description;
    document.getElementById('feelsLike').textContent = `${feelsLike}°C`;
    document.getElementById('humidity').textContent = `${humidity}%`;
    document.getElementById('windSpeed').textContent = `${windSpeed} m/s`;
    document.getElementById('pressure').textContent = `${pressure} hPa`;

    // Update weather time
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-PH', {
        timeZone: 'Asia/Manila',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
    document.getElementById('weatherTime').textContent = timeString;

    weatherContainer.style.display = 'block';
    hideError();
}

// Handle weather search
async function handleWeatherSearch() {
    const city = cityInput.value.trim();
    
    if (!city) {
        alert('Please enter a city name');
        return;
    }
    
    if (!isPhilippineCity(city)) {
        showError('Please enter a valid Philippine city. Examples: Manila, Cebu, Davao, Baguio');
        return;
    }
    
    showLoading();
    hideError();
    
    try {
        // Fetch weather data
        const weatherData = await fetchWeatherData(city);
        
        displayWeatherData(weatherData);
        
    } catch (error) {
        showError(error.message);
        console.error('Weather fetch error:', error);
    } finally {
        hideLoading();
    }
}

document.addEventListener('DOMContentLoaded', initApp);