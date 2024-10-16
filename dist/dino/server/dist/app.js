const express = require("express");
const bodyparser = require("body-parser");
const cookieParser = require('cookie-parser');

var app = express();
app.listen(3000, () => {
  console.log("Server running on port 3000");
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://127.0.0.1:1993");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyparser.json());
app.use(cookieParser());

app.get("/:name", (req, res, next) => {
  const dinoName = req.params.name;
  const dinosaurs = [
    { name: "Velociraptor", description: "Velociraptor was a predatory dromaeosaur of the Upper Cretaceous, about 75-71 million years ago." },
    { name: "Tyrannosaurus", description: "Tyrannosaurus (meaning 'tyrant lizard') was a large predatory dinosaur from the Upper Cretaceous, 68 to 65 million years ago." },
  ];
  const dino = dinosaurs.find(d => d.name.toLowerCase() === dinoName.toLowerCase());
  if (dino) {
    res.json(dino);
  } else {
    res.status(404).send("Dinosaur not found");
  }
});


app.post("/", (req, res, next) => {
  console.log("Received post request", req.body);
  res.send(req.body);
});

app.get("/cookie", (req, res, next) => {
  if (req.cookies.Favorite) {
    console.log("Received cookie from call: ", req.cookies.Favorite);
    res.send(`Cookie sent to server:<br/>Name: <em>Favorite</em><br/>Value: <em>${req.cookies.Favorite}</em>`);
  }
  else {
    res.cookie("Favorite", "Chocolate", { maxAge: 3600 }).send("Cookie created by server:<br/>Name: <em>Favorite</em><br/>Value: <em>Chocolate</em>");
  }
});