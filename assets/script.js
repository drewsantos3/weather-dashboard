// global variables including API key
const form = document.querySelector(".form");
const forecastCard = document.querySelector(".forecast");
const citySearch = JSON.parse(localStorage.getItem("city")) || [];
const cityInput = document.querySelector("#cityInput");
const searchButton = document.querySelector("#searchButton");
const currentWeather = document.querySelector(".current-weather");
const savedCities = document.querySelector("#saved-cities");
const APIkey = "e0c073679a9efdb1f66a406e344f3085";
const baseURL = "https://api.openweathermap.org";

// function to retrieve weather from api and catch invalid input
function getResponse(search) {
  let apiURL = `${baseURL}/geo/1.0/direct?q=${search}&appid=${APIkey}`;
  fetch(apiURL).then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (!data[0]) {
        alert("try a different city");
      } else {
        apiResponse(data[0]);
      };
    })
    .catch(function (error) {
      console.error(error);
    });
};
// function for current weather card
function weatherCard(city, weather) {
  let pic = `https://openweathermap.org/img/w/${weather.weather[0].icon}.png`;
  let date = dayjs().format("M/D/YYYY");
  let card = document.createElement("div");
  let header = document.createElement("h2");
  let bg = document.createElement("div");
  let weatherIcon = document.createElement("img");
  let windEl = document.createElement("p");
  let humidityEl = document.createElement("p");
  let tempEl = document.createElement("p");
  let temp = weather.main.temp;
  let windspeed = weather.wind.speed;
  let humidity = weather.main.humidity;
  currentWeather.append(card);
  card.append(bg);
  header.textContent = `${city}(${date})`;
  header.append(weatherIcon);
  humidityEl.textContent = `Humidity level: ${humidity} Percent`;
  windEl.textContent = `Wind Speed: ${windspeed} Mph`;
  tempEl.textContent = `Temperature: ${temp} F°`;
  weatherIcon.setAttribute("src", pic);
  bg.append(header, weatherIcon, tempEl, windEl, humidityEl);
};
// five Day Forecast function
function forecast(forecastData) {
  forecastData.forEach((day) => {
    let currentDate = day.dt_txt.split(" ")[1];
    // get current date for selected city and append
    if (currentDate === "00:00:00") {
      const date = dayjs(day.dt_txt).format("M/D/YYYY");
      const dayDiv = document.createElement("div");
      const iconURL = `https://openweathermap.org/img/w/${day.weather[0].icon}.png`;
      dayDiv.innerHTML += `<div><div>${date}</div><div>${day.main.temp}</div><div>${day.wind.speed}</div><div>${day.main.humidity}</div> <img src="${iconURL}"></div>`;
      forecastCard.append(dayDiv);
    };
  });
};
// render function calls
function render(city, data) {
  weatherCard(city, data.list[0], data.city.timezone);
  forecast(data.list);
};

function apiResponse(location) {
  let { lat, lon } = location;
  let city = location.name;
  let apiURL = `${baseURL}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${APIkey}`;
  fetch(apiURL).then(function (response) {
      return response.json();
    })
    .then(function (data) {
      render(city, data);
    });
};
// save search into local storage
function handleForm(event) {
  forecastCard.innerHTML = "";
  currentWeather.innerHTML = "";
  let city = event.target.getAttribute("data-city") || cityInput.value;
  if (!citySearch.includes(city) && city !== "") {
    citySearch.push(city);
    localStorage.setItem("city", JSON.stringify(citySearch));
  };
  event.preventDefault();
  const search = city.trim();
  getResponse(search);
  cityInput.value = "";
};
// init function
function init() {
  citySearch.forEach((city) => {
    savedCities.innerHTML += `<button data-city="${city}">${city}</button>`;
  });
};

// function calls and event listeners
init();
// search button
form.addEventListener("submit", handleForm);
// saved city buttons
savedCities.addEventListener("click", handleForm);