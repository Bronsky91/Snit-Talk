const { ipcRenderer, remote } = require("electron");
const axios = require("axios");

const ENDPOINT = "http://localhost:3000/";
const username = 'admin';
const password = 'strifelord';

// Input Fields
const packageSelect = document.getElementById("packages");
const newSnit = document.getElementById("newSnit");

// Buttons
const addSnitButton = document.getElementById("addSnitButton");
const createSnitBtn = document.getElementById("createSnitBtn");

function getSnitPackages(){
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
    });
}

function sendSnit(snit, id) {
    // Axios Post call to submit new snit to "Snit Packages"
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

function createSnit(name){
        // Axios Post call to create a new "Snit Package"
        axios({
            method: 'post',
            url: ENDPOINT + "snit-package/",
            auth: {
                username,
                password
            },
            data: { name }
        }).then(res => {
            ipcRenderer.send("alert", { title: 'OH SNIT!', message: "Snit Package Created!" });
            getSnitPackages();
        }).catch(err => {
            ipcRenderer.send("alert", { title: 'OH SNIT!', message: err.message });
        });
}




addSnitButton.addEventListener('click', function (event) {
    event.preventDefault();
    if (newSnit.value != "") {
        sendSnit(newSnit.value, packageSelect.value);
        newSnit.value = "";
    }
});

createSnitBtn.addEventListener('click', function (event) {
    event.preventDefault();
    if (newPackage.value != "") {
        createSnit(newPackage.value);
        newPackage.value = "";
    }
})

// Gets Snit Packages to choose from on page load
getSnitPackages();