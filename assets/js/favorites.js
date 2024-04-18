
let nextRestaurantId = 1;
let favorites = [];

function addRestaurant() {
    const restaurantContainer = document.getElementById('restaurants-container');

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

    restaurantContainer.appendChild(restaurantDiv);
    nextRestaurantId++;
    const googleApiKey='AIzaSyBxWw3DSNZJTDbkBnPVZabPtuLWZAgpOcA';
}
function saveRestaurant(id) {
    const restaurant = document.getElementById(`restaurant-${id}`);
    if (restaurant) {
        const saveButton = restaurant.querySelector('.save-btn');
        saveButton.textContent = 'Saved';
        saveButton.disabled = true;
        favorites.push(id);
    }
    function saveRestaurant() {
        const name = document.getElementById('name').value.trim();
        const description = document.getElementById('description').value.trim();
        const location = document.getElementById('location').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const website = document.getElementById('website').value.trim();
        // Create a new restaurant object
        const restaurant = { name, description, location, phone, website };
        // Save the restaurant to storage, database, or other backend
        console.log('Restaurant saved:', restaurant);
    }
    
}
function saveRestaurant(id) {
    // Check if the restaurant is already in favorites
    if (!favorites.includes(id)) {
        favorites.push(id);
        // Save favorites to local storage
        localStorage.setItem('favorites', JSON.stringify(favorites));
        displayFavorites(); // Update the displayed favorites
    }
}
function saveRestaurant() {
    const name = document.getElementById('name').value.trim();
    const description = document.getElementById('description').value.trim();
    const location = document.getElementById('location').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const website = document.getElementById('website').value.trim();
}
function loadFavorites() {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
        favorites = JSON.parse(savedFavorites);
        displayFavorites(); // Display the loaded favorites
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
function displayFavorites() {
    const favoritesContainer = document.getElementById('favorites-container');
  favorites.forEach(id => {
        const restaurant = document.getElementById(`restaurant-${id}`);
        if (restaurant) {
            const clone = restaurant.cloneNode(true);
            const saveButton = clone.querySelector('.save-btn');
            saveButton.textContent = 'Remove';
            saveButton.onclick = function () {
                removeRestaurant(id);
                clone.remove();
            };
            favoritesContainer.appendChild(clone);
        }
    });
}

// Trigger displayFavorites when the page loads
window.onload = displayFavorites;
window.onload = function () {
    loadFavorites();
    displayFavorites();
}
document.getElementById('reviewForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    const name = document.getElementById('name').value.trim();
    const rating = document.getElementById('rating').value.trim();
    const comment = document.getElementById('comment').value.trim();

    addReview(selectedRestaurantId, name, rating, comment);
    
    console.log('Review submitted:', reviewData);
    alert('Thank you for your review!');

    // Clear the form
    document.getElementById('name').value = '';
    document.getElementById('comment').value = '';
});

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
        name: name,
        email: email,
        message: message
    };
    console.log('Feedback submitted:', feedbackData);

    // Show a success message to the user
    const feedbackMessage = document.getElementById('feedbackMessage');
    feedbackMessage.textContent = 'Thank you for your feedback!';
    feedbackMessage.style.display = 'block';
});