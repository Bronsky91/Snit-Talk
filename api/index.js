const Express = require("express");
const Mongoose = require("mongoose");
const BodyParser = require("body-parser");

var app = Express();

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

Mongoose.connect(
  "mongodb://snittalker:talksnit69@ds227373.mlab.com:27373/snit-talk"
);

const PackageModel = Mongoose.model("package", {
  name: { type: String },
  snitList: [
    {
      snit: String
    }
  ]
});

app.get("/snit-packages", async (req, res) => {
  try {
    var packages = await PackageModel.find().exec();
    var resBody = [];
    for (let package of packages) {
      resBody.push({
        name: package.name,
        id: package._id
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
    PackageModel.findById(req.params.id, function(err, package) {
      if (err) res.send(err);;
      package.snitList.push(req.body);
      package.save(function(err) {
        if (err) res.json(err);
        res.json({
          package
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
      PackageModel.findById(req.params.id, function(err, package) {
        if (err) res.send(err);;
        package.snitList.pull(req.body);
        package.save(function(err) {
          if (err) res.json(err);
          res.json({
            package
          });
        });
      });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  });

app.listen(3000, () => {
  console.log("Listening at :3000...");
});
