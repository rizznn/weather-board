var apiKey = '8823044c5dc41939822c0d258eaf31c6';
var city = 'Toronto';

getData(city);
function getData(city){
    fetch(`https:api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`)
    .then(function(response) {
        response.json()
        .then(function(data) {
            console.log(data);
        });
    });

};


