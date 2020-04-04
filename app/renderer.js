const { ipcRenderer, remote } = require("electron");
const axios = require("axios");
const hotkeys = require("hotkeys-js");

// API Constants
const ENDPOINT = "http://warlock.tech:3000/";
const username = 'admin';
const password = 'strifelord';

// Pages
const homePage = document.getElementById('home');
const signUpPage = document.getElementById('signUp');
const loginPage = document.getElementById('login')

// Buttons
const onButton = document.getElementById("onBtn");
const offButton = document.getElementById("offBtn");
const submitSnit = document.getElementById("submit-snit");
const loginButton = document.getElementById("loginBtn");
const signUpButton = document.getElementById("signUpBtn");
const goToSignUpButton = document.getElementById("goToSignUp");

// Input Fields
const snitSubmission = document.getElementById("submission");
const packageSelect = document.getElementById("packages");
const loginUsername = document.getElementById("loginUsername");
const loginPassword = document.getElementById("loginPassword");
const signUpEmail = document.getElementById("signUpEmail");
const signUpUsername = document.getElementById("signUpUsername");
const signUpPassword = document.getElementById("signUpPassword");

function getSnits() {
  axios.get(ENDPOINT + "snit/" + packageSelect.value, {
    auth: {
      username,
      password
    }
  }).then(res => {
    ipcRenderer.send("setPackage", res.data);
  });
}

function sendSnit(snit, id) {
  // Axios Put call to submit new snit to "Snit Packages"
  axios({
    method: 'post',
    url: ENDPOINT + "snit-submit/" + id,
    auth: {
      username,
      password
    },
    data: { snit }
  }).then(res => {
    alert("Snit Submitted!");
  })
}

function login(data) {
  axios({
    method: 'post',
    url: ENDPOINT + "user-login/",
    auth: {
      username,
      password
    },
    data
  }).then(res => {
    loginPage.classList.add('hide');
    homePage.classList.remove('hide');
  }).catch(err => {
    alert(err);
  });
}

function signUp(data) {
  axios({
    method: 'post',
    url: ENDPOINT + "user-signup/",
    auth: {
      username,
      password
    },
    data
  }).then(res => {
    signUpEmail.classList.add('hide');
    loginPage.classList.remove('hide');
  }).catch(err => {
    alert(err);
  });
}

axios.get(ENDPOINT + "snit-packages/", {
  auth: {
    username,
    password
  }
}).then(res => {
  for (let p of res.data) {
    var option = document.createElement("option");
    option.text = p.name;
    option.value = p.id;
    packageSelect.add(option);
  }
  getSnits()
});

submitSnit.addEventListener("click", function () {
  if (snitSubmission.value != "") {
    sendSnit(snitSubmission.value, "5e8555159ae7362021958ee7");
    snitSubmission.value = "";
  }
});

onButton.addEventListener("click", function () {
  ipcRenderer.send("snitCheck", true);
});

offButton.addEventListener("click", function () {
  ipcRenderer.send("snitCheck", false);
});

packageSelect.addEventListener("change", function () {
  getSnits()
});

loginButton.addEventListener("click", function () {
  if (!loginUsername == "") {
    login({
      username: loginUsername.value,
      password: loginPassword.value
    });
  }
});

signUpButton.addEventListener('click', function (){
  if (!signUpUsername == "" && !signUpEmail == ""){
    signUp({
      email: signUpEmail.value,
      username: signUpUsername.value,
      password: signUpPassword.value
    });
  }
})

goToSignUpButton.addEventListener('click', function () {
  loginPage.classList.add('hide');
  signUpPage.classList.remove('hide');
});

