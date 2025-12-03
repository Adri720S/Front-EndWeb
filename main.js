// ===============================
// KONSTANTA DAN VARIABLE GLOBAL
// ===============================
const STORAGE_KEY = "BOOKSHELF_APPS";
let books = [];
let editedBookId = null; // khusus untuk fitur edit

// ===============================
// LOAD DATA SAAT HALAMAN DIBUKA
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("bookForm");
  const searchForm = document.getElementById("searchBook");

  loadBooksFromStorage();
  renderBooks();

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (editedBookId === null) {
      addBook();
    } else {
      saveEditedBook();
    }
  });

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    searchBook();
  });
});

// ===============================
// FUNGSI LOCAL STORAGE
// ===============================
function saveBooks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

function loadBooksFromStorage() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    books = JSON.parse(data);
  }
}

// ===============================
// UTILITAS
// ===============================
function generateId() {
  return +new Date();
}

function findBook(id) {
  return books.find((b) => b.id === id);
}

function findBookIndex(id) {
  return books.findIndex((b) => b.id === id);
}

// ===============================
// TAMBAH BUKU
// ===============================
function addBook() {
  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = Number(document.getElementById("bookFormYear").value);
  const isComplete = document.getElementById("bookFormIsComplete").checked;

  const newBook = {
    id: generateId(),
    title,
    author,
    year,
    isComplete,
  };

  books.push(newBook);

  saveBooks();
  renderBooks();
  document.getElementById("bookForm").reset();
}

// ===============================
// EDIT BUKU
// ===============================
function editBook(id) {
  const book = findBook(id);
  editedBookId = id;

  document.getElementById("bookFormTitle").value = book.title;
  document.getElementById("bookFormAuthor").value = book.author;
  document.getElementById("bookFormYear").value = book.year;
  document.getElementById("bookFormIsComplete").checked = book.isComplete;

  document.getElementById("bookFormSubmit").innerHTML = "Simpan Perubahan";
}

function saveEditedBook() {
  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = Number(document.getElementById("bookFormYear").value);
  const isComplete = document.getElementById("bookFormIsComplete").checked;

  const index = findBookIndex(editedBookId);
  books[index] = { ...books[index], title, author, year, isComplete };

  editedBookId = null; // reset mode edit

  document.getElementById("bookFormSubmit").innerHTML =
    'Masukkan Buku ke rak <span>Belum selesai dibaca</span>';
  document.getElementById("bookForm").reset();

  saveBooks();
  renderBooks();
}

// ===============================
// HAPUS BUKU
// ===============================
function deleteBook(id) {
  const index = findBookIndex(id);
  books.splice(index, 1);

  saveBooks();
  renderBooks();
}

// ===============================
// PINDAHKAN RAK (toggle isComplete)
// ===============================
function toggleBookStatus(id) {
  const book = findBook(id);
  book.isComplete = !book.isComplete;

  saveBooks();
  renderBooks();
}

// ===============================
// RENDER UI
// ===============================
function renderBooks(list = null) {
  const incompleteContainer = document.getElementById("incompleteBookList");
  const completeContainer = document.getElementById("completeBookList");

  incompleteContainer.innerHTML = "";
  completeContainer.innerHTML = "";

  const data = list ?? books;

  data.forEach((book) => {
    const element = createBookElement(book);

    if (book.isComplete) {
      completeContainer.appendChild(element);
    } else {
      incompleteContainer.appendChild(element);
    }
  });
}

// Membuat elemen buku sesuai format wajib
function createBookElement(book) {
  const wrapper = document.createElement("div");
  wrapper.setAttribute("data-bookid", book.id);
  wrapper.setAttribute("data-testid", "bookItem");

  const title = document.createElement("h3");
  title.setAttribute("data-testid", "bookItemTitle");
  title.textContent = book.title;

  const author = document.createElement("p");
  author.setAttribute("data-testid", "bookItemAuthor");
  author.textContent = "Penulis: " + book.author;

  const year = document.createElement("p");
  year.setAttribute("data-testid", "bookItemYear");
  year.textContent = "Tahun: " + book.year;

  const action = document.createElement("div");

  const toggleBtn = document.createElement("button");
  toggleBtn.setAttribute("data-testid", "bookItemIsCompleteButton");
  toggleBtn.textContent = book.isComplete
    ? "Belum selesai dibaca"
    : "Selesai dibaca";
  toggleBtn.addEventListener("click", () => toggleBookStatus(book.id));

  const deleteBtn = document.createElement("button");
  deleteBtn.setAttribute("data-testid", "bookItemDeleteButton");
  deleteBtn.textContent = "Hapus Buku";
  deleteBtn.addEventListener("click", () => deleteBook(book.id));

  const editBtn = document.createElement("button");
  editBtn.setAttribute("data-testid", "bookItemEditButton");
  editBtn.textContent = "Edit Buku";
  editBtn.addEventListener("click", () => editBook(book.id));

  action.append(toggleBtn, deleteBtn, editBtn);

  wrapper.append(title, author, year, action);
  return wrapper;
}

// ===============================
// FITUR OPSIONAL: SEARCH
// ===============================
function searchBook() {
  const keyword = document
    .getElementById("searchBookTitle")
    .value.toLowerCase();

  const filtered = books.filter((b) =>
    b.title.toLowerCase().includes(keyword)
  );

  renderBooks(filtered);
}
