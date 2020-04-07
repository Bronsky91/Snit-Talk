const Express = require("express");
const Mongoose = require("mongoose");
const BodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const https = require("https");
const fs = require("fs");
const basicAuth = require("express-basic-auth");

var app = Express();

app.use(
  basicAuth({
    users: { admin: "strifelord" },
  })
);

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

Mongoose.connect(
  "mongodb://snittalker:talksnit69@ds227373.mlab.com:27373/snit-talk"
);

const PackageModel = Mongoose.model("package", {
  name: { type: String },
  snitList: [
    {
      snit: String,
    },
  ],
});

const UserModel = Mongoose.model("user", {
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  email: { type: String },
  hotkeys: [
    {
      hotkey: String,
    },
  ],
});

app.post("/user-signup", async (req, res) => {
  try {
    console.log(req);
    var user = new UserModel();
    console.log(user);
    user.username = req.body.username;
    user.email = req.body.email;
    user.passwordHash = bcrypt.hashSync(req.body.password, 10);
    user.hotkeys = [{ hotkey: "alt" }, { hotkey: "s" }]; // Default Hotkeys
    // save the user and check for errors
    user.save(function (err) {
      res.json({
        data: user,
      });
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/user-login", async (req, res) => {
  try {
    UserModel.findOne({ username: req.body.username }, function (err, user) {
      if (!user) {
        return res.status(401).send({ message: "The username does not exist" });
      }
      if (!bcrypt.compareSync(req.body.password, user.passwordHash)) {
        return res.status(401).send({ message: "The password is invalid" });
      }
      res.json(user);
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

// TODO: Add endpoint for updating hotkeys on users
// Test to make sure the order of the array stays

app.get("/snit-packages", async (req, res) => {
  try {
    var packages = await PackageModel.find().exec();
    var resBody = [];
    for (let package of packages) {
      resBody.push({
        name: package.name,
        id: package._id,
      });
    }
    res.send(resBody);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/snit/:id", async (req, res) => {
  try {
    var package = await PackageModel.findById(req.params.id).exec();
    res.send(package);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/snit-package", async (req, res) => {
  try {
    var package = new PackageModel(req.body);
    var result = await package.save();
    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/snit-submit/:id", async (req, res) => {
  try {
    PackageModel.findById(req.params.id, function (err, package) {
      if (err) res.send(err);
      package.snitList.push(req.body);
      package.save(function (err) {
        if (err) res.json(err);
        res.json({
          package,
        });
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

app.post("/snit-remove/:id", async (req, res) => {
  try {
    PackageModel.findById(req.params.id, function (err, package) {
      if (err) res.send(err);
      package.snitList.pull(req.body);
      package.save(function (err) {
        if (err) res.json(err);
        res.json({
          package,
        });
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

app.listen(3000, () => {
  console.log("Listening at http://localhost:3000");
});

/* https.createServer({
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem'),
  passphrase: 'tipthewench'
}, app)s
.listen(port, () => {
  console.log("Running RestHub on port " + port);
}); */
