document.addEventListener("DOMContentLoaded", function() {
  // Elements
  const signUpBtn = document.getElementById("signUpBtn");
  const signUpModal = document.getElementById("signUpModal");
  const closeModal = document.querySelector(".close");
  const addEmailForm = document.getElementById("addEmailForm");
  const addressSearchBtn = document.getElementById("addressSearchBtn");
  const addressInput = document.getElementById('addressInput');

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

  // Address search button click handler
  addressSearchBtn.addEventListener("click", () => {
    addressInput.focus();
  });
});

function initAutocomplete() {
  const input = document.getElementById('addressInput');
  const autocomplete = new google.maps.places.Autocomplete(input);

  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();
    console.log('Place:', place);
    // Handle the selected place here
  });
}
