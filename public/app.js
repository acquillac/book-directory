const addBookForm = document.querySelector(".addbookform");
const bookOutput = document.querySelector(".books");

let title = document.getElementById("title");
let author = document.getElementById("author");
let publisher = document.getElementById("publisher");
let discription = document.getElementById("discription");

// Grabbing Data from json file
window.addEventListener("DOMContentLoaded", () => {
  let url = "http://127.0.0.1:3000/api";
  let xhrget = new XMLHttpRequest();
  xhrget.onreadystatechange = () => {
    if (xhrget.readyState == 4 && xhrget.status == 200) {
      displayContent(xhrget.response);
    }
  };
  xhrget.open("GET", url, true);
  xhrget.send();
});

// Adding books to page
function displayContent(data) {
  data = JSON.parse(data);

  data.forEach((book) => {
    const container = document.createElement("div");
    container.className = "book-container";
    let output = `
    <img src="/img/defaultbook.jpg" alt="Book Image" width="150" height="150"> 
    <h3>${book[0]}</h3>
    <p><small>Author: </small>${book[1].book_author}</p>
    <p><small>Publisher: </small>${book[1].book_publisher}</p>
    <small>Discription: </small>
    <p>${book[1].book_discription}</p>
    `;
    container.innerHTML = output;
    bookOutput.appendChild(container);
  });
}

// Sending Data to node server
addBookForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let formData = {
    book_title: title.value,
    book_author: author.value,
    book_publisher: publisher.value,
    book_discription: discription.value,
  };

  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/");
  xhr.setRequestHeader("content-type", "application/json");
  xhr.onload = () => {
    if (xhr.status == 200) {
      console.log(this.responseText);
    } else {
      console.log("POST request to add book failed");
    }
  };

  xhr.send(JSON.stringify(formData));
});
