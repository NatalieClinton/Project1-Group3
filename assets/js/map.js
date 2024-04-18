// Variables
let map;

// Initialize map
function initMap() {
    const mapElement = document.getElementById('map');
    
    // Create a map centered at a default location
    map = new google.maps.Map(mapElement, {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 15
    });

    // Attempt to get the user's location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const userPos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            // Update map center
            map.setCenter(userPos);

            // Fetch nearby restaurants
            fetchNearbyRestaurants(userPos);
        }, () => {
            showLocationError(true);
        });
    } else {
        showLocationError(false);
    }
}

// Function to fetch nearby restaurants
function fetchNearbyRestaurants(pos) {
    const request = {
        location: pos,
        radius: '10000',
        type: ['restaurant']
    };

    const service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            // Limit results to the first 5 restaurants
            const top5Restaurants = results.slice(0, 5);
            top5Restaurants.forEach(restaurant => displayRestaurantDetails(restaurant.place_id));
        }
    });
}

// Function to handle geolocation error
function showLocationError(browserHasGeolocation) {
    alert(browserHasGeolocation
        ? 'Error: Geolocation service failed.'
        : 'Error: Your browser does not support geolocation.'
    );
}

// Function to display restaurant details
function displayRestaurantDetails(placeId) {
    const service = new google.maps.places.PlacesService(map);
    service.getDetails({ placeId: placeId }, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            const restaurantDetailsContainer = document.getElementById('restaurantDetails');

            // Create a list item element for the restaurant
            const listItem = document.createElement('ul');
            listItem.classList.add('restaurant-item');

            // Populate the list item with restaurant information
            listItem.innerHTML = `
                <h2><strong>${place.name}</strong></h2>
                <p><strong>Rating:</strong> ${place.rating}</p>
                <p><strong>Address:</strong> ${place.formatted_address}</p>
                <p><strong>Phone:</strong> ${place.formatted_phone_number}</p>
                <p><strong>Website:</strong> <a href="${place.website}" target="_blank">${place.website}</a></p>
                ${place.photos && place.photos.length > 0
                    ? `<img src="${place.photos[0].getUrl({ maxWidth: 100 })}" alt="Restaurant Photo">`
                    : ''}
            `;

            // Append the list item to the container
            restaurantDetailsContainer.appendChild(listItem);
        }
    });
}
