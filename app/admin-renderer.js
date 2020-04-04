const { ipcRenderer, remote } = require("electron");
const axios = require("axios");

const ENDPOINT = "http://warlock.tech:3000/";
const username = 'admin';
const password = 'strifelord';