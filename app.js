document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  // Handle Login Form submission
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = loginForm.querySelector("input[type='text']").value;
      sessionStorage.setItem("loggedInUser", username);
      window.location.href = "dashboard.html";
    });
  }

  // Handle Register Form submission
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Registration successful! You can now login.");
      window.location.href = "login.html";
    });
  }

  // Theme Toggle functionality
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
    });

    // On load, set theme based on local storage
    if (localStorage.getItem("theme") === "dark") {
      document.body.classList.add("dark");
    }
  }

  // Profile Page Logic
  if (window.location.pathname.includes("profile.html")) {
    const form = document.getElementById("profileForm");
    const fullName = document.getElementById("fullName");
    const email = document.getElementById("email");
    const picInput = document.getElementById("profilePic");
    const preview = document.getElementById("preview");

    // Load existing profile data from localStorage
    fullName.value = localStorage.getItem("profileName") || "";
    email.value = localStorage.getItem("profileEmail") || "";
    preview.src = localStorage.getItem("profilePic") || "";

    // Save profile data to localStorage
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      localStorage.setItem("profileName", fullName.value);
      localStorage.setItem("profileEmail", email.value);
      alert("Profile saved!");
    });

    // Handle profile picture upload
    picInput.addEventListener("change", () => {
      const reader = new FileReader();
      reader.onload = () => {
        preview.src = reader.result;
        localStorage.setItem("profilePic", reader.result);
      };
      if (picInput.files[0]) {
        reader.readAsDataURL(picInput.files[0]);
      }
    });
  }
});
