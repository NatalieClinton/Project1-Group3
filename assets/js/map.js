var map;

function initMap() {
    // Initialize map
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 15
    });

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            // Set the map's center to the current location
            map.setCenter(pos);

            // Request nearby restaurants
            var request = {
                location: pos,
                radius: '10000',
                types: ['restaurant'] // Specify types as 'restaurant'
            };

            var service = new google.maps.places.PlacesService(map);
            service.nearbySearch(request, function (results, status) {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    // Clear existing restaurant details
                    var restaurantDetailsContainer = document.getElementById('restaurantDetails');
                    restaurantDetailsContainer.innerHTML = '';

                    // Limit the results to the first 5 restaurants
                    var closestRestaurants = results.slice(0, 5);
                    closestRestaurants.forEach(function (restaurant) {
                        showRestaurantDetails(restaurant.place_id);
                    });
                }
            });
        }, function () {
            handleLocationError(true, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, pos) {
    alert(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
}

function showRestaurantDetails(placeId) {
    var service = new google.maps.places.PlacesService(map);
    service.getDetails({
        placeId: placeId
    }, function (place, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            // Create a list item for the restaurant details
            var listItem = document.createElement('ul');
            listItem.classList.add('restaurant-item');

            // Populate the list item with restaurant information
            var content = '<h2><strong>' + place.name + '</strong></h2>' +
                '<p><strong>Rating:</strong> ' + place.rating + '</p>' +
                '<p><strong>Address:</strong> ' + place.formatted_address + '</p>' +
                '<p><strong>Phone:</strong> ' + place.formatted_phone_number + '</p>' +
                '<p><strong>Website:</strong> <a href="' + place.website + '">' + place.website + '</a></p>';

            // Check if the place has photos
            if (place.photos && place.photos.length > 0) {
                // Add the first photo to the content
                content += '<img src="' + place.photos[0].getUrl({ maxWidth: 100 }) + '" alt="Restaurant Photo">';
            }

            // Set the content to the list item
            listItem.innerHTML = content;

            // Append the list item to the restaurant list container
            var restaurantListContainer = document.getElementById('restaurantDetails');
            restaurantListContainer.appendChild(listItem);
        }
    });
}