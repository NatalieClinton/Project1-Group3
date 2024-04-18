document.addEventListener("DOMContentLoaded", function() {
    // Elements
    const signUpBtn = document.getElementById("signUpBtn"); // Sign-up button
    const signUpModal = document.getElementById("signUpModal"); // Sign-up modal
    const closeModal = document.querySelector(".close"); // Close modal button
    const addEmailForm = document.getElementById("addEmailForm"); // Sign-up form
    // const addressSearchBtn = document.getElementById("addressSearchBtn"); // Address search button
    const addressInput = document.getElementById('addressInput'); // Address input field
    const mapElement = document.getElementById('map'); // Map element
    let map; // Google Map
    let service; // Google Maps Places service

    // Modal event listeners
    signUpBtn.addEventListener("click", function() {
        signUpModal.style.display = "block"; // Display sign-up modal when sign-up button is clicked
    });

    closeModal.addEventListener("click", function() {
        signUpModal.style.display = "none"; // Close sign-up modal when close button is clicked
    });

    window.addEventListener("click", function(event) {
        if (event.target === signUpModal) {
            signUpModal.style.display = "none"; // Close sign-up modal when clicked outside of modal
        }
    });

    // Form submission handler
    addEmailForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const email = document.getElementById("emailAddress").value; // Get email value
        const password = document.getElementById("password").value; // Get password value
        const address = addressInput.value.trim(); // Get address value

        // Store data in localStorage
        localStorage.setItem("email", email); // Store email in local storage
        localStorage.setItem("password", password); // Store password in local storage
        localStorage.setItem("address", address); // Store address in local storage

        // Redirect to the next page
        window.location.href = "restaurant.html"; // Redirect to restaurant page
    });

    // Initialize autocomplete for address input field
    initAutocomplete();

    // Set up map if the map element exists
    if (mapElement) {
        initMap(); // Initialize Google Map
    }

    // Find nearby restaurants when the button is clicked
    addressSearchBtn.addEventListener("click", () => {
        const address = addressInput.value.trim();
        if (address) {
            addressSearchBtn.disabled = true;
            geocodeAddress(address); // Geocode the address
        } else {
            alert("Please enter an address");
        }
    });

    // Initialize Google Places Autocomplete for address input field
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

    // Initialize Google Map
    function initMap() {
        map = new google.maps.Map(mapElement, {
            center: { lat: 0, lng: 0 }, // Default center
            zoom: 14, // Default zoom level
        });
        service = new google.maps.places.PlacesService(map); // Initialize Places service
    }

    // Geocode the address
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

    // Find nearby restaurants
    function findNearbyRestaurants(lat, lng) {
        const request = {
            location: new google.maps.LatLng(lat, lng),
            radius: '10000',
            type: ['restaurant'],
        };

        service.nearbySearch(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                displayResults(results); // Display results on the map
            } else {
                alert(`Places search failed: ${status}`);
            }
        });
    }

    // Display results on the map
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
