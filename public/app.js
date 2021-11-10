const addBookForm = document.querySelector(".addbookform");
const bookOutput = document.querySelector(".books");
const modalOverlay = document.querySelector(".modal-overlay");
const modalContent = document.querySelector(".modal-content");

let title = document.getElementById("title");
let author = document.getElementById("author");
let publisher = document.getElementById("publisher");
let discription = document.getElementById("discription");

let editTitle = document.getElementById("edit-title");
let editAuthor = document.getElementById("edit-author");
let editPublisher = document.getElementById("edit-publisher");
let editDiscription = document.getElementById("edit-discription");

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
    <button class="edit-btn">Edit Book</Button>
    `;
    container.innerHTML = output;
    bookOutput.appendChild(container);
  });

  removeBook();
  editBook();
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

// Edit book
function editBook() {
  const getEditBtns = document.querySelectorAll(".edit-btn");

  getEditBtns.forEach((book) => {
    book.addEventListener("click", () => {
      modalOverlay.className = "modal-overlay-active";
      let newHeight = document.documentElement.scrollHeight + "px";
      modalOverlay.style.height = newHeight;
      modalContent.appendChild(book.parentElement);

      modalCancelFunction(book);
      modalSubmitFunction(book);
    });
  });
}

function modalCancelFunction(book) {
  let modalCancel = document.getElementById("edit-cancel-btn");

  modalCancel.addEventListener("click", (e) => {
    e.preventDefault();
    modalOverlay.className = "modal-overlay";
    bookOutput.appendChild(book.parentElement);
  });
}

function modalSubmitFunction(book) {
  let modalSubmit = document.getElementById("edit-submit-btn");

  modalSubmit.addEventListener("click", (e) => {
    e.preventDefault();
    modalOverlay.className = "modal-overlay";

    let editData = {
      book_id: book.parentElement.id,
      edit_title: editTitle.value,
      edit_author: editAuthor.value,
      edit_publisher: editPublisher.value,
      edit_discription: editDiscription.value,
    };

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/editbook");
    xhr.setRequestHeader("content-type", "application/json");
    xhr.onload = () => {
      if (xhr.responseText == "Book was edited") {
        editTitle.value = "";
        editAuthor.value = "";
        editPublisher.value = "";
        editDiscription.value = "";
        location.reload();
      } else {
        console.log("something went wrong");
      }
    };
    console.log(editData);
    xhr.send(JSON.stringify(editData));
  });
}

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
        xhr.open("POST", "/delete");
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
