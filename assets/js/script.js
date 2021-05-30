var searchFormEl = document.querySelector("#form");
var cityInputEl = document.querySelector("#searchCity");

var apiKey = '8823044c5dc41939822c0d258eaf31c6';
var city = 'Toronto';

getData(city);
function getData(city){
    // format the github api url
    var apiUrl = `https:api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;
    // make a request to the url
    fetch(apiUrl).then(function(response) {
        response.json().then(function(data) {
            console.log(data);
        });
    });

};


var formSubmit = function(event) {
    event.preventDefault();
    // get value from input element
    var searchCity = cityInputEl.value.trim();

    if (searchCity) {
    getData(searchCity);
    cityInputEl.value = "";
    } else {
    alert("Please enter a city");
    }
};

searchFormEl.addEventListener("submit", formSubmit);