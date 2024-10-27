const logoutBtn = document.getElementById("logout");
logoutBtn.addEventListener("click", (event) => {
  event.preventDefault();


  localStorage.clear();
  localStorage.removeItem("loggedInUser");
  setTimeout(() => {
    window.location.href = "./login.html";
  }, 1000);
});

document.addEventListener("DOMContentLoaded", function () {
  const userName = document.getElementById("userName");
  const profileImage = document.getElementById("profileImage");

  const loggedInUserEmail = localStorage.getItem("loggedInUser");
  const userData = JSON.parse(localStorage.getItem("userData")) || [];
  const currentUser = userData.find((user) => user.email === loggedInUserEmail);

  userName.textContent = currentUser
    ? `${currentUser.firstName} ${currentUser.lastName}`
    : "Guest";
  profileImage.style.backgroundImage =
    currentUser && currentUser.profileImage
      ? `url('${currentUser.profileImage}')`
      : `url('default-image.png')`;
});

let isEditing = false;
let currentEditingBlog = null;

const publishForm = document.getElementById("publish");
publishForm.addEventListener("submit", function (event) {
  event.preventDefault();
  publishBlog();
});

function displayMessage(element, message, isSuccess) {
  element.style.display = "block";
  element.textContent = message;
  if (isSuccess) {
    element.classList.remove('error');
    element.classList.add('success');
  } else {
    element.classList.remove('success');
    element.classList.add('error');
  }
  setTimeout(() => {
    element.style.display = "none";
  }, 2000);
}






function publishBlog() {
  const placeholder = document.getElementById("place-holder").value.trim();
  const commentsBox = document.getElementById("comments").value.trim();
  const errorMessage = document.getElementById("error-message");
  const successMessage = document.getElementById("success-message");

  if (!placeholder || !commentsBox) {
    displayMessage(errorMessage, "Please fill in all fields.", false);
    return;
  }

  let blogData = JSON.parse(localStorage.getItem("blogs")) || [];
  const loggedInUserEmail = localStorage.getItem("loggedInUser");
  let userData = JSON.parse(localStorage.getItem("userData"));
  const currentUser = userData.find((user) => user.email === loggedInUserEmail);
  const userName = currentUser
    ? `${currentUser.firstName} ${currentUser.lastName}`
    : "Guest";

  if (isEditing && currentEditingBlog) {
    blogData = blogData.map((blog) => {
      if (blog.id === currentEditingBlog.id) {
        return {
          ...blog,
          title: placeholder,
          content: commentsBox,
        };
      }
      return blog;
    });

    displayMessage(successMessage, "Blog updated successfully!", true);
    isEditing = false;
    currentEditingBlog = null;
  } else {
    const newBlog = {
      id: Date.now(),
      title: placeholder,
      content: commentsBox,
      user: userName,
      userEmail: loggedInUserEmail,
      date: new Date().toDateString(),
      userImage: currentUser.profileImage,
    };

    blogData.push(newBlog);
    displayMessage(successMessage, "Blog published successfully!", true);
 
  }

  localStorage.setItem("blogs", JSON.stringify(blogData));
  publishForm.reset();
  errorMessage.style.display = "none";

  updateDashboard(blogData);
}

function updateDashboard(blogData) {
  const dashboardBox2 = document.getElementById("dashboard-box2");
  dashboardBox2.innerHTML = "";

  if (blogData.length === 0) {
    dashboardBox2.innerHTML = "<p>No blogs available.</p>";
    return;
  }
  blogData.forEach((blog, index) => {
    addBlogToDashboard(blog, index);
  });
}

function addBlogToDashboard(blog, index) {
  const dashboardBox2 = document.getElementById("dashboard-box2");
  const blogContainer = document.createElement("div");
  blogContainer.classList.add("card");

  const profileImageStyle = blog.userImage
    ? `background-image: url(${blog.userImage});`
    : `background-image: url('default-image.png');`;

  blogContainer.innerHTML = `
        <div class="img" style="${profileImageStyle}"></div>
        <div class="detail">
            <p id="msg-${index}" class="msg">${blog.title}<br></p>
            <p id="user-${index}" class="user">${blog.user} - ${blog.date}</p>
            <p id="content-${index}">${blog.content}</p>
        </div>
        <div class="button-group">
            <button id="delete-${index}" type="button">Delete</button>
            <button id="edit-${index}" type="button">Edit</button>
        </div>
    `;

  dashboardBox2.appendChild(blogContainer);

  const deleteButton = document.getElementById(`delete-${index}`);
  const editButton = document.getElementById(`edit-${index}`);

  deleteButton.addEventListener("click", function () {
    const confirmDelete = confirm("Are you sure you want to delete this blog?");
    if (confirmDelete) {
      deleteBlog(blog.id);
    }
  });

  editButton.addEventListener("click", function () {
    editBlog(blog);
  });
}

function deleteBlog(blogId) {
  const loggedInUserEmail = localStorage.getItem("loggedInUser");
  let blogData = JSON.parse(localStorage.getItem("blogs")) || [];

  const blogToDelete = blogData.find((blog) => blog.id === blogId);
  if (blogToDelete && blogToDelete.userEmail !== loggedInUserEmail) {
    alert("You are not authorized to delete this blog.");
    return;
  }

  blogData = blogData.filter(blog => !(blog.id === blogId && blog.userEmail === loggedInUserEmail));

  localStorage.setItem("blogs", JSON.stringify(blogData));
  updateDashboard(blogData);
}

function editBlog(blog) {
  const loggedInUserEmail = localStorage.getItem("loggedInUser");

  if (blog.userEmail !== loggedInUserEmail) {
    alert("You are not authorized to edit this blog.");
    return;
  }

  const placeholderInput = document.getElementById("place-holder");
  const commentsBox = document.getElementById("comments");

  placeholderInput.value = blog.title;
  commentsBox.value = blog.content;

  isEditing = true;
  currentEditingBlog = blog;
}

document.addEventListener("DOMContentLoaded", function () {
  const blogData = JSON.parse(localStorage.getItem("blogs")) || [];
  updateDashboard(blogData);
});
