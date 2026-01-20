function registerUser(e) {
  e.preventDefault();
  alert("Registered successfully! 🌾\nNow you can login.");
  window.location.href = "login.html";
}

function loginUser(e) {
  e.preventDefault();
  alert("Login successful! 🌾\nWelcome to FarmHelp Hub.");
  window.location.href = "index.html";
}
