const { ipcRenderer, remote } = require("electron");
const axios = require("axios");
const hotkeys = require("hotkeys-js");

const ENDPOINT = "http://warlock.tech:3000/";
const username = 'admin';
const password = 'strifelord';

hotkeys('*', function(event, handler) {
    // Prevent the default refresh event under WINDOWS system
    event.preventDefault();
    console.log(event);
    
  });