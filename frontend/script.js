import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyAxHcuKQGgbZ-Ty4_DrAdoexxRWLIYwxI8",
  authDomain: "audio-craft-d2616.firebaseapp.com",
  projectId: "audio-craft-d2616",
  storageBucket: "audio-craft-d2616.appspot.com",
  messagingSenderId: "1076695936962",
  appId: "1:1076695936962:web:0c50e66abbf093f0a3f05b"
};

const app = initializeApp(firebaseConfig);

document.getElementById("contact-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const button = this.querySelector("button[type='submit']");
  const originalText = button.textContent;
  button.disabled = true;
  button.innerHTML = '<span class="loading-spinner"></span>Sending...';

  // Send to owner
emailjs.send("service_63avnii", "template_0ou02p9", {
  name: document.getElementById("name").value,
  phone: document.getElementById("phone").value,
  email: document.getElementById("email").value,
  date: document.getElementById("date").value,
  package: document.getElementById("package").value,
  message: document.getElementById("message").value
})
.then(function(response) {
  // Optionally handle owner notification success
}, function(error) {
  // Optionally handle owner notification error
});

  emailjs.send("service_63avnii", "template_qzrfxce", {
    name: document.getElementById("name").value,
    phone: document.getElementById("phone").value,
    email: document.getElementById("email").value,
    date: document.getElementById("date").value,
    package: document.getElementById("package").value,
    message: document.getElementById("message").value
  })
  .then(function(response) {
    Toastify({
      text: "Request submitted! We'll be in touch soon.",
      duration: 4000,
      gravity: "top",
      position: "center",
      style: {
      background: "linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)",
      color: "#222",
      borderRadius: "8px",
      fontSize: "1rem",
      boxShadow: "0 2px 8px rgba(0,0,0,0.07)"
      },
      close: false
    }).showToast();
    document.getElementById("contact-form").reset();
    button.disabled = false;
    button.textContent = originalText;
  }, function(error) {
    Toastify({
      text: "Sorry, there was an error sending your request. Please try again.",
      duration: 5000,
      gravity: "top",
      position: "center",
      style: {
      background: "linear-gradient(90deg, #e94343ff 0%, #ff2929ff 100%)",
      color: "#222",
      borderRadius: "8px",
      fontSize: "1rem",
      boxShadow: "0 2px 8px rgba(0,0,0,0.07)"
      },
      close: true
    }).showToast();
    button.disabled = false;
    button.textContent = originalText;
  });

  // Notify owner via SMS (Node.js server)
  fetch('http://localhost:3001/notify-owner', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: document.getElementById("name").value,
      phone: document.getElementById("phone").value,
      date: document.getElementById("date").value,
      packageName: document.getElementById("package").value,
      message: document.getElementById("message").value
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      // Optionally show a Toastify notification for SMS sent
      Toastify({
        text: "Owner notified via SMS!",
        duration: 3000,
        gravity: "top",
        position: "center",
        backgroundColor: "#4BB543",
        close: true
      }).showToast();
    } else {
      Toastify({
        text: "SMS notification failed.",
        duration: 3000,
        gravity: "top",
        position: "center",
        backgroundColor: "#e94343",
        close: true
      }).showToast();
    }
  });

});

// Show modal if not logged in
firebase.auth().onAuthStateChanged(function(user) {
  if (!user) {
    document.getElementById('auth-modal').style.display = 'block';
  } else {
    document.getElementById('auth-modal').style.display = 'none';
    // Optionally, set a cookie with user info (expires in 30 days)
    document.cookie = `user=${user.email}; max-age=${60*60*24*30}; path=/`;
  }
});

// Email/password login/signup
document.getElementById('email-login-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const button = this.querySelector("button[type='submit']");
  const originalText = button.textContent;
  button.disabled = true;
  button.innerHTML = '<span class="loading-spinner"></span>Sending...';
  
  const email = document.getElementById('auth-email').value;
  const password = document.getElementById('auth-password').value;
  firebase.auth().signInWithEmailAndPassword(email, password)
    .catch(function(error) {
      // If user not found, sign up
      if (error.code === 'auth/user-not-found') {
        firebase.auth().createUserWithEmailAndPassword(email, password);
      } else {
        alert(error.message);
      }
    });
});

// Google login
function loginWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider);
}

// Facebook login
function loginWithFacebook() {
  const provider = new firebase.auth.FacebookAuthProvider();
  firebase.auth().signInWithPopup(provider);
}

// GitHub login
function loginWithGithub() {
  const provider = new firebase.auth.GithubAuthProvider();
  firebase.auth().signInWithPopup(provider);
}

// Highlight nav link on scroll (optional enhancement)
window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll("nav a");
  let current = "";
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 80;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute("id");
    }
  });
  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + current) {
      link.classList.add("active");
    }
  });
});
