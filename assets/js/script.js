document.addEventListener('DOMContentLoaded', function () {
  var modal = document.getElementById('loginModal');
  var closeButton = document.querySelector('.close');
  var loginForm = document.getElementById('loginForm');

  // Show modal
  modal.style.display = 'block';

  // Close modal when close button is clicked
  closeButton.onclick = function () {
    modal.style.display = 'none';
  };

  // Close modal when user clicks outside the modal
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  };

  // Handle form submission
  loginForm.onsubmit = function (event) {
    event.preventDefault(); // Prevent form from submitting

    // Validate form (add your validation logic here)

    // If form is valid, close the modal
    modal.style.display = 'none';
  };

  // Location detection
  navigator.geolocation.getCurrentPosition(function (position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    console.log('Latitude: ' + latitude + ', Longitude: ' + longitude);

    // Display loading indicator
    var restaurantList = document.getElementById('restaurantList');
    restaurantList.innerHTML = 'Loading...';

    // Integrate Google Maps Places API
    var map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: latitude, lng: longitude },
      zoom: 15
    });

    var request = {
      location: { lat: latitude, lng: longitude },
      radius: '500',
      type: ['restaurant']
    };

    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, function (results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        restaurantList.innerHTML = ''; // Clear loading indicator
        for (var i = 0; i < results.length; i++) {
          var place = results[i];
          console.log(place);

          // Display restaurant details
          var restaurantInfo = '<div class="restaurant" id="' + place.id + '"><h3>' + place.name + '</h3>';
          if (place.rating) {
            restaurantInfo += '<p>Rating: ' + place.rating + '</p>';
          }
          if (place.opening_hours && place.opening_hours.open_now) {
            restaurantInfo += '<p>Open Now</p>';
          } else {
            restaurantInfo += '<p>Closed</p>';
          }
          if (place.vicinity) {
            restaurantInfo += '<p>' + place.vicinity + '</p>';
          }
          restaurantInfo += '</div>';
          restaurantList.innerHTML += restaurantInfo;

          // // Call addPriceToRestaurant to fetch and add the price
          // addPriceToRestaurant(place.id);
        }
      } else {
        restaurantList.innerHTML = 'No restaurants found.';
      }
    });
  }, function (error) {
    console.error('Error getting location: ' + error.message);
  });
});

const apiKey = 'AIzaSyBxWw3DSNZJTDbkBnPVZabPtuLWZAgpOcA';
const searchQuery = 'restaurants in New York'; // Example search query

const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${searchQuery}&key=${apiKey}`;

fetch(searchUrl)
  .then(response => response.json())
  .then(data => {
    if (data.results && data.results.length > 0) {
      const placeId = data.results[0].place_id; // Use the first result's place_id
      console.log('Place ID:', placeId);
    } else {
      console.error('No results found.');
    }
  })
  .catch(error => console.error('Error fetching data:', error));

