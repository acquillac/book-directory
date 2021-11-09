const { json } = require("express");
const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/index.html"));
});

app.get("/api", (req, res) => {
  res.sendFile(path.join(__dirname + "/bookdata.json"));
});

app.post("/", (req, res) => {
  res.send("post was accepted");
  let bookData = [
    req.body.book_title,
    {
      book_title: req.body.book_title,
      book_author: req.body.book_author,
      book_publisher: req.body.book_publisher,
      book_discription: req.body.book_discription,
    },
  ];

  let configFile = fs.readFileSync("./bookdata.json");
  let config = JSON.parse(configFile);
  config.push(bookData);
  let configJSON = JSON.stringify(config, null, 4);
  fs.writeFileSync("./bookdata.json", configJSON);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
