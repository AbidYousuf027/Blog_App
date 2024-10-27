document.addEventListener("DOMContentLoaded", function () {
    const logoutBtn = document.getElementById("logout");
    logoutBtn.addEventListener("click", handleLogout);
  
    initializeUserDetails();
    setupPasswordChangeForm();
    initializeProfileImage();
  });
  
  function handleLogout(event) {
    event.preventDefault();
    localStorage.removeItem("loggedInUser");
    setTimeout(() => {
      window.location.href = "./login.html";
    }, 1000);
  }
  
  function initializeUserDetails() {
    const userName = document.getElementById("userName");
    const user_name = document.getElementById("user_Name");
    const profileImage = document.getElementById("profileImage");
    const loggedInUserEmail = localStorage.getItem("loggedInUser");
    const userData = JSON.parse(localStorage.getItem("userData") || "[]");
  
    if (loggedInUserEmail && userData) {
      const currentUser = userData.find(
        (user) => user.email === loggedInUserEmail
      );
      if (currentUser) {
        const fullName = `${currentUser.firstName} ${currentUser.lastName}`;
        userName.textContent = fullName;
        user_name.textContent = fullName;
  
        if (currentUser.profileImage) {
          setProfileImage(profileImage, currentUser.profileImage);
        }
      } else {
        setGuestName();
      }
    } else {
      setGuestName();
    }
  }
  
  function setGuestName() {
    document.getElementById("userName").textContent = "Guest";
    document.getElementById("user_Name").textContent = "Guest";
  }
  
  function setupPasswordChangeForm() {
    const typePassword = document.getElementById("typePassword");
    const form = document.getElementById("changePassword");
  
    typePassword.addEventListener("click", () => {
      form.style.display = "flex";
      form.style.flexDirection = "column";
    });
  
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      changePassword();
    });
  
    form.addEventListener("focusin", () => {
      document.getElementById("error-message").style.display = "none";
    });
  }
  
  function changePassword() {
    const oldPassword = document.getElementById("old-password").value;
    const newPassword = document.getElementById("new-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    const errorMessage = document.getElementById("error-message");
    const successMessage = document.getElementById("success-message");
    const form = document.getElementById("changePassword");
  
    const passwordData = JSON.parse(localStorage.getItem("userData") || "[]");
    const currentUserEmail = localStorage.getItem("loggedInUser");
  
    if (!passwordData || !currentUserEmail) {
      displayError(errorMessage, "No user data found!");
      return;
    }
  
    const currentUser = passwordData.find(
      (user) => user.email === currentUserEmail
    );
  
    if (!oldPassword || !newPassword || !confirmPassword) {
      displayError(errorMessage, "Please fill in all password fields.");
      return;
    }
  
    if (!currentUser || currentUser.password !== oldPassword) {
      displayError(errorMessage, "Old password is incorrect!");
      return;
    }
  
    if (newPassword !== confirmPassword) {
      displayError(errorMessage, "New passwords do not match!");
      return;
    }
  
    if (newPassword.length < 6) {
      displayError(
        errorMessage,
        "New password must be at least 6 characters long!"
      );
      return;
    }
  
    currentUser.password = newPassword;
    localStorage.setItem("userData", JSON.stringify(passwordData));
  
    alert("Password successfully updated!");
  
    successMessage.style.display = "block";
    successMessage.textContent = "Password successfully updated!";
    errorMessage.style.display = "none";
  
    form.reset();
    form.style.display = "none";
  
    setTimeout(() => (successMessage.style.display = "none"), 3000);
  }
  
  function displayError(element, message) {
    element.style.display = "block";
    element.textContent = message;
  }
  
  function initializeProfileImage() {
    const cameraIcon = document.getElementById("select");
    const fileInput = document.getElementById("fileInput");
    const profileImage = document.getElementById("profileImage");
    const loggedInUserEmail = localStorage.getItem("loggedInUser");
  
    if (!cameraIcon || !fileInput || !profileImage) {
      console.error("Essential elements not found. Check IDs.");
      return;
    }
  
    if (loggedInUserEmail) {
      const userData = JSON.parse(localStorage.getItem("userData")) || [];
      const currentUser = userData.find(
        (user) => user.email === loggedInUserEmail
      );
  
      if (currentUser && currentUser.profileImage) {
        setProfileImage(profileImage, currentUser.profileImage);
      }
    }
  
    cameraIcon.addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", previewImage);
  }
  
  function setProfileImage(profileImage, imageUrl) {
    profileImage.style.backgroundImage = `url('${imageUrl}')`;
    profileImage.style.backgroundSize = "cover";
  }
  
  function previewImage(event) {
    const file = event.target.files[0];
    const loggedInUserEmail = localStorage.getItem("loggedInUser");
  
    if (file && file.type.startsWith("image/") && loggedInUserEmail) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const imageUrl = e.target.result;
        setProfileImage(document.getElementById("profileImage"), imageUrl);
  
        let userData = JSON.parse(localStorage.getItem("userData")) || [];
        userData = userData.map((user) => {
          if (user.email === loggedInUserEmail) {
            user.profileImage = imageUrl;
          }
          return user;
        });
  
        localStorage.setItem("userData", JSON.stringify(userData));
        alert("Profile image updated successfully.");
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please select a valid image file.");
    }
  }
  