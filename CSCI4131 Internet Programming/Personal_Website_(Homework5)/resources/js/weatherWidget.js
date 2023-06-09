
// "borrowed" from MDN's geolocation API example
function geoFindMe() {
    console.log("calling geofindme");
    const status = document.querySelector('#weatherStatus');
    
    function success(position) {
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;
        const latitude_input = document.querySelector("#latitude-input");
        const longitude_input = document.querySelector("#longitude-input");

        longitude_input.value = longitude;
        latitude_input.value = latitude;
        console.log(`${latitude}, ${longitude}`);
        status.textContent = "";
    }
  
    function error() {
      status.textContent = 'Unable to retrieve your location';
    }
  
    if (!navigator.geolocation) {
      status.textContent = 'Geolocation is not supported by your browser';
    } else {
      status.textContent = 'Locating…';
      navigator.geolocation.getCurrentPosition(success, error);
    }
  
}

WEATHER_CODES = {
0:  'Clear sky',
1:  'Mainly clear',
2:  'Partly cloudy',
3:  'Overcast',
45: 'Fog',
48: 'Depositing Rime fog',
51: 'Light Drizzle',
53: 'Moderate Drizzle',
55: 'Dense Drizzle',
57: 'Light Freezing Drizzle',
57: 'Dense Freezing Drizzle',
61: 'Slight Rain',
63: 'Moderate Rain',
65: 'Heavy Rain',
66: 'Light Freezing Rain',
67: 'Heavy Freezing Rain',
71: 'Slight Snow fall',
73: 'Moderate Snow fall',
75: 'Heavy Snow fall',
77: 'Snow grains',
80: 'Slight Rain showers',
81: 'Moderate Rain showers',
82: 'Violent Rain showers',
85: 'Slight Snow showers slight and heavy',
86: 'Heavy Snow showers slight and heavy',
95: 'Thunderstorm',
96: 'Thunderstorm with slight hail',
99: 'Thunderstorm with heavy hail',
}

function getWeather() {
    let latitude = document.getElementById("latitude-input").value;
    let longitude = document.getElementById("longitude-input").value;

    async function getOpenMeteo() {
        let url = "https://api.open-meteo.com/v1/forecast"+
            "?latitude="+latitude+
            "&longitude="+longitude+
            "&current_weather=true"+
            "&temperature_unit=celsius"+
            "&timezone=America%2FChicago";
        let options = {
            method: "GET"
        };

        let errmsg = "An error occurred while retrieving weather info!"
        let response = await fetch(url, options);
        try {
            if (response.ok) {
                let weather = await response.json();
                // console.log(weather);
                weather = weather.current_weather;
                let temp = weather.temperature;
                document.getElementById("temp-display").innerText = temp + " Degrees C";
                let code = weather.weathercode;
                document.getElementById("cloud-cover-display").innerText = WEATHER_CODES[code];
            } else {
                let error = await response.json();
                document.getElementById("temp-display").innerText = errmsg + " \nReason: " + error.reason;
            }
        } catch (e) {
            document.getElementById("temp-display").innerText = errmsg;
        }
    }

    async function getSunSetRise() {
        let url = "https://api.sunrise-sunset.org/json"+
            "?lat="+latitude+
            "&lng="+longitude+
            "&date=today"+
            "&formatted=0";
        let options = {
            method: "GET"
        };

        let errmsg = "An error occurred while retrieving sunset/rise info!"
        let response = await fetch(url, options);
        try {
            if (response.ok) {
                let info = await response.json();
                console.log(info);
                let sunrise = info.results.sunrise;
                document.getElementById("sunrise-display").innerText = "Sunrise: " + new Date(sunrise).toLocaleTimeString();
                let sunset = info.results.sunset;
                document.getElementById("sunset-display").innerText = "Sunset: " + new Date(sunset).toLocaleTimeString();
            } else {
                let error = await response.json();
                document.getElementById("sunrise-display").innerText = errmsg + " \nReason: " + error.status;
            }
        } catch (e) {
            document.getElementById("sunrise-display").innerText = errmsg;
        }
    }
    getOpenMeteo();
    getSunSetRise();
}

document.querySelector('#find-me').addEventListener('click', geoFindMe);
document.querySelector("#get-weather-btn").addEventListener('click', getWeather);
