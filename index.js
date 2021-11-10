const { Console } = require("console");
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

app.post("/delete", (req, res) => {
  console.log(req.body);
  console.log(req.body.bookId);
  res.send("success");

  let configFile = fs.readFileSync("./bookData.json", "utf8");
  let config = JSON.parse(configFile);

  let index = -1;

  config.forEach((book) => {
    index++;
    if (book[0] === req.body.bookId) {
      config.splice(index, 1);
      let configJSON = JSON.stringify(config, null, 4);
      fs.writeFileSync("./bookdata.json", configJSON);
    }
  });
});

app.post("/editbook", (req, res) => {
  let configFile = fs.readFileSync("./bookData.json", "utf8");
  let config = JSON.parse(configFile);

  config.forEach((book) => {
    if (book[0] === req.body.book_id) {
      if (req.body.edit_title !== "") {
        book[0] = req.body.edit_title;
      }

      if (req.body.edit_author !== "") {
        book[1].book_author = req.body.edit_author;
      }

      if (req.body.edit_publisher !== "") {
        book[1].book_publisher = req.body.edit_publisher;
      }

      if (req.body.edit_discription !== "") {
        book[1].book_discription = req.body.edit_discription;
      }

      let configJSON = JSON.stringify(config, null, 4);
      fs.writeFileSync("./bookdata.json", configJSON);

      res.send("Book was edited");
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
