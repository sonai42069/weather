const forecastContainer = document.getElementById('forecastContainer');
const app = document.querySelector('.weather-app');
const temp = document.querySelector('.temp');
const feelslike = document.querySelector('.feels-like');
const dateOutput = document.querySelector('.date');
const timeOutput = document.querySelector('.time');
const conditionOutput = document.querySelector('.condition');
const nameOutput = document.querySelector('.name');
const icon = document.querySelector('.icon');
const cloudOutput = document.querySelector('.cloud');
const humidityOutput = document.querySelector('.humidity');
const windOutput = document.querySelector('.wind');
const form = document.getElementById('locationInput');
const search = document.querySelector('.search');
const btn = document.querySelector('.submit');
const cities = document.querySelectorAll('.city');

getAutoLocation();

function getLocations(position) {
    const lat = position.coords.latitude;
    const long = position.coords.longitude;
    console.log(`Latitude: ${lat}, Longitude: ${long}`);
    fetchWeatherData(null, lat, long);
}

function error(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}

function getAutoLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getLocations, error);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// Default city when the page loads
let cityInput = "";

// Add click event to each city in the panel
cities.forEach((city) => {
    city.addEventListener('click', (e) => {
        cityInput = e.target.innerHTML;
        fetchWeatherData(cityInput, null, null);
        app.style.opacity = "0";
    });
});

form.addEventListener('submit', (e) => {
    if (search.value.length === 0) {
        alert("Please type a city name");
    } else {
        cityInput = search.value;
        fetchWeatherData(cityInput, null, null);
        search.value = "";
        app.style.opacity = "0";
    }
    e.preventDefault();
});

// Function to get the day of the week from a date string
function dayOfTheWeek(dateString) {
    const date = new Date(dateString);
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return weekday[date.getDay()];
}

function fetchWeatherData(cityInput, lat, long) {
    const apiKey = '68868b955e28492985c132915240109'; // Replace with your actual API key
    let url;

    if (lat !== null && long !== null) {
        url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${long}&days=7`;
    } else if (cityInput) {
        url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${cityInput}&days=8`;
    } else {
        alert('City not found. Please try again.');
        return;
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Display current weather data
            temp.innerHTML = parseInt(data.current.temp_c) + "&#176;";
            feelslike.innerHTML = "Feels Like: " + data.current.feelslike_c + "&#176;";
            conditionOutput.innerHTML = data.current.condition.text;

            const date = data.location.localtime;
            const y = parseInt(date.substring(0, 4));
            const m = parseInt(date.substring(5, 7));
            const d = parseInt(date.substring(8, 10));
            const time = date.substring(11);

            dateOutput.innerHTML = `${d}/${m}/${y}`;
            timeOutput.innerHTML = time + " ";
            nameOutput.innerHTML = data.location.name;

            icon.src = data.current.condition.icon;
            cloudOutput.innerHTML = data.current.cloud + "%";
            humidityOutput.innerHTML = data.current.humidity + "%";
            windOutput.innerHTML = data.current.wind_kph + "km/h";

            let timeOfDay = "day";
            const code = data.current.condition.code;
            if (data.current.is_day === 0) {
                timeOfDay = "night";
            }

            if (code === 1000) {
                app.style.backgroundImage = `url('./images/${timeOfDay}/clear.jpg')`;
                btn.style.background = "#e5ba92";
                if (timeOfDay === "night") {
                    btn.style.background = "#181e27";
                }
            } else if (code >= 1003 && code <= 1030 || code >= 1069 && code <= 1087 || code >= 1135 && code <= 1282) {
                app.style.backgroundImage = `url('./images/${timeOfDay}/cloudy.jpg')`;
                btn.style.background = "#fa6d1b";
                if (timeOfDay === "night") {
                    btn.style.background = "#181e27";
                }
            } else if (code >= 1063 && code <= 1246) {
                app.style.backgroundImage = `url('./images/${timeOfDay}/rainy.jpg')`;
                btn.style.background = "#647d75";
                if (timeOfDay === "night") {
                    btn.style.background = "#325c80";
                }
            } else {
                app.style.backgroundImage = `url('./images/${timeOfDay}/snowy.jpg')`;
                btn.style.background = "#4d72aa";
                if (timeOfDay === "night") {
                    btn.style.background = "#1b1b1b";
                }
            }

            app.style.opacity = "1";

            // Clear the forecast container
            forecastContainer.innerHTML = "";

            // Display the 7-day forecast with day names
            const forecast = data.forecast.forecastday;
            const n = forecast.length; // or any specific number you want

            for (let i = 1; i <= n; i++) {
                const day = forecast[i]; // Adjusting the index to start from 0
                const date = day.date;
                const weekday = dayOfTheWeek(date); // Get the day of the week
                const condition = day.day.condition.text;
                const icon = day.day.condition.icon;
                const maxtemp = parseInt(day.day.maxtemp_c);
                const mintemp = parseInt(day.day.mintemp_c);
                const temp = maxtemp + ' / ' + mintemp;

                const dayDiv = document.createElement('div');
                dayDiv.classList.add('day-forecast');

                dayDiv.innerHTML = `
                    <h3>${weekday}</h3>
                    <img src="${icon}" alt="${condition}" class="forecast-icon" />
                    <span>${maxtemp}' / '${mintemp}</span>
                `;

                forecastContainer.appendChild(dayDiv);
            }
        })
/*         .catch(() => {
            alert("City not found. Please try again.");
            app.style.opacity = "1";
        }); */
}

app.style.opacity = "1";
