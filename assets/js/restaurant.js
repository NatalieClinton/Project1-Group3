//Selecting HTML elements

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
    const weatherApiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${restaurantCity}&appid=${weatherApiKey}`;
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
                        console.log(restaurants)
                    })
                    renderLocalRestaurants(restaurants);
                });
            }
        });
}

function renderLocalRestaurants(restaurantData) {
    console.log(restaurantData);

    optionsContainer.innerHTML = '';

    localStorage.setItem("restaurantData", JSON.stringify(restaurantData));

    for (let i = 0; i < restaurantData.length; i++) {
        const article = document.createElement('article');
        article.classList.add('restaurant-card');

        const companyImg = document.createElement('img');


        if (restaurantData[i].photos && restaurantData[i].photos.length > 0) {
            const photoReference = restaurantData[i].photos[0].photo_reference;

            const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${googleApiKey}`;
            companyImg.src = photoUrl;
        }

        companyImg.classList.add('restaurant-img');

        const introDiv = document.createElement('div');
        introDiv.classList.add('intro');

        const titleEl = document.createElement('h1');
        titleEl.textContent = restaurantData[i].name;

        const detailsDiv = document.createElement('div');
        detailsDiv.classList.add('details');

        const rating = document.createElement('p');
        rating.textContent = `${restaurantData[i].rating} stars`;
        /* save button*/
        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.classList.add("save-rest-btn")
        saveButton.addEventListener('click', function () {
            let savedRestaurant = JSON.parse(localStorage.getItem('savedRestaurant')) || [];

            const savedLocalRestData = {
                name: restaurantData[i].name,
                image: companyImg.src,
                rating: restaurantData[i].rating

            };

            savedRestaurant.push(savedLocalRestData);
            localStorage.setItem('savedRestHighRating', JSON.stringify(savedRestaurant));
        });
        /*end of save button */

        introDiv.append(titleEl, saveButton);
        detailsDiv.append(rating);

        article.append(companyImg, introDiv, detailsDiv);
        optionsContainer.appendChild(article);

        if (optionsContainer.children.length >= 6) {
            break;
        }
    }
}
