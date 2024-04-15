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
    }
}
