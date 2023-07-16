// global variables
const searchBtn = document.querySelector("#search-btn");

const searchInput = document.querySelector("#search-input");
const cityDiv = document.querySelector("#city-div");
const currentWeather = document.querySelector("#current-div");
const forecastDiv = document.querySelector("#forecast-div");
const asideSaved = document.querySelector("#saved-cities");
let citiesArray = JSON.parse(localStorage.getItem("Cities")) || [];

// functions
function init() {
let count = 0;
  citiesArray.forEach((object) => {
    if (count < 10) {
      let pastCity = document.createElement("div");
      if (object.city.split(" ").length > 1) {
        let newString = "";
        for (let i = 0; i < object.city.split(" ").length; i++) {
          newString += object.city.split(" ")[i][0].toUpperCase() + object.city.split(" ")[i].toLowerCase().slice(1);
          newString += " ";
        }
        pastCity.innerHTML = newString.trim();
      } else {
        pastCity.innerHTML = object.city[0].toUpperCase() + object.city.toLowerCase().slice(1);
      }

      asideSaved.append(pastCity);
      count++;
      pastCity.classList.add("past-styling");
      pastCity.addEventListener("click", pastSearch);
    }
  });
}

function getWeather(city) {
  forecastDiv.classList.remove("hidden");
  currentWeather.classList.remove("hidden");
  cityDiv.classList.remove("hidden");
  let currentDayUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=517f19dc586407c39701b016a6edf914&units=imperial`;
  
  fetch(currentDayUrl)
    .then((response) => response.json())
    .then((data) => {
      currentWeather.innerHTML = "";
      let date = dayjs().format("M/D/YYYY");
      let currentDay = document.createElement("div");
      currentDay.innerHTML += `<h2>${data.name} (${date})</h2>`;
      currentDay.innerHTML += `<img class="mx-auto" src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="weather icon">`;
      currentDay.innerHTML += `<p>Temperature: ${data.main.temp} °F</p>`;
      currentDay.innerHTML += `<p>Humidity: ${data.main.humidity}%</p>`;
      currentDay.innerHTML += `<p>Wind Speed: ${data.wind.speed} MPH</p>`;
      if (data.weather[0].main === "Rain") {
        currentDay.innerHTML += `<p>UV Index: <span class="badge badge-danger">Dangerous</span></p>`;
      }
      if (data.weather[0].main === "Clouds") {
        currentDay.innerHTML += `<p>UV Index: <span class="badge badge-warning">Moderate</span></p>`;
      }
      if (data.weather[0].main === "Clear") {
        currentDay.innerHTML += `<p>UV Index: <span class="badge badge-success">Favorable</span></p>`;
      }
      currentDay.classList.add("current-div");
      currentWeather.append(currentDay);
    });

      let requestUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=1216c6d8b1f2b30f4fcbb22eb9353470&units=imperial`;
      fetch(requestUrl)
        .then((response) => response.json())
        .then((data) => {
          cityDiv.innerHTML = "";
          data.list.forEach((object) => {
            let time = object.dt_txt.split(" ")[1];
            let date = dayjs(object.dt_txt.split(" ")[0]).format("M/D/YYYY");
            if (time === "12:00:00") {
              let day = document.createElement("div");
              day.innerHTML += `<h3>${date}</h3>`;
              day.innerHTML += `<img class="mx-auto" src="https://openweathermap.org/img/wn/${object.weather[0].icon}@2x.png" alt="weather icon">`;
              day.innerHTML += `<p>Temperature: ${object.main.temp} °F</p>`;
              day.innerHTML += `<p>Humidity: ${object.main.humidity}%</p>`;
              day.innerHTML += `<p>Wind Speed: ${object.wind.speed} MPH</p>`;
              if (object.weather[0].main === "Rain") {
                day.innerHTML += `<p>UV Index: <span class="badge badge-danger">Dangerous</span></p>`;
              }
              if (object.weather[0].main === "Clouds") {
                day.innerHTML += `<p>UV Index: <span class="badge badge-warning">Moderate</span></p>`;
              }
              if (object.weather[0].main === "Clear") {
                day.innerHTML += `<p>UV Index: <span class="badge badge-success">Favorable</span></p>`;
              }
              day.classList.add("city-div");
              cityDiv.append(day);
            }
          }
          );
        });
    };


function pastSearch(event) {
  let city = event.target.innerHTML;
  getWeather(city);
}

function search() {
  let city = searchInput.value;
  getWeather(city);
  let cityObject = {
    city: city,
  };
  citiesArray.unshift(cityObject);
  localStorage.setItem("Cities", JSON.stringify(citiesArray));
}

init();
searchBtn.addEventListener("click", search);





      

