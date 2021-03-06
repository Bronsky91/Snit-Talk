const { ipcRenderer, remote } = require("electron");
const axios = require("axios");
const hotkeys = require("hotkeys-js");

// API Constants
const ENDPOINT = "http://localhost:3000/";
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
const hotkeyUpdate = document.getElementById("hotkeyUpdate");
const signUpBack = document.getElementById("signUpBack");

// Input Fields
const snitSubmission = document.getElementById("submission");
const packageSelect = document.getElementById("packages");
const loginUsername = document.getElementById("loginUsername");
const loginPassword = document.getElementById("loginPassword");
const signUpEmail = document.getElementById("signUpEmail");
const signUpUsername = document.getElementById("signUpUsername");
const signUpPassword = document.getElementById("signUpPassword");
const currentHotKeys = document.getElementById("currentHotKeys");
const onOrOff = document.getElementById('onOrOff');

ipcRenderer.on('onOrOff', function (event, snitOn) {
  onOrOff.innerText = snitOn ? "On" : "Off"
})

ipcRenderer.on('currentHotKeys', function (event, hotkeys) {
  currentHotKeys.innerText = hotkeys[0].hotkey + " + " + hotkeys[1].hotkey;
});

function getSnits() {
  axios.get(ENDPOINT + "snit/" + packageSelect.value, {
    auth: {
      username,
      password
    }
  }).then(res => {
    ipcRenderer.send("setPackage", res.data);
  }).catch(err => {
    ipcRenderer.send("alert", { title: 'OH SNIT!', message: err.message });
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
    ipcRenderer.send("alert", { title: 'OH SNIT!', message: "Snit Submitted!" });
  }).catch(err => {
    ipcRenderer.send("alert", { title: 'OH SNIT!', message: err.message });
  });
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
    ipcRenderer.send("hotKeyUpdate", res.data.hotkeys);
   // currentHotKeys.innerText = res.data.hotkeys[0].hotkey + " + " + res.data.hotkeys[1].hotkey;
    ipcRenderer.send("userId", res.data._id)
  }).catch(err => {
    ipcRenderer.send("alert", { title: 'OH SNIT!', message: err.message });
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
    ipcRenderer.send("alert", { title: 'OH SNIT!', message: err.message });
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

submitSnit.addEventListener("click", function (event) {
  event.preventDefault();
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

loginButton.addEventListener("click", function (event) {
  event.preventDefault();
  if (!loginUsername.value == "") {
    login({
      username: loginUsername.value,
      password: loginPassword.value
    });
  }
});

signUpButton.addEventListener('click', function (event) {
  event.preventDefault();
  if (!signUpUsername == "" && !signUpEmail == "") {
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

signUpBack.addEventListener('click', function () {
  signUpPage.classList.add('hide');
  loginPage.classList.remove('hide');
})

hotkeyUpdate.addEventListener('click', function () {
  ipcRenderer.send("hotKeySetup", true);
})

