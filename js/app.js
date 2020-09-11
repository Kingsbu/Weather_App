let curretTime = new Date(Date.now());
var month = new Array();
month[0] = "Jan";
month[1] = "Feb";
month[2] = "Mar";
month[3] = "Apr";
month[4] = "May";
month[5] = "Jun";
month[6] = "Jul";
month[7] = "Aug";
month[8] = "Sep";
month[9] = "Oct";
month[10] = "Nov";
month[11] = "Dec";

let cDate = curretTime.getDate().toString() +" "+ month[curretTime.getMonth()] +" "+ curretTime.getFullYear().toString();


document.getElementById("weather-date").innerHTML = cDate;



//how to call the api http://api.openweathermap.org/data/2.5/weather?q=Pretoria&units=metric&APPID=5882372066c025a60752ac13573d83c0
// {"coord":{"lon":28.19,"lat":-25.74},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"base":"stations","main":{"temp":19,"feels_like":17.45,"temp_min":17,"temp_max":20,"pressure":1025,"humidity":49},"visibility":10000,"wind":{"speed":1.56,"deg":202},"clouds":{"all":0},"dt":1599245721,"sys":{"type":1,"id":1999,"country":"ZA","sunrise":1599192980,"sunset":1599234988},"timezone":7200,"id":964137,"name":"Pretoria","cod":200}



async function weatherFromApi(){
    const weatherRequest = await fetch("http://api.openweathermap.org/data/2.5/weather?q="+ document.getElementById("search-Word").value +"&units=metric&APPID=5882372066c025a60752ac13573d83c0")
                                .then( response =>  response.json() )
                                .catch( err => console.log(err));
    const {weather} = await weatherRequest;
    const {main} = await weatherRequest;
    console.log(weather[0]);
    console.log(main);
    const weatherReturnValues  = weather[0];
    return {main, weatherReturnValues  } ;
}

async function buttonClicked(){
    const getweatherValues =  await weatherFromApi();
    const { temp } = await getweatherValues["main"];
    const { temp_max } =  await getweatherValues["main"];
    const { temp_min } = await getweatherValues["main"];
    const { humidity } = await getweatherValues["main"];
    const { description } = await getweatherValues["weatherReturnValues"];

    const currentTemp = JSON.stringify(temp);
    const maxTemp = JSON.stringify(temp_max);
    const minTemp = JSON.stringify(temp_min);
    const strHumidity = JSON.stringify(humidity);
    const weatherDescription = JSON.stringify(description);
    
    if (getweatherValues){
        document.getElementById("city-name").innerHTML = document.getElementById("search-Word").value;
        document.getElementById("temp-value").innerHTML = currentTemp.slice(0,2) + "<sup id='degree-symbol'>o</sup>C";
        document.getElementById("humidity_percentage").innerHTML = strHumidity + "%";
        document.getElementById("min-temp").innerHTML = minTemp.slice(0,2) + " C";
        document.getElementById("max-temp").innerHTML = maxTemp.slice(0,2) + " C";
        document.getElementById("weather-description").innerHTML = weatherDescription.slice(1,weatherDescription.length - 1);
    } else {
        console.log("Failed to retrieve values from OpenWeather")
    }
    
}

if ("serviceWorker" in navigator){
    window.addEventListener("load", function() {
        navigator.serviceWorker
        .register("sw.js")
        .then(res => console.log("service worker registered"))
        .catch( err =>  console.log("service worker not registered". err))
    })
}

navigator.serviceWorker.onmessage = event => {
    const message = JSON.parse(event.data);
    //TODO: detect the type of message and refresh the view
  };

