const getWeather = document.getElementById("getWeatherBtn"); // Get button field
const cityInput = document.getElementById("city"); // Get input field
const weatherInfo = document.getElementById("weatherInfo"); // Display section for weather info
const foreCastContainer = document.getElementById("foreCastInfo"); // Display area for 5-day forecast
const errorMessage = document.getElementById("errorMessage"); // Display error message
const clearButton = document.getElementById("clearBtn"); // Grab button field
const themeToggleBtn = document.getElementById("themeToggleBtn"); // Grab button field
const newCityInput = document.getElementById("newCityInput");
const addCityBtn = document.getElementById("addCityBtn");
const cityList = document.getElementById("cityList");

let favoriteCities = []; // Initialize the list of favourive cities

// Function to render cities
function renderCities() {
    cityList.innerHTML = ''; // Clear the city list container
    favoriteCities.forEach((city, index) => {
      const cityItem = document.createElement('li'); // Create a list item for each city
      cityItem.textContent = city; // Set the city name as the text content
      const deleteBtn = document.createElement('button'); // Create a delete button
      deleteBtn.textContent = 'Delete'; // Label the delete button
      deleteBtn.addEventListener('click', () => deleteCity(index)); // Attach an event listener to delete the city
      cityItem.appendChild(deleteBtn); // Append the delete button to the city item
      cityList.appendChild(cityItem); // Add the city item to the list
    });
}

// Add event listener to the "Add City" button
addCityBtn.addEventListener('click', () => {
    const city = newCityInput.value; // Get the value of the input field
    if (city && !favoriteCities.includes(city)) { // Add the city only if it's not empty and not already in the list
      addCity(city);
    }
  });
  
  // Function to add a city to the favorite list
  function addCity(city) {
    favoriteCities.push(city); // Add the city to the array
    renderCities(); // Re-render the list of cities
  }

  
  // Function to delete a city from the favorite list
  function deleteCity(index) {
    favoriteCities.splice(index, 1); // Remove the city at the given index
    renderCities(); // Re-render the list of cities
  }


// Add event listener for when the button is clicked
getWeather.addEventListener("click", function() {
    // Get the city entered by the user
    const city = cityInput.value;
    console.log("City entered:", city);
    
    // Check for whether user entered a city
    if (city === "") {
        alert("Please input a city");
        return; // Stop the function if no city is entered
    }

    // Clear any previous error message
    errorMessage.innerHTML = '';

    // Fetch current weather data
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=8f1fbfdb5ec2f824b7d3b0d7dc46d6b3&units=metric`) // API request for weather data for the inputted city
        .then(response => response.json()) // Convert API response to JSON
        .then(data => {
            // Check for invalid city
            if (data.cod !== 200) {
                throw new Error('City not found');
            }
            console.log("Weather data:", data);

            // Extract info
            const cityName = data.name; // City name
            const temperature = data.main.temp; // Temperature
            const description = data.weather[0].description; // Weather condition
            const windSpeed = data.wind.speed; // Wind speed
            const humidity = data.main.humidity; // Humidity
            const pressure = data.main.pressure; // Pressure

            // Display the data dynamically on the page
            weatherInfo.innerHTML = `
                <h2>${cityName}</h2>
                <p>Temperature: ${temperature}°C</p>
                <p>Condition: ${description}</p>
                <p>Wind Speed: ${windSpeed} m/s</p>
                <p>Humidity: ${humidity}%</p>
                <p>Pressure: ${pressure} hPa</p>
            `;
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            errorMessage.innerHTML = "Please enter a valid city name.";
        });


    // Fetch forecast data
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=8f1fbfdb5ec2f824b7d3b0d7dc46d6b3&units=metric`) // API request for 5-day forecast
        .then(response => response.json()) // Convert API response to JS object
        .then(data => {
            // Check for invalid city
            if (data.cod !== '200') {
                throw new Error('City not found');
            }
            console.log("Forecast data:", data);

            let forecastHtml = ''; // Initialize an empty string to hold forecast HTML
            
            // Looping through the forecast data
            data.list.forEach((forecast, index) => {
                if (index % 8 === 0) { // Get weather data for every 8th entry
                    const date = new Date(forecast.dt * 1000); // Convert timestamp to a date
                    const temperature = forecast.main.temp; // Temperature
                    const condition = forecast.weather[0].description; // Weather condition
                    const time = date.toLocaleDateString("en-US", { weekday: 'long', hour: 'numeric', minute: 'numeric' }); // Format date

                    // Dynamically display the data on the page
                    forecastHtml += `
                        <div>
                            <h3>${time}</h3>
                            <p>Temperature: ${temperature}°C</p>
                            <p>Condition: ${condition}</p>
                        </div>
                    `;
                }            
            });
            foreCastContainer.innerHTML = forecastHtml;            
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            errorMessage.innerHTML = "Please enter a valid city name.";
        });
});

// Event listener for clear button
clearButton.addEventListener("click", () => {
    cityInput.value = ""; // Clear the input field
    weatherInfo.innerHTML = ""; // Clear the weather display
    foreCastContainer.innerHTML = ""; // Clear the forecast display
    errorMessage.innerHTML = ""; // Clear the error message
});


// Event listener for "Toggle Theme" button
themeToggleBtn.addEventListener("click", () => {
    // Toggle the 'dark-mode' class on the body
    document.body.classList.toggle("dark-mode");
});
    