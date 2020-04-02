const { ipcRenderer, remote } = require("electron");
const axios = require("axios");

const ENDPOINT = "http://localhost:3000/";

const onButton = document.getElementById("onBtn");
const offButton = document.getElementById("offBtn");
const packageSelect = document.getElementById("packages");

axios.get(ENDPOINT + "snit-packages/").then(res => {
  for (let p of res.data) {
    var option = document.createElement("option");
    option.text = p.name;
    option.value = p.id;
    packageSelect.add(option);
  }
});

onButton.addEventListener("click", function() {
  ipcRenderer.send("snitCheck", true);
});

offButton.addEventListener("click", function() {
  ipcRenderer.send("snitCheck", false);
});

packageSelect.addEventListener("change", function() {
    axios.get(ENDPOINT + "snit/"+packageSelect.value).then(res => {
        ipcRenderer.send("setPackage", res.data);
      });
  });
