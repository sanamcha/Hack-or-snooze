"use strict";

let currentUser;

 // User login/signup/login
// Handle login form submission.

async function login(evt) {
  console.debug("login", evt);
  evt.preventDefault();

  // grab the username and password
  const username = $("#login-username").val();
  const password = $("#login-password").val();

  // User.login retrieves user info from API and returns User instance
  currentUser = await User.login(username, password);
  $login.trigger("reset");
  saveUserCredentialsInLocalStorage();
  updateUIOnUserLogin();
}

$login.on("submit", login);

/** Handle signup form submission. */
async function signup(evt) {
  console.debug("signup", evt);
  evt.preventDefault();

  const name = $("#signup-name").val();
  const username = $("#signup-username").val();
  const password = $("#signup-password").val();

  // User.signup retrieves user info from API 
  currentUser = await User.signup(username, password, name);

  saveUserCredentialsInLocalStorage();
  updateUIOnUserLogin();

  $signup.trigger("reset");
}

$signup.on("submit", signup);

// Handle click of logout button

function logout(evt) {
  console.debug("logout", evt);
  localStorage.clear();
  location.reload();
}

$navLogOut.on("click", logout);

// Storing/recalling previously-logged-in-user with localStorage


async function checkForRememberedUser() {
  console.debug("checkForRememberedUser");
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  if (!token || !username) return false;

  // try to log in with these credentials (will be null if login failed)
  currentUser = await User.loginViaStoredCredentials(token, username);
}

// Sync current user information to localStorage.

function saveUserCredentialsInLocalStorage() {
  console.debug("saveUserCredentialsInLocalStorage");
  if (currentUser) {
    localStorage.setItem("token", currentUser.loginToken);
    localStorage.setItem("username", currentUser.username);
  }
}
//  show the stories list
//  update nav bar options for logged-in user
//  generate the user profile part of the page

  //added async
  async function updateUIOnUserLogin() {
  console.debug("updateUIOnUserLogin");
  //added
  hidePageComponents();
  putStoriesOnPage();

  $allStoriesList.show();

  updateNavOnLogin();
  //added
  generateUserProfile();
}

//added
function generateUserProfile() {
  console.debug("generateUserProfile");

  $("#profile-name").text(currentUser.name);
  $("#profile-username").text(currentUser.username);
  $("#profile-account-date").text(currentUser.createdAt.slice(0, 10));
}