var map;

function initMap() {
    // Initialize map
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 15
    });

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            // Set the map's center to the current location
            map.setCenter(pos);

            // Request nearby restaurants
            var request = {
                location: pos,
                radius: '500',
                type: ['restaurant']
            };

            var service = new google.maps.places.PlacesService(map);
            service.nearbySearch(request, function(results, status) {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    for (var i = 0; i < results.length; i++) {
                        createMarker(results[i]);
                    }
                }
            });
        }, function() {
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

function createMarker(place) {
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });

    var infowindow = new google.maps.InfoWindow({
        content: '<strong>' + place.name + '</strong><br>' +
                 'Rating: ' + place.rating + '<br>' +
                 'Address: ' + place.vicinity + '<br>' +
                 '<button onclick="showRestaurantDetails(\'' + place.place_id + '\')">View Details</button>'
    });

    marker.addListener('click', function() {
        infowindow.open(map, marker);
    });
}

function showRestaurantDetails(placeId) {
    var service = new google.maps.places.PlacesService(map);
    service.getDetails({
        placeId: placeId
    }, function(place, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            var modalContent = document.getElementById('restaurantDetails');
            modalContent.innerHTML = '<h2>' + place.name + '</h2>' +
                                     '<p><strong>Rating:</strong> ' + place.rating + '</p>' +
                                     '<p><strong>Address:</strong> ' + place.formatted_address + '</p>' +
                                     '<p><strong>Phone:</strong> ' + place.formatted_phone_number + '</p>' +
                                     '<p><strong>Website:</strong> <a href="' + place.website + '">' + place.website + '</a></p>';
            openModal();
        }
    });
}

// Function to open modal
function openModal() {
    document.getElementById('signUpModal').style.display = "block";
}

// Function to close modal
function closeModal() {
    document.getElementById('signUpModal').style.display = "none";
}