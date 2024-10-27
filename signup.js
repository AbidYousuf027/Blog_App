const signupForm = document.getElementById("signup-form");
signupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  signup();
});

function signup() {
  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (firstName === "") {
    alert("Please enter your first name.");
  } else if (lastName === "") {
    alert("Please enter your last name.");
  } else if (email === "") {
    alert("Please enter your email.");
  } else if (!validateEmail(email)) {
    alert("Please enter a valid email address.");
  } else if (password === "") {
    alert("Please enter a password.");
  } else if (confirmPassword === "") {
    alert("Please enter your confirm password.");
  } else if (password !== confirmPassword) {
    alert("Passwords do not match! Please try again.");
  } else {
    alert(`${firstName} ${lastName}\nRegistration Successfully`);

    let userData = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
    };

    let data = JSON.parse(localStorage.getItem("userData")) || [];

    const userExists = data.some((user) => user.email === email);
    if (userExists) {
      alert("This email is already registered.");
      return;
    }

    data.push(userData);
    localStorage.setItem("userData", JSON.stringify(data));

    localStorage.setItem("loggedInUser", email);

    setTimeout(() => {
      window.location.href = "./profile.html";
    }, 1000);
    return;
  }
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

const loginBtn = document.getElementById("login");
loginBtn.addEventListener("click", (event) => {
  event.preventDefault();

  setTimeout(() => {
    window.location.href = "./login.html";
  }, 250);
});
