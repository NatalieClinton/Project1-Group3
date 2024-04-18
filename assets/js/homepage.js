document.addEventListener("DOMContentLoaded", function() {
  // Elements
  const signUpBtn = document.getElementById("signUpBtn");
  const signUpModal = document.getElementById("signUpModal");
  const closeModal = document.querySelector(".close");
  const addEmailForm = document.getElementById("addEmailForm");
  const addressSearchBtn = document.getElementById("addressSearchBtn");
  const addressInput = document.getElementById('addressInput');
  const mapElement = document.getElementById('map');
  let map;
  let service;

  // Modal event listeners
  signUpBtn.addEventListener("click", function() {
      signUpModal.style.display = "block";
  });

  closeModal.addEventListener("click", function() {
      signUpModal.style.display = "none";
  });

  window.addEventListener("click", function(event) {
      if (event.target === signUpModal) {
          signUpModal.style.display = "none";
      }
  });

  // Form submission handler
  addEmailForm.addEventListener("submit", function(event) {
      event.preventDefault();
      const email = document.getElementById("emailAddress").value;
      const password = document.getElementById("password").value;

      // Store data in localStorage
      localStorage.setItem("email", email);
      localStorage.setItem("password", password);

      // Redirect to the next page
      window.location.href = "restaurant.html";
  });

  // Initialize autocomplete
  initAutocomplete();

  // Set up map if the map element exists
  if (mapElement) {
      initMap();
  }

  // Find nearby restaurants when the button is clicked
  addressSearchBtn.addEventListener("click", () => {
      const address = addressInput.value.trim();
      if (address) {
          geocodeAddress(address);
      } else {
          alert("Please enter an address");
      }
  });

  function initAutocomplete() {
      const input = document.getElementById('addressInput');
      const autocomplete = new google.maps.places.Autocomplete(input);

      autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (place && place.geometry && place.geometry.location) {
              const lat = place.geometry.location.lat();
              const lng = place.geometry.location.lng();
              // Save the location in local storage
              const location = JSON.stringify({ lat, lng });
              localStorage.setItem("location", location);

              // Redirect to map.html
              window.location.href = "map.html";
          } else {
              alert("No valid place selected");
          }
      });
  }

  function initMap() {
      map = new google.maps.Map(mapElement, {
          center: { lat: 0, lng: 0 },
          zoom: 14,
      });
      service = new google.maps.places.PlacesService(map);
  }

  function geocodeAddress(address) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address }, (results, status) => {
          if (status === google.maps.GeocoderStatus.OK) {
              const location = results[0].geometry.location;
              const lat = location.lat();
              const lng = location.lng();

              // Save the location in local storage
              const locationData = JSON.stringify({ lat, lng });
              localStorage.setItem("location", locationData);

              // Redirect to map.html
              window.location.href = "map.html";
          } else {
              alert(`Geocoding failed: ${status}`);
          }
      });
  }

  function findNearbyRestaurants(lat, lng) {
      const request = {
          location: new google.maps.LatLng(lat, lng),
          radius: '1500',
          type: ['restaurant'],
      };

      service.nearbySearch(request, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
              displayResults(results);
          } else {
              alert(`Places search failed: ${status}`);
          }
      });
  }

  function displayResults(results) {
      results.forEach(result => {
          // Create a marker for each restaurant
          const marker = new google.maps.Marker({
              position: result.geometry.location,
              map: map,
              title: result.name,
          });

          // Add an info window to display details
          const infowindow = new google.maps.InfoWindow({
              content: `<h3>${result.name}</h3><p>${result.vicinity}</p>`
          });

          marker.addListener('click', () => {
              infowindow.open(map, marker);
          });
      });
  }
});
