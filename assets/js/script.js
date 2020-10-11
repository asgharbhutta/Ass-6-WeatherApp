//ref to user input ele
var cityFormEl = document.querySelector("#input-form");

//ref to display the data
weatherContainerEl = document.querySelector("#city-container");
citySearchEl = document.querySelector("#city-search-term");
forcastContainerEl = document.querySelector("#forcast-container");


var getWeatherData = function(city){
    var apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=443d53b576fbee38c5cf0db4dbe2ff2b";

    fetch(apiURL)
    .then(function(response){
        if(response.ok){
            response.json()
            .then(function(data){
                displayWeatherData(data, city);
                //console.log(data);
            });
        }else{
            alert("Error Returned: " + response.statusText);
        }
    })
};


//This executes when the event listener kicks off
var formSubmitHandler = function(event){
    event.preventDefault();
    var cityInputFormEl = document.querySelector("#city").value.trim();
    if(cityInputFormEl){
        getWeatherData(cityInputFormEl);
        getForcastData(cityInputFormEl);
        cityInputFormEl.value = "";
    }else{
        alert("Enter a correct city name!");
    }
}

var displayWeatherData = function(data, cityname){
    weatherContainerEl.textContent = "";
    citySearchEl.textContent = cityname;

    //check if api returned any repos
    if(data.length === 0){
        weatherContainerEl.textContent = "No repos found, try again";
        return;
    }
        //get temperature
        var temperature = Math.round(data.main.temp - 273.15);
        var temperatureEl = document.createElement("div");
        temperatureEl.classList = "list-item flex-row justify-space-between align-center";
        temperatureEl.textContent = "Temperature: " + temperature + " C";

        //get humidity
        var humidity = data.main.humidity
        var humidityEl = document.createElement("div");
        humidityEl.classList = "list-item flex-row justify-space-between align-center";
        humidityEl.textContent = "Humidity: " + humidity + " %";

        //wind speed
        var windSpeed = data.wind.speed
        var windSpeedEl = document.createElement("div");
        windSpeedEl.classList = "list-item flex-row justify-space-between align-center";
        windSpeedEl.textContent = "Wind Speed " + windSpeed + " / MPH"

        //UV index
        var uvIndexLon = data.coord.lon;
        var uvIndexLat = data.coord.lat;
        var uvEl = document.createElement("div");
        var uvURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + uvIndexLat + "&lon=" + uvIndexLon + "&appid=443d53b576fbee38c5cf0db4dbe2ff2b"
        fetch(uvURL)
        .then(function(response){
            if(response.ok){
                response.json()
                .then(function(uvData){
                    var uvIndex = uvData.value;
                    if(uvIndex > 7){
                        uvEl.classList = "alert alert-danger";
                    }else if(uvIndex > 4 && uvIndex < 7){
                        uvEl.classList = "alert alert-warning";
                    }else{
                        uvEl.classList = "alert alert-success";
                    }
            
                    uvEl.textContent = "UV Index: " + uvIndex;
        
                }) //here
            }else{
                alert("Error Returned: " + response.statusText);
            }
        })
        //append to outer container
        weatherContainerEl.appendChild(temperatureEl);
        weatherContainerEl.appendChild(humidityEl);
        weatherContainerEl.appendChild(windSpeedEl);
        weatherContainerEl.appendChild(uvEl);
}

var getForcastData = function(cityname){
    var apiForcast = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityname + "&appid=443d53b576fbee38c5cf0db4dbe2ff2b&limit=5"

    fetch(apiForcast)
    .then(function(response){
        if(response.ok){
            response.json()
            .then(function(data){
             displayForcastData(data)  
            });
        }else{
            alert("Error Returned: " + response.statusText);
        }
    })
};

var displayForcastData = function(data){
    forcastContainerEl.textContent = ""

    for(i = 0; i < 40; i = 8 + i){

       //get date data from object and split it from the time 
       var dateForcast = data.list[i].dt_txt;
       var dateForcastTrim = dateForcast.split(" ");
       var dateSpan = document.createElement("span");
       dateSpan.classList = "forcast-card-data";
       dateSpan.textContent = dateForcastTrim[0];

       //get weather image
       var weatherDescription = data.list[i].weather[0].description;
       var imageLink = document.createElement("span");
       
        if(weatherDescription == "clear sky"){
            imageLink.classList = "fas fa-cloud-sun"
        }else if(weatherDescription == "overcast clouds"){
            imageLink.classList = "fas fa-cloud"
        }else if(weatherDescription == "scattered clouds"){
            imageLink.classList = "fas fa-cloud-moon"
        }else if(weatherDescription == "light rain"){
            imageLink.classList = "fas fa-cloud-rain"
        }else if(weatherDescription == "broken clouds"){
            imageLink.classList = "fas fa-cloud-meatball"
        }else if(weatherDescription == "overcast clouds"){
            imageLink.classList = "fas fa-cloud-moon-rain"
        }else{
            imageLink.classList = "fas fa-sun";
        }
        $(imageLink).addClass("fa-2x");

       //get temperature
       var temperature = Math.round(data.list[i].main.temp - 273.15);
       var temperatureEl = document.createElement("div");
       //temperatureEl.classList = "forcast-card-data";
       temperatureEl.textContent = "Temp: " + temperature + " C";

       //get humidity
       var humidity = data.list[i].main.humidity
       var humidityEl = document.createElement("div");
       //humidityEl.classList = "forcast-card-data";
       humidityEl.textContent = "Humidity: " + humidity + "%";

       //attached container creation
       var outerCard = document.createElement("div");
       outerCard.classList = "card bg-primary text-white forcast-card";

       var innerCard = document.createElement("div");
       innerCard.classList = "card-body forcast-card-data"

       outerCard.appendChild(innerCard);

       //append all data points to innercard
       innerCard.appendChild(dateSpan);
       innerCard.appendChild(imageLink);
       innerCard.appendChild(temperatureEl);
       innerCard.appendChild(humidityEl);

       //append container
        forcastContainerEl.appendChild(outerCard);

    }

    
};








cityFormEl.addEventListener("submit", formSubmitHandler);