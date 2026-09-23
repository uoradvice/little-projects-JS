const cityInput = document.querySelector("#cityInput");
const searchButton = document.querySelector("#searchButton");
const weatherInfoParagraph = document.querySelector("#textWeather");
const historyParagraph = document.querySelector("#weaterHistory");
const cache = {};
let historyArray = [];

searchButton.addEventListener("click", searchWeather);

function searchWeather() {
    let city = cityInput.value.toLowerCase();
    if (!city) {
        weatherInfoParagraph.innerHTML = `
        <p>Enter city</p>
        `;
        return;
    }

    if (city in cache) {
        renderWeather(getCache(city));
        addToHistory(city);
    } else {
        fetchWeather(city)
            .catch(error => {
                console.log(error);
            });
    }

}

function getCache(city) {
    return cache[city];
}

async function fetchWeather(city) {
    const responseCity = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en`);

    if (!responseCity.ok) {
        throw new Error(`Can't get a response: ${responseCity.status}`);
    }
    const dataCity = await responseCity.json();

    if (!dataCity.results) {
        throw new Error(`Error: not found city ${city}`);
    }
    const {latitude, longitude} = dataCity.results[0];


    const responseWeather = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code&temperature_unit=celsius`);

    if (!responseWeather.ok) {
        throw new Error(`Can't get a response: ${responseWeather.status}`);
    }

    const dataWeather = await responseWeather.json();
    const weatherConditions = dataWeather.current;
    
    addToHistory(city);
    renderWeather(weatherConditions);
    cacheWeather(city, weatherConditions);
}

function renderWeather(weather) {
    const addInfo = `
    <p>Temperature: ${weather.temperature_2m} C</p>
    <p>Weather code: ${weather.weather_code}</p>
    <p>Relative humidity: ${weather.relative_humidity_2m}%</p>
    `;
    weatherInfoParagraph.innerHTML = addInfo;
}

async function cacheWeather(city, weatherData) {
    cache[city] = weatherData;
    await new Promise((resolve, reject) => {
        setTimeout(() => {
            delete cache[city];
            resolve();
        }, 300000); // 300000 (= 5 min)
    });
}

function addToHistory(city) {
    city = city[0].toUpperCase() + city.slice(1);
    if (historyArray.includes(city)){
        historyArray = historyArray.filter(element =>{
            return element !== city;
        });
    }

    historyArray.push(city);
    if(historyArray.length > 3){
        historyArray.shift();
    }

    historyParagraph.innerHTML = '';
    historyArray.slice().reverse().forEach((el) => {
        historyParagraph.innerHTML += ` 
        <li>${el}</li>
        `;
    });
}
