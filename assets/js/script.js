const APIKey= "77bed057d1e682674477e0e3d7e2e2a5"
// On document load, add event listener to search city button
document
  .getElementById("searchCity")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    // Submit button takes data from input field
    const cityInput = document.getElementById("cityInput");
    const city = cityInput.value.trim();
    if (city !== "") {
      getWeatherData(city);
      // Clear input field after form submit
      cityInput.value = "";
    } else {
      // If no city name is input, display alert
      alert("Please enter a city name");
    }
  });

function getWeatherData(city) {
  // Query to API using city and APIKey variable
  const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`;
  // Fetch from API
  fetch(queryURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // console.log to check that data is being fetched 
      console.log(data);
      // Function defined below to save previous searched cities
      saveCity(city);
      // Fucntion defined below to render data to page
      displaySavedCities();
      // Function defined below to display current weather data for selected city
      displayDailyForecast(data, city);
      // Save current searched city to localStorage
      getFiveDayForecast(data.coord.lat, data.coord.lon);
      localStorage.setItem("cityName", city);
      localStorage.setItem("currentData", JSON.stringify(data));
    });
}

function saveCity(city) {
  // Pull saved cities from localStorage
  let savedCities = JSON.parse(localStorage.getItem("savedCities")) || [];
  // Save new city searches to localStorage
  if (!savedCities.includes(city)) {
    savedCities.push(city);
    localStorage.setItem("savedCities", JSON.stringify(savedCities));
  }
}

function displaySavedCities() {
  // Pull saved cities from localStorage
  const savedCities = JSON.parse(localStorage.getItem("savedCities")) || [];
  const savedCitiesContainer = document.querySelector(".savedCities");
  savedCitiesContainer.innerHTML = "";
  // Create selector button for previously searched cities
  savedCities.forEach((city) => {
    const button = document.createElement("button");
    button.classList.add("btn", "btn-secondary");
    // Add event listener to previous searches
    button.addEventListener("click", function () {
      getWeatherData(city);
    });
    button.textContent = city;
    savedCitiesContainer.appendChild(button);
  });
}
// Function to display current city daily forecast
function displayDailyForecast(data, city) {
  const date = new Date(data.dt * 1000).toLocaleDateString();
  const iconDay = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
  document.getElementById(
    "dailyName"
    // Add the city name, date, and icon to the header tag
  ).innerHTML = `${city} (${date}) <img src="${iconDay}">`;
  // Display data for current city from API call
  document.getElementById("temperature").textContent = kelvinToFahrenheit(data.main.temp);
  document.getElementById("windspeed").textContent = data.wind.speed;
  document.getElementById("humiditydaily").textContent = data.main.humidity;
}

function getFiveDayForecast(lat, lon) {
  // API call for 5 Day Forecast
  const fiveDayURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}`;
  fetch(fiveDayURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      displayFiveDayForecast(data);
      localStorage.setItem("fiveDayData", JSON.stringify(data));
    })
    // Error catch
    .catch(function (error) {
      console.log(
        "Unable to fetch data: ",
        error.message
      );
    });
}
// Function displays data for current city
function displayFiveDayForecast(data) {
  const forecasts = data.list;
  // Iterate through the next five days' forecasts
  for (let i = 0; i < 5; i++) {
    // Get the forecast data for the current day
    const forecast = forecasts[i];  
    // Extract the relevant information for display
    const date = new Date(Date.now() + (i * 24 * 60 * 60 * 1000)).toLocaleDateString();
    const iconUrl = `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
    // Function defined below converts returned data from Kelvin to Fahrenheit
    const temperature = kelvinToFahrenheit(forecast.main.temp);
    const windSpeed = forecast.wind.speed;
    const humidity = forecast.main.humidity;
    // Set the content for each forecast card
    document.getElementById(`icon${i + 1}`).setAttribute("src", iconUrl);
    document.getElementById(`date${i + 1}`).textContent = date;
    document.getElementById(`temp${i + 1}`).textContent = temperature;
    document.getElementById(`wind${i + 1}`).textContent = windSpeed;
    document.getElementById(`humidity${i + 1}`).textContent = humidity;
  }
}
// Kelvin to Fahrenheit converter function
function kelvinToFahrenheit(temp) {
  const fahrenheit = ((temp - 273.15) * 9) / 5 + 32;
  return fahrenheit.toFixed(2);
}
// On document load, display previously searched data
displaySavedCities();