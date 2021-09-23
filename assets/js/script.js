var apiKey = '8823044c5dc41939822c0d258eaf31c6';

var cityInputEl = document.querySelector("#searchCity");
var searchBtnEl = document.querySelector("#searchBtn");
var clearHistoryEl = document.querySelector("#clearHistory");
var cityNameEl = document.querySelector("#cityNameEl");
var currentImgEl = document.querySelector("#currentImg");
var currentTempEl = document.querySelector("#temperature");
var currentHumidityEl = document.querySelector("#humidity");
var currentWindEl = document.querySelector("#wind-speed");
var currentUVEl = document.querySelector("#UV-index");
var historyContainerEl = document.querySelector("#history");
var fivedayEl = document.querySelector("#fiveday-header");
var todayweatherEl = document.querySelector("#today-weather");

let searchHistory = JSON.parse(localStorage.getItem("search")) || [];

function getWeatherData(city) {
    let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey;
    axios.get(queryURL)
        .then(function (response) {
            todayweatherEl.classList.remove("d-none");
        
            // Parse response
            var todayDate = new Date(response.data.dt * 1000);
            var day = todayDate.getDate();
            var month = todayDate.getMonth() + 1;
            var year = todayDate.getFullYear();
            cityNameEl.innerHTML = response.data.name + " (" + month + "/" + day + "/" + year + ") ";
            let weatherImg = response.data.weather[0].icon;
            currentImgEl.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherImg + "@2x.png");
            currentImgEl.setAttribute("alt", response.data.weather[0].description);
            currentTempEl.innerHTML = "Temperature: " + k2f(response.data.main.temp) + " &#176F";
            currentHumidityEl.innerHTML = "Humidity: " + response.data.main.humidity + "%";
            currentWindEl.innerHTML = "Wind Speed: " + response.data.wind.speed + " MPH";
            
            // UV Index
            let lat = response.data.coord.lat;
            let lon = response.data.coord.lon;
            let UVQueryURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&cnt=1";
            axios.get(UVQueryURL)
                .then(function (response) {
                    let UVIndex = document.createElement("span");
                    
                    // UV Index shows different colors: green when it's good, yellow when it's ok, red when bad 
                    if (response.data[0].value < 4 ) {
                        UVIndex.setAttribute("class", "badge badge-success");
                    }
                    else if (response.data[0].value < 8) {
                        UVIndex.setAttribute("class", "badge badge-warning");
                    }
                    else {
                        UVIndex.setAttribute("class", "badge badge-danger");
                    }
                    console.log(response.data[0].value)
                    UVIndex.innerHTML = response.data[0].value;
                    currentUVEl.innerHTML = "UV Index: ";
                    currentUVEl.append(UVIndex);
                });

                // Five-day forecast for that city
                let cityID = response.data.id;
                let forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + apiKey;
                axios.get(forecastQueryURL)
                    .then(function (response) {
                        fivedayEl.classList.remove("d-none");
                        
                        //  Parse response to display forecast for next 5 days
                        const forecastEls = document.querySelectorAll(".forecast");
                        for (i = 0; i < forecastEls.length; i++) {
                            forecastEls[i].innerHTML = "";
                            var forecastIndex = i * 8 + 4;
                            var forecastDate = new Date(response.data.list[forecastIndex].dt * 1000);
                            var forecastDay = forecastDate.getDate();
                            var forecastMonth = forecastDate.getMonth() + 1;
                            var forecastYear = forecastDate.getFullYear();
                            var forecastDateEl = document.createElement("p");
                            forecastDateEl.setAttribute("class", "mt-3 mb-0 forecast-date");
                            forecastDateEl.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
                            forecastEls[i].append(forecastDateEl);

                            // Icon for current weather
                            var forecastWeatherEl = document.createElement("img");
                            forecastWeatherEl.setAttribute("src", "https://openweathermap.org/img/wn/" + response.data.list[forecastIndex].weather[0].icon + "@2x.png");
                            forecastWeatherEl.setAttribute("alt", response.data.list[forecastIndex].weather[0].description);
                            forecastEls[i].append(forecastWeatherEl);
                            var forecastTempEl = document.createElement("p");
                            forecastTempEl.innerHTML = "Temp: " + k2f(response.data.list[forecastIndex].main.temp) + " &#176F";
                            forecastEls[i].append(forecastTempEl);
                            var forecastHumidityEl = document.createElement("p");
                            forecastHumidityEl.innerHTML = "Humidity: " + response.data.list[forecastIndex].main.humidity + "%";
                            forecastEls[i].append(forecastHumidityEl);
                        }
                    })
            });
    }
        
    // Get history if there's history from local storage
    searchBtnEl.addEventListener("click", function () {
        const searchTerm = cityInputEl.value;
        getWeather(searchTerm);
        searchHistory.push(searchTerm);
        localStorage.setItem("search", JSON.stringify(searchHistory));
        renderSearchHistory();
    })

var formSubmit = function(event) {
    event.preventDefault();
    // get value from input element
    var searchCity = cityInputEl.value.trim();

    if (searchCity) {
        getData(searchCity);

        // historyContainerEl.textContent = '';
        // cityInputEl.value = "";
    } else {
        alert("Please enter a city");
    }
};


getData(city);
function getData(city){
    // format the github api url
    var apiUrlF = `https:api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
    // make a request to the url
    fetch(apiUrlF)
        .then(function(response) {
            // request was successful
            if (response.ok) {
                console.log(response);
                response.json().then(function(data) {
                    console.log(data);
                    displayResult(data, city);
                });
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .catch(function(error) {
            alert('Unable to connect to OpenWeather');
        });
};

var displayResult = function(temp, specificCity){
    console.log(temp);
    console.log(specificCity);
 
      // check if api returned any data
    if (temp.length === 0) {
        tempContainerEl.textContent = 'No data found.';
        return;
    }

    cityName.textContent = specificCity;

    // loop over temp
    for (var i = 0; i < temp.length; i++) {
        // format temp name
        var tempName = temp[i].name + "/" + temp[i].main[3];
    
        // create a container for each temp
        var tempEl = document.createElement("div");
        tempEl.classList = "list-item flex-row justify-space-between align-center";
    
        // create a span element to hold city name
        var titleEl = document.createElement("span");
        titleEl.textContent = tempName;
    
        // append to container
        tempEl.appendChild(titleEl);

        // create a status element
        var statusEl = document.createElement('span');
        statusEl.classList = 'flex-row align-center';
        
        statusEl.innerHTML = temp[i].main.weather;

        // append to container
        tempEl.appendChild(statusEl);

        // append container to the dom
        historyContainerEl.appendChild(tempEl);

    }
    
}



// `https:api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;



searchFormEl.addEventListener("submit", formSubmit);