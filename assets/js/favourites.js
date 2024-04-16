
let nextRestaurantId = 1;
let favorites = [];

function addRestaurant() {
    const restaurantContainer = document.getElementById('restaurants-container');

    const restaurantDiv = document.createElement('div');
    restaurantDiv.className = 'restaurant';
    restaurantDiv.id = `restaurant-${nextRestaurantId}`;

    restaurantDiv.innerHTML = `
                <h2>Restaurant Name ${nextRestaurantId}</h2>
                <img src="placeholder-image.jng" alt="Restaurant ${nextRestaurantId}">
                <p>Description of Restaurant ${nextRestaurantId}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla lacinia lacus vel justo dapibus, at vestibulum ligula finibus.</p>
                <p>Location: Address ${nextRestaurantId}, City</p>
                <p>Phone: 123-456-7890</p>
                <p>Website: <a href="https://www.restaurant${nextRestaurantId}.com" target="_blank">www.restaurant${nextRestaurantId}.com</a></p>
                <button class="save-btn" onclick="saveRestaurant(${nextRestaurantId})">Save</button>
                <button onclick="removeRestaurant(${nextRestaurantId})">Remove</button>
            `;

    restaurantContainer.appendChild(restaurantDiv);
    nextRestaurantId++;
}
function saveRestaurant(id) {
    const restaurant = document.getElementById(`restaurant-${id}`);
    if (restaurant) {
        const saveButton = restaurant.querySelector('.save-btn');
        saveButton.textContent = 'Saved';
        saveButton.disabled = true;
        favorites.push(id);
    }
}


function removeRestaurant(id) {
    const restaurantElement = document.getElementById(`restaurant-${id}`);
    if (restaurantElement) {
        restaurantElement.remove();
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