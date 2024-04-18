
// Variable to keep track of the next restaurant ID
let nextRestaurantId = 1;

// Array to store favorite restaurant IDs
let favorites = [];

// Placeholder for selected restaurant ID
let selectedRestaurantId;

// Array to store reviews
let reviews = [];

// Function to add a new restaurant to the page
function addRestaurant() {
    // Get the container for restaurants
    const restaurantContainer = document.getElementById('restaurants-container');

    // Create a new div element for the restaurant
    const restaurantDiv = document.createElement('div');
    restaurantDiv.className = 'restaurant';
    restaurantDiv.id = `restaurant-${nextRestaurantId}`;


    restaurantDiv.innerHTML = `
        <h2>Restaurant Name ${nextRestaurantId}</h2>
        <img src="restaurant-placeholder.jpg" alt="Restaurant ${nextRestaurantId}">
        <p>Description of Restaurant ${nextRestaurantId}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla lacinia lacus vel justo dapibus, at vestibulum ligula finibus.</p>
        <p>Location: Address ${nextRestaurantId}, City</p>
        <p>Phone: 123-456-7890</p>
        <p>Website: <a href="https://www.restaurant${nextRestaurantId}.com" target="_blank">www.restaurant${nextRestaurantId}.com</a></p>
        <button class="save-btn" onclick="saveRestaurant(${nextRestaurantId})">Save</button>
    `;

    // Append the restaurant div to the container
    restaurantContainer.appendChild(restaurantDiv);
    
    // Add event listener to the save button to save the restaurant
    const saveButton = restaurantDiv.querySelector('.save-btn');
    saveButton.addEventListener('click', function() {
        saveRestaurant(nextRestaurantId);
    });

    // Increment the restaurant ID for the next restaurant
    nextRestaurantId++;
}
function saveRestaurant(id) {
    // Check if the restaurant is already in favorites
    if (!favorites.includes(id)) {
        // Add the restaurant ID to favorites array
        favorites.push(id);
        // Save favorites to local storage
        localStorage.setItem('favorites', JSON.stringify(favorites));
        // Update the displayed favorites
        displayFavorites();
    }
}
function removeRestaurant(id) {
    const index = favorites.indexOf(id);
    if (index !== -1) {
        favorites.splice(index, 1);
        const restaurant = document.getElementById(`restaurant-${id}`);
        if (restaurant) {
            restaurant.remove();
        }
    }
}
// Function to display favorite restaurants
function displayFavorites() {
    const favoritesContainer = document.getElementById('favorites-container');
    // Clear previous content
    favoritesContainer.innerHTML = '';

    // Iterate through favorite restaurants and display them
    favorites.forEach(id => {
        const restaurant = document.getElementById(`restaurant-${id}`);
        if (restaurant) {
            // Clone the restaurant element and update save button text and behavior
            const clone = restaurant.cloneNode(true);
            const saveButton = clone.querySelector('.save-btn');
            saveButton.textContent = 'Remove';
            saveButton.onclick = function () {
                removeRestaurant(id);
            };
            favoritesContainer.appendChild(clone);
        }
    });
}
// Function to load favorite restaurants from local storage
function loadFavorites() {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
        // Parse saved favorites from local storage
        favorites = JSON.parse(savedFavorites);
        // Display the loaded favorites
        displayFavorites();
    }
}
// Trigger displayFavorites when the page loads
window.onload = displayFavorites;
window.onload = function () {
    loadFavorites();
    displayFavorites();
}
// Trigger adding event listener when the DOM content is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Try to get the review form element
    const reviewForm = document.getElementById('reviewForm');
    
    // Check if the review form element exists before adding the event listener
    reviewForm?.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent form submission

        // Get review form data
        const name = document.getElementById('name').value.trim();
        const rating = document.getElementById('rating').value.trim();
        const comment = document.getElementById('comment').value.trim();

        // Call addReview function with selected restaurant ID
        addReview(selectedRestaurantId, name, rating, comment);

        // Clear the form
        document.getElementById('name').value = '';
        document.getElementById('comment').value = '';
    });
});
// Function to add a review for a restaurant
function addReview(restaurantId, name, rating, comment) {
    // Create a review object
    const review = {
        restaurantId: restaurantId,
        name: name,
        rating: rating,
        comment: comment
    };

    // Add the review to reviews array 
    reviews.push(review);

    // Log the review 
    console.log('Review added:', review);
}

document.getElementById('feedbackForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    // Validation logic
    if (!name || !email || !message) {
        alert('Please fill out all fields.');
        return;
    }
    // Create an object to hold the feedback data
    const feedbackData = {
        restaurantId: restaurantId,
        name: name,
        email: email,
        message: message
    };
    feedbackData.push(review);
    console.log('Feedback submitted:', feedbackData);
});