const APIKey= "77bed057d1e682674477e0e3d7e2e2a5"
document
  .getElementById("searchCity")
  .addEventListener("submit", function (event) {
    // Prevent the default form submission
    event.preventDefault();
    // Get the city name from the input field
    const cityInput = document.getElementById("cityInput");
    // Trim the city name to remove any extra spaces
    const city = cityInput.value.trim();
    // If the user enters a city name, fetch the weather forecast for that city
    if (city !== "") {
      getWeatherData(city);
      // Clear the input field after the user submits the form
      cityInput.value = "";
    } else {
      // If the user doesn't put anything in the input field, alert them to enter a city name.
      alert("Please enter a city name");
    }
  });

// API key for OpenWeatherMap and fetch the url with the city variable and API key variable
function getWeatherData(city) {
  // API Key which allows us to make request to the secure server.
  const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`;
  // Fetch the data from the API
  fetch(queryURL)
    .then(function (response) {
      return response.json();
    })
    // Display the data in console
    .then(function (data) {
      console.log(data);
      // Save the searched city to the past searches local storage array
      saveCity(city);
      // Render after page reload
      displaySavedCities();
      // Display the current weather data
      displayDailyForecast(data, city);
      // Set the current city name and data to local storage
      getFiveDayForecast(data.coord.lat, data.coord.lon);
      localStorage.setItem("cityName", city);
      localStorage.setItem("currentData", JSON.stringify(data));
    });
}

// Function to display the current day data
function saveCity(city) {
  // Get the saved cities from local storage
  let savedCities = JSON.parse(localStorage.getItem("savedCities")) || [];
  // If the city is not already saved, add it to the saved cities array
  if (!savedCities.includes(city)) {
    savedCities.push(city);
    localStorage.setItem("savedCities", JSON.stringify(savedCities));
  }
}

// Function to display the saved cities on the page in the search history
function displaySavedCities() {
  // Get the saved cities from local storage
  const savedCities = JSON.parse(localStorage.getItem("savedCities")) || [];
  // Get the container where the saved cities will be displayed
  const savedCitiesContainer = document.querySelector(".savedCities");
  // Clear the created buttons for the cities that have been saved to the search history when clicked again so there isnt another button created
  savedCitiesContainer.innerHTML = "";
  // Create a button for each city that has been searched and saved
  savedCities.forEach((city) => {
    // Create a button element for the city
    const button = document.createElement("button");
    // Add the classes and event listener to the button
    button.classList.add("btn", "btn-secondary");
    // Attach the event listener to the button so that when clicked, the weather data for that city is displayed
    button.addEventListener("click", function () {
      getWeatherData(city);
    });
    // Set the text content of the button to the city name
    button.textContent = city;
    savedCitiesContainer.appendChild(button);
  });
}

// Display the data on the page
function displayDailyForecast(data, city) {
  // Set the date and iconDay variables
  const date = new Date(data.dt * 1000).toLocaleDateString();
  const iconDay = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
  document.getElementById(
    "dailyName"
    // Add the city name, date, and icon to the header tag
  ).innerHTML = `${city} (${date}) <img src="${iconDay}">`;
  // Set the temperature, wind speed, and humidity by using the get element by id method
  document.getElementById("temperature").textContent = kelvinToFahrenheit(data.main.temp);
  document.getElementById("windspeed").textContent = data.wind.speed;
  document.getElementById("humiditydaily").textContent = data.main.humidity;
}

// Get details from lat and lon make variables
function getFiveDayForecast(lat, lon) {
  // API Key which allows us to make request to the server.
  const fiveDayURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}`;
  // Fetch the data from the Five Day Forecast API
  fetch(fiveDayURL)
    .then(function (response) {
      return response.json();
    })
    // Display the data in the console and set the data to local storage
    .then(function (data) {
      displayFiveDayForecast(data);
      localStorage.setItem("fiveDayData", JSON.stringify(data));
    })
    // Catch any errors that may occur
    .catch(function (error) {
      console.log(
        "There has been a problem with your fetch operation: ",
        error.message
      );
    });
}
// Function to display the weather data for the city
function displayFiveDayForecast(data) {
  // Get the list of forecasts from the response data
  const forecasts = data.list;

  // Iterate through the next five days' forecasts
  for (let i = 0; i < 5; i++) {
    // Get the forecast data for the current day
    const forecast = forecasts[i];
    
    // Extract the relevant information for display
    const date = new Date(Date.now() + (i * 24 * 60 * 60 * 1000)).toLocaleDateString();
    const iconUrl = `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
    // Sets the temperaute to farhenheit by using the kelvin to farenheight function which returns the farenheight variable
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

// Change the temperatures from Kelvin to Fahrenheit
function kelvinToFahrenheit(temp) {
  // Variable for farenheight formula
  const fahrenheit = ((temp - 273.15) * 9) / 5 + 32;
  // Return the farenheight variable to the function
  return fahrenheit.toFixed(2);
}
// Render the saved cities buttons onto the page after the page reloads
displaySavedCities();