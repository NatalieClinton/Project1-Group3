var map;

// FUNCTION TO INITIALIZE THE MAP AND RETRIEVE NEARBY RESTAURANTS
function initMap() {
    // INITIALIZE MAP
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 }, // DEFAULT CENTER LOCATION
        zoom: 15 // DEFAULT ZOOM LEVEL
    });

    // TRY HTML5 GEOLOCATION.
    if (navigator.geolocation) {
        // IF GEOLOCATION IS SUPPORTED, GET CURRENT POSITION
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            // SET THE MAP'S CENTER TO THE CURRENT LOCATION
            map.setCenter(pos);

            // REQUEST NEARBY RESTAURANTS
            var request = {
                location: pos,
                radius: '10000',
                types: ['restaurant'] 
            };

            var service = new google.maps.places.PlacesService(map);
            // PERFORM A NEARBY SEARCH FOR RESTAURANTS
            service.nearbySearch(request, function (results, status) {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    // SORT RESTAURANTS BY RATING IN DESCENDING ORDER
                    results.sort(function (a, b) {
                        return b.rating - a.rating;
                    });

                    // CLEAR EXISTING RESTAURANT DETAILS
                    var restaurantDetailsContainer = document.getElementById('restaurantDetails');
                    restaurantDetailsContainer.innerHTML = '';

                    // LIMIT THE RESULTS TO THE BEST 5 RESTAURANTS
                    var bestRestaurants = results.slice(0, 5);
                    // DISPLAY DETAILS FOR EACH OF THE BEST 5 RESTAURANTS
                    bestRestaurants.forEach(function (restaurant) {
                        showRestaurantDetails(restaurant.place_id);
                    });
                }
            });
        }, function () {
            handleLocationError(true, map.getCenter());
        });
    } else {
        // BROWSER DOESN'T SUPPORT GEOLOCATION
        handleLocationError(false, map.getCenter());
    }
}

// FUNCTION TO HANDLE GEOLOCATION ERRORS
function handleLocationError(browserHasGeolocation, pos) {
    alert(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
}

// FUNCTION TO DISPLAY DETAILS OF A RESTAURANT
function showRestaurantDetails(placeId) {
    var service = new google.maps.places.PlacesService(map);
    // RETRIEVE DETAILS FOR THE RESTAURANT WITH THE GIVEN PLACE ID
    service.getDetails({
        placeId: placeId
    }, function (place, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            // CREATE A DIV FOR THE RESTAURANT ITEM
            var restaurantItem = document.createElement('div');
            restaurantItem.classList.add('restaurant-item');

            // CREATE AN IMG ELEMENT FOR THE RESTAURANT IMAGE
            var restaurantImg = document.createElement('img');
            // SET THE IMAGE SOURCE TO THE FIRST PHOTO OF THE RESTAURANT, OR A DEFAULT IMAGE IF NO PHOTO IS AVAILABLE
            restaurantImg.src = place.photos && place.photos.length > 0 ? place.photos[0].getUrl({ maxWidth: 200 }) : 'default-restaurant-image.jpg';
            restaurantImg.alt = 'Restaurant Photo';
            restaurantItem.appendChild(restaurantImg);

            // CREATE A DIV FOR THE RESTAURANT INFORMATION
            var restaurantInfo = document.createElement('div');
            restaurantInfo.classList.add('restaurant-info');

            // POPULATE THE RESTAURANT INFORMATION
            restaurantInfo.innerHTML = `
                <h2><strong>${place.name}</strong></h2>
                <p><strong>Rating:</strong> ${place.rating}</p>
                <p><strong>Address:</strong> ${place.formatted_address}</p>
                <p><strong>Phone:</strong> ${place.formatted_phone_number}</p>
                <p><strong>Website:</strong> <a href="${place.website}">${place.website}</a></p>
            `;

            // APPEND THE RESTAURANT INFORMATION TO THE RESTAURANT ITEM
            restaurantItem.appendChild(restaurantInfo);

            // APPEND THE RESTAURANT ITEM TO THE CONTAINER
            var restaurantDetailsContainer = document.getElementById('restaurantDetails');
            restaurantDetailsContainer.appendChild(restaurantItem);
        }
    });
}