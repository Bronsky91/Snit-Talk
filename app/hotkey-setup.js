const { ipcRenderer, remote } = require("electron");
const axios = require("axios");
const hotkeys = require("hotkeys-js");

const ENDPOINT = "http://warlock.tech:3000/";
const username = 'admin';
const password = 'strifelord';

const hotkeyShow = document.getElementById('hotkeyShow');

hotkeys('*', function(event, handler) {
    // Prevent the default refresh event under WINDOWS system
    event.preventDefault();
    hotkeyShow.innerText = event.key;
  });

  //ipcRenderer.send("hotKeyUpdate", keysUpdate);
  // Show hotkey pressed, hit button to confirm
  // Makes a new line
  // Up to 3