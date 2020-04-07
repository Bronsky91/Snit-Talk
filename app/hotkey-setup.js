const { ipcRenderer, remote } = require("electron");
const axios = require("axios");
const hotkeys = require("hotkeys-js");

const ENDPOINT = "http://warlock.tech:3000/";
const username = 'admin';
const password = 'strifelord';

let userId = "";

ipcRenderer.on('userId', function (event, id) {
  console.log(id)
  userId = id;
})

const hotkeyShow = document.getElementById('hotkeyShow');

// Inputs
const firstHotkey = document.getElementById("firstHotkey");
const newHotKeys = document.getElementById("newHotKeys");
const updatedHotKeysMessage = document.getElementById("updatedHotKeysMessage");

// Buttons
const closeHotKeyWindow = document.getElementById('closeHotKeyWindow');
const saveHotKeys = document.getElementById('saveHotKeys');

let updatedHotKeys = []

hotkeys('*', function (event, handler) {
  // Prevent the default refresh event under WINDOWS system
  event.preventDefault();
  const regex = /[A-Za-z0-9]/g;
  const validKey = event.key.match(regex);
  if (firstHotkey.value != '' && validKey && validKey.length == 1) {
    hotkeyShow.innerText = event.key;
    newHotKeys.innerText = firstHotkey.value + " + " + event.key;
    updatedHotKeys = [firstHotkey.value, event.key];
  }
});

saveHotKeys.addEventListener('click', function () {
  if (updatedHotKeys.length == 2) {
    updateHotKeys(updatedHotKeys);
  } else {
    ipcRenderer.send("alert", { title: 'OH SNIT!', message: "Must select new hotkeys before saving!" });
  }
});

function updateHotKeys(hks) {
  let data = { newHotKeys: hks, id: userId }
  console.log(data)
  // hotkeys = [{hotkey: 'key'}, {hotkey: 'key2'}]
  axios({
    method: 'post',
    url: ENDPOINT + "user-hotkeys/",
    auth: {
      username,
      password
    },
    data
  }).then(res => {
    ipcRenderer.send("hotKeyUpdate", Object.values(res.data.user.hotkeys));
    updatedHotKeysMessage.innerText = "Hotkeys have been updated!"
  }).catch(err => {
    ipcRenderer.send("alert", { title: 'OH SNIT!', message: err.message });
  });
};

closeHotKeyWindow.addEventListener('click', function () {
  ipcRenderer.send("closeHotKeyWindow");
});