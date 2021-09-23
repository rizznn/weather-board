var apiKey = '8823044c5dc41939822c0d258eaf31c6';

var searchFormEl = document.querySelector("#form");
var cityInputEl = document.querySelector("#searchCity");
var historyContainerEl = document.querySelector("#historyContainer");
var cityName = document.querySelector("#cityName");

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