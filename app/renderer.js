const { ipcRenderer, remote } = require("electron");
const axios = require("axios");

const ENDPOINT = "http://warlock.tech:3000/";
const username = 'admin';
const password = 'strifelord';

const onButton = document.getElementById("onBtn");
const offButton = document.getElementById("offBtn");
const packageSelect = document.getElementById("packages");

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

onButton.addEventListener("click", function () {
  ipcRenderer.send("snitCheck", true);
});

offButton.addEventListener("click", function () {
  ipcRenderer.send("snitCheck", false);
});

packageSelect.addEventListener("change", function () {
  getSnits()
});
