const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  login();
});

function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  let storeData = JSON.parse(localStorage.getItem("userData"));
  
 
  if(!email || !password){
    alert("Please fill in both email and password.");
    return;
  }


  if (!storeData || storeData.length === 0) {
    alert("No user found. Please sign up.");
    setTimeout(() => {
      window.location.href = "./index.html";
    }, 1000);
    return;
  }


  let currentUser = storeData.find(user => user.email === email && user.password === password)
  
  if(currentUser){
    localStorage.setItem("loggedInUser", currentUser.email);

    loginForm.reset();

    alert(`${currentUser.email}\nSuccessfully Logged In`);
    setTimeout(()=>{
      window.location.href = "./dashboard.html";
    }, 1000);
  }else{
    alert("Incorrect email or password. Please try again.");

    loginForm.reset();
  }
}


const signupBtn = document.getElementById("signup");
signupBtn.addEventListener("click", (event) => {
  event.preventDefault();

  setTimeout(() => {
    window.location.href = "./index.html";
  }, 250);
});
