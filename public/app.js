const addBookForm = document.querySelector(".addbookform");
const bookOutput = document.querySelector(".books");

let title = document.getElementById("title");
let author = document.getElementById("author");
let publisher = document.getElementById("publisher");
let discription = document.getElementById("discription");

// Getting books if any exist
window.addEventListener("DOMContentLoaded", () => {
  let url = "http://127.0.0.1:3000/api";
  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
      displayContent(xhr.response);
    }
  };
  xhr.open("GET", url, true);
  xhr.send();
});

// if books exist display them on page
function displayContent(data) {
  data = JSON.parse(data);

  data.forEach((book) => {
    const container = document.createElement("div");
    container.className = "book-container";
    container.id = `${book[0]}`;
    let output = `
    <img src="/img/defaultbook.jpg" alt="Book Image" width="150" height="150"> 
    <h3>${book[0]}</h3>
    <p><small>Author: </small>${book[1].book_author}</p>
    <p><small>Publisher: </small>${book[1].book_publisher}</p>
    <small>Discription: </small>
    <p>${book[1].book_discription}</p>
    <button class="remove-btn">Remove Book</Button>
    `;
    container.innerHTML = output;
    bookOutput.appendChild(container);
  });

  removeBook();
}

// Submiting a new book
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
      title.value = "";
      author.value = "";
      publisher.value = "";
      discription.value = "";
      location.reload();
    } else {
      console.log("POST request to add book failed");
    }
  };

  xhr.send(JSON.stringify(formData));
});

// Remove book
function removeBook() {
  const getRemoveBtns = document.querySelectorAll(".remove-btn");

  getRemoveBtns.forEach((book) => {
    book.addEventListener("click", () => {
      let bookId = book.parentElement.id;
      let postData = { bookId };
      let message = `Are you sure you want to delete ${bookId}`;

      if (confirm(message) === true) {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "/test");
        xhr.setRequestHeader("content-type", "application/json");
        xhr.onload = () => {
          if (xhr.response == "success") {
            location.reload();
          } else {
            console.log("unable to remove");
          }
        };
        xhr.send(JSON.stringify(postData));
      }
    });
  });
}
