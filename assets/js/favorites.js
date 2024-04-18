let nextRestaurantId = 1;
let favorites = [];
let selectedRestaurantId; // Placeholder definition for selectedRestaurantId
let reviews = []; // Define the reviews array

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
    favoritesContainer.innerHTML = ''; // Clear previous content

    favorites.forEach(id => {
        const restaurant = document.getElementById(`restaurant-${id}`);
        if (restaurant) {
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

function loadFavorites() {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
        favorites = JSON.parse(savedFavorites);
        displayFavorites(); // Display the loaded favorites
    }
}

// Trigger loadFavorites when the page loads
window.onload = loadFavorites;

document.getElementById('reviewForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    const name = document.getElementById('name').value.trim();
    const rating = document.getElementById('rating').value.trim();
    const comment = document.getElementById('comment').value.trim();

    // Call the addReview function with selectedRestaurantId
    addReview(selectedRestaurantId, name, rating, comment);

    // Clear the form
    document.getElementById('name').value = '';
    document.getElementById('comment').value = '';
});

function submitFeedback(event) {
    event.preventDefault(); // Prevent form submission

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    // Validation logic
    if (!name || !email || !message) {
        alert('Please fill out all fields.');
        return;
    }

    const feedbackData = {
        name,
        email,
        message
    };

    console.log('Feedback submitted:', feedbackData);
    alert('Thank you for your feedback!');
    // Clear the form
    document.getElementById('feedbackForm').reset();
}

function addReview(restaurantId, name, rating, comment) {
    // Assuming you have a feedbackData object where you store reviews
    const review = {
        restaurantId: restaurantId,
        name: name,
        rating: rating,
        comment: comment
    };

    // You can add the review to an array or send it to a server/database
    // For demonstration, let's assume there's an array called 'reviews'
    reviews.push(review);

    // Log the review for demonstration purposes
    console.log('Review added:', review);
}