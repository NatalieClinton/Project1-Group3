//Selecting HTML elements
const optionsContainer = document.querySelector('.options-container')
const restaurantCard = document.querySelector('.restaurant-card')
const ratingsBtn = document.querySelector('.ratingsBtn')
const openFilterBtn = document.querySelector('.openedBtn')
const searchBtn = document.querySelector('.search-btn')
const searchInput = document.getElementById('search-input')
const title = document.querySelector('.title')
const forecastContainer = document.querySelector('.forecast')
const weatherDetails = document.querySelector('.weather-details')
const weatherDetailsTop = document.querySelector('.top')
const weatherDetailsBottom = document.querySelector('.bottom')
const weatherBtn = document.querySelector('.weather-btn')
const displayMode = document.querySelector('.display-mode')
const weatherContainer = document.querySelector('.weather-container')
const closeModalBtn = document.querySelector('.close-modal-btn')
//API key - google places api
const googleApiKey = 'AIzaSyBxWw3DSNZJTDbkBnPVZabPtuLWZAgpOcA'
const weatherApiKey = 'd355ce3e26db350e68b9a4e198dac7bb';


//event listeners
searchBtn.addEventListener('click', submitLocation);
ratingsBtn.addEventListener('click', highRatingLocation)



document.addEventListener("DOMContentLoaded", function () {
    const savedRestaurantData = localStorage.getItem('restaurantData');
    const savedHighRatings = localStorage.getItem('ratingsData')

    if (savedRestaurantData) {
        const parsedRestaurantData = JSON.parse(savedRestaurantData);
        renderLocalRestaurants(parsedRestaurantData);
    } else {
        optionsContainer.innerHTML = 'Enter your location to view local restaurants'
    }
    if (savedHighRatings) {
        const parsedHighRatings = JSON.parse(savedHighRatings)
        renderRestHighRatings(parsedHighRatings)

    }
})

//START - toggle weather
weatherBtn.addEventListener('click', function () {
    weatherContainer.classList.remove("hidden")
})
closeModalBtn.addEventListener('click', function () {
    weatherContainer.classList.add('hidden')
})

//END - toggle weather

//START - SEARCH BY LOCATION

//User submits their city
function submitLocation() {
    const city = searchInput.value;
    if (city) {
        let currentCity = JSON.parse(localStorage.getItem('currentCity')) || []
        currentCity.push(city)
        localStorage.setItem('currentCity', JSON.stringify(currentCity))
        searchInput.value = ''
        getRestaurantLocation(city);

    }
}

//Use open weather api to get lat, lon of that city
function getRestaurantLocation(restaurantCity) {
    const weatherApiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${restaurantCity}&appid=${weatherApiKey}`;
    fetch(weatherApiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    const longitude = data[0].lon;
                    const latitude = data[0].lat;
                    getLocalRestaurant(latitude, longitude);
                    getLocalWeather(latitude, longitude)
                });
            }
        });
}

//uses lat and lon to get data based on the location user submitted
function getLocalRestaurant(lat, lon) {
    const googleApiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=1500&type=restaurant&key=${googleApiKey}`;
    fetch(googleApiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    const restaurants = data.results.filter(function (item) {
                        for (type of item.types) {
                            return type === 'restaurant'
                        }
                        // console.log(restaurants)
                    })
                    renderLocalRestaurants(restaurants);
                });
            }
        });
}


//render results on the screen

function renderLocalRestaurants(restaurantData) {

    // Clear existing restaurant cards
    optionsContainer.innerHTML = '';

    localStorage.setItem("restaurantData", JSON.stringify(restaurantData));
    //looping through restaurantData and ensuring only 6 restaurants are rendered
    for (let i = 0; i < restaurantData.length; i++) {
        const article = document.createElement('article');
        article.classList.add('restaurant-card');

        const companyImg = document.createElement('img');

        //Checking there are any photos available
        if (restaurantData[i].photos && restaurantData[i].photos.length > 0) {
            const companyImgReference = restaurantData[i].photos[0].photo_reference;

            const companyImgUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${companyImgReference}&key=${googleApiKey}`;
            companyImg.src = companyImgUrl;
        }

        companyImg.classList.add('restaurant-img');

        const introDiv = document.createElement('div');

        introDiv.classList.add('intro');

        //restaurant name
        const titleEl = document.createElement('h1');
        titleEl.textContent = restaurantData[i].name;

        const detailsDiv = document.createElement('div');
        detailsDiv.classList.add('details');

        const rating = document.createElement('p');
        rating.textContent = `${restaurantData[i].rating} stars`;

        /* save button*/
        const savedBtn = document.createElement('button');
        savedBtn.textContent = 'Save';
        savedBtn.classList.add("save-rest-btn")
        savedBtn.addEventListener('click', function () {
            let savedRestaurant = JSON.parse(localStorage.getItem('savedRestaurant')) || [];

            const savedLocalRestData = {
                name: restaurantData[i].name,
                image: companyImg.src,
                rating: restaurantData[i].rating

            };

            savedRestaurant.push(savedLocalRestData);
            localStorage.setItem('savedRestaurant', JSON.stringify(savedRestaurant));
        });
        /*end of save button */

        introDiv.append(titleEl, savedBtn);
        detailsDiv.append(rating);

        article.append(companyImg, introDiv, detailsDiv);
        optionsContainer.appendChild(article);

        if (optionsContainer.children.length >= 6) {
            break;
        }
    }
}


//END - SEARCH BY LOCATION


//START - SEARCH BY RATING
//Uses location user submits into input field to lat and lon
function highRatingLocation() {
    let restLocation = searchInput.value
    if (!restLocation) {
        targetedCity = JSON.parse(localStorage.getItem('currentCity'))
        let lastCity = ''
        for (let i = 0; i < targetedCity.length; i++) {
            lastCity = targetedCity.length - 1
        }
        restLocation = targetedCity[lastCity]
    }
    const weatherApiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${restLocation}&appid=${weatherApiKey}`
    fetch(weatherApiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    const restLat = data[0].lat
                    const restLon = data[0].lon
                    filterHighRatings(restLat, restLon)
                })
            }
        })
}


//uses lat and lon to get data based on city - filter through and return restaurants over 4 star rating
function filterHighRatings(latitude, longitude) {
    const googleApiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1500&type=restaurant&key=${googleApiKey}`;

    fetch(googleApiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    const restOverFourStars = data.results.filter(function (item) {
                        return item.rating >= 4
                    })
                    renderRestHighRatings(restOverFourStars)
                })
            }
        })
}



function renderRestHighRatings(ratingsData) {
    optionsContainer.innerHTML = '';

    for (let i = 0; i < ratingsData.length; i++) {
        const article = document.createElement('article');
        article.classList.add('restaurant-card');

        const companyImg = document.createElement('img');
        if (ratingsData[i].photos && ratingsData[i].photos.length > 0) {
            const companyImgReference = ratingsData[i].photos[0].photo_reference;
            const companyImgUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${companyImgReference}&key=${googleApiKey}`;
            companyImg.src = companyImgUrl;
        }
        companyImg.classList.add('restaurant-img');

        const introDiv = document.createElement('div');
        introDiv.classList.add('intro');

        const titleEl = document.createElement('h1');
        titleEl.textContent = ratingsData[i].name;

        const detailsDiv = document.createElement('div');
        detailsDiv.classList.add('details');

        const rating = document.createElement('p');
        rating.textContent = `${ratingsData[i].rating} stars`;

        const savedBtn = document.createElement('button');
        savedBtn.textContent = 'Save';
        savedBtn.classList.add("save-rest-btn")
        savedBtn.addEventListener('click', function () {
            let savedRestHighRating = JSON.parse(localStorage.getItem('savedRestHighRating')) || [];

            const savedRestInfo = {
                name: ratingsData[i].name,
                image: companyImg.src,
                rating: ratingsData[i].rating
                // Add other relevant restaurant data properties here
            };

            savedRestHighRating.push(savedRestInfo);
            localStorage.setItem('savedRestHighRating', JSON.stringify(savedRestHighRating));
        });

        introDiv.append(titleEl, savedBtn);
        detailsDiv.append(rating);

        article.append(companyImg, introDiv, detailsDiv);
        optionsContainer.appendChild(article);

        if (optionsContainer.children.length >= 6) {
            break;
        }
    }
}


//END - SEARCH BY RATING

//START - get weather forecast

function getLocalWeather(cityLat, cityLon) {
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${cityLat}&lon=${cityLon}&appid=${weatherApiKey}&units=metric`

    fetch(weatherApiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    const cityName = data.city.name
                    const dailyWeather = data.list[0]
                    renderLocalWeather(dailyWeather)
                })
            }
        })
}

function renderLocalWeather(weather) {
    // Clear existing content
    weatherDetailsTop.innerHTML = '';
    weatherDetailsBottom.innerHTML = '';

    //Creating weather elements and rendering data
    const tempPara = document.createElement('p');
    tempPara.textContent = `Temp: ${weather.main.temp} C`;

    const tempFeelPara = document.createElement('p');
    tempFeelPara.textContent = `Feels like: ${weather.main.feels_like} C`;

    const weatherDesc = document.createElement('p');
    weatherDesc.textContent = `Description: ${weather.weather[0].description}`;

    const humidity = document.createElement('p');
    humidity.textContent = `Humidity: ${weather.main.humidity}%`;

    weatherDetailsTop.append(tempPara, tempFeelPara);
    weatherDetailsBottom.append(weatherDesc, humidity);
}

