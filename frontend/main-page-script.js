// ===== AUTHENTICATION =====


function getToken() {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('❌ No token found. Redirecting to login...');
    window.location.href = 'https://projectcrud-viktoriia2.onrender.com/home';
    return null;
  }
  return token;
}

function getHeaders(token) {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
}

// Check if user is logged in on page load
window.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('You must be logged in to access this page');
    window.location.href = 'https://projectcrud-viktoriia2.onrender.com/home';
  }
});

// Logout function
function logout() {
  localStorage.removeItem('token');
  window.location.href = 'https://projectcrud-viktoriia2.onrender.com/home';
}

// Wire up logout button
document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.getElementById('logout_btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }
});

// ===== API URLS =====
const API_URL_BOOKS = "https://projectcrud-viktoriia2.onrender.com/api/books";
const API_URL_LOCAL_BOOKS = "http://localhost:3000/api/books"


const borrowingsBtn = document.getElementById("button_borrowings");
const readersSection = document.getElementById("readers_section");
const borrowingsSection = document.getElementById("borrowings_section");


const booksList = document.getElementById("books_list");
const modal = document.getElementById("book_modal");
const addBookBtn = document.getElementById("add_books_btn");
const cancelBtn = document.getElementById("cancel_btn");
const form = document.getElementById("book_form");
const readersBtn = document.getElementById("button_readers");
const booksBtn = document.getElementById("button_books");
const readerSection = document.getElementById("readers_section");
const booksSection = document.getElementById("books_section");
const booksCountEl = document.getElementById("books_count");

let editingBookId = null;

// render books
async function renderBooks() {
  booksList.innerHTML = "";
  const token = getToken();
  if (!token) return;
  
  const res = await fetch(API_URL_BOOKS, {
    headers: getHeaders(token)
  });
  
  if (!res.ok) {
    if (res.status === 401) {
      logout();
      return;
    }
    throw new Error('Failed to fetch books');
  }
  
  const books = await res.json();

  booksCountEl.textContent = books.length;

  books.forEach((book) => {
    const div = document.createElement("div");
    div.className = "book_card";
    div.dataset.id = book.id;
    div.innerHTML = `
    <div class="card_header">
      <div>
        <h3>${book.title}</h3>
        <p class="card_body">ISBN: ${book.isbn}</p>
      </div>
        <div class="actions_btn">
        
          <button class="edit_btn" title="Edit">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
              class="bi bi-pencil-square" viewBox="0 0 16 16">
              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 
              0 0 1 .707 0l1.293 1.293zm-1.75 
              2.456-2-2L4.939 9.21a.5.5 0 0 
              0-.121.196l-.805 2.414a.25.25 0 0 
              0 .316.316l2.414-.805a.5.5 0 0 
              0 .196-.12l6.813-6.814z"/>
              <path fill-rule="evenodd" 
              d="M1 13.5A1.5 1.5 0 0 0 2.5 
              15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 
              0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 
              0 0 1-.5-.5v-11a.5.5 0 0 
              1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 
              1.5 0 0 0 1 2.5z"/>
            </svg>
          </button>
          <button class="delete_btn" title="Delete">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
              fill="red" class="bi bi-trash" viewBox="0 0 16 16">
              <path d="M5.5 5.5A.5.5 0 0 1 6 
              6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 
              1 .5-.5m2.5 0a.5.5 0 0 1 
              .5.5v6a.5.5 0 0 1-1 
              0V6a.5.5 0 0 1 .5-.5m3 
              .5a.5.5 0 0 0-1 
              0v6a.5.5 0 0 0 1 0z"/>
              <path d="M14.5 3a1 1 0 0 
              1-1 1H13v9a2 2 0 0 1-2 
              2H5a2 2 0 0 1-2-2V4h-.5a1 
              1 0 0 1-1-1V2a1 1 0 0 
              1 1-1H6a1 1 0 0 1 1-1h2a1 
              1 0 0 1 1 1h3.5a1 1 0 0 
              1 1 1zM4.118 4 4 
              4.059V13a1 1 0 0 0 1 
              1h6a1 1 0 0 0 1-1V4.059L11.882 
              4zM2.5 3h11V2h-11z"/>
            </svg>
          </button>
        </div>
    </div>
      
      <p class="card_body">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person" viewBox="0 0 16 16" style="padding-right: 7px;">
      <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
      </svg> ${book.author}</p>
      <p class="card_body"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar" viewBox="0 0 16 16" style="padding-right: 7px;">
      <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
      </svg> ${book.year}</p>
      <p class="card_body"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-book" viewBox="0 0 16 16" style="padding-right: 7px;">
      <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783"/>
      </svg> ${book.genre}</p>
      
    `;
    booksList.appendChild(div);
  });
}

// open modal
addBookBtn.addEventListener("click", () => {
  editingBookId = null;
  form.reset();
  modal.style.display = "flex";
});

// close modal
cancelBtn.addEventListener("click", () => {
  editingBookId = null;
  modal.style.display = "none";
  form.reset();
});

// add or edit books
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const bookData = {
    title: document.getElementById("title").value,
    author: document.getElementById("author").value,
    isbn: document.getElementById("isbn").value,
    year: document.getElementById("year").value,
    genre: document.getElementById("genre").value,
  };

  if (!bookData.title || !bookData.author || !bookData.isbn || !bookData.year) {
    alert("Please fill in all fields.");
    return;
  }

  const token = getToken();
  if (!token) return;
  
  if (editingBookId) {
    await fetch(`${API_URL_BOOKS}/${editingBookId}`, {
      method: "PUT",
      headers: getHeaders(token),
      body: JSON.stringify(bookData),
    });
  } else {
    await fetch(API_URL_BOOKS, {
      method: "POST",
      headers: getHeaders(token),
      body: JSON.stringify(bookData),
    });
  }

  modal.style.display = "none";
  form.reset();
  editingBookId = null;
  await renderBooks();
});

// edit and delete books
booksList.addEventListener("click", async (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const card = btn.closest(".book_card");
  const id = card.dataset.id;

  if (btn.classList.contains("delete_btn")) {
    if (!confirm("Delete this book?")) return;
    const token = getToken();
    if (!token) return;
    await fetch(`${API_URL_BOOKS}/${id}`, { 
      method: "DELETE",
      headers: getHeaders(token)
    });
    await renderBooks();
  }

  if (btn.classList.contains("edit_btn")) {
    const token = getToken();
    if (!token) return;
    const res = await fetch(`${API_URL_BOOKS}/${id}`, {
      headers: getHeaders(token)
    });
    const book = await res.json();

    document.getElementById("title").value = book.title;
    document.getElementById("author").value = book.author;
    document.getElementById("isbn").value = book.isbn;
    document.getElementById("year").value = book.year;
    document.getElementById("genre").value = book.genre;
    editingBookId = id;
    modal.style.display = "flex";
  }
});

// close modal when clicking outside
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    editingBookId = null;
    modal.style.display = "none";
    form.reset();
  }
});

//NEW switch sections
booksBtn.addEventListener("click", () => {
  booksSection.classList.remove("hidden");
  readersSection.classList.add("hidden");
  authorsSection.classList.add("hidden");
  borrowingsSection.classList.add("hidden");

  booksBtn.classList.add("active");
  readersBtn.classList.remove("active");
  authorsBtn.classList.remove("active");
  borrowingsBtn.classList.remove("active");
});

renderBooks();



// readers section

const API_URL_READERS = "https://projectcrud-viktoriia2.onrender.com/api/readers";
const API_URL_LOCAL_READERS = "http://localhost:3000/api/readers";

const readersList = document.getElementById("readers_list");
const readerModal = document.getElementById("reader_modal");
const addReaderBtn = document.getElementById("add_readers_btn");
const cancelReaderBtn = document.getElementById("cancel_reader_btn");
const readerForm = document.getElementById("reader_form");
const readersCountEl = document.getElementById("readers_count");





let editingReaderId = null;


async function renderReaders() {
  readersList.innerHTML = "";
  const token = getToken();
  if (!token) return;
  
  const res = await fetch(API_URL_READERS, {
    headers: getHeaders(token)
  });
  
  if (!res.ok) {
    if (res.status === 401) {
      logout();
      return;
    }
    throw new Error('Failed to fetch readers');
  }
  
  const readers = await res.json();

  readersCountEl.textContent = readers.length;

  readers.forEach((reader) => {

    const formattedDate = new Date(reader.date_of_birth).toLocaleDateString("en-GB");

    const div = document.createElement("div");
    div.className = "reader_card";
    div.dataset.id = reader.id;
    div.innerHTML = `
    <div class="card_header">
      <h3>${reader.name}</h3>
        <div class="actions_btn">
          <button class="edit_btn" title="Edit">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
              class="bi bi-pencil-square" viewBox="0 0 16 16">
              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 
              0 0 1 .707 0l1.293 1.293zm-1.75 
              2.456-2-2L4.939 9.21a.5.5 0 0 
              0-.121.196l-.805 2.414a.25.25 0 0 
              0 .316.316l2.414-.805a.5.5 0 0 
              0 .196-.12l6.813-6.814z"/>
              <path fill-rule="evenodd" 
              d="M1 13.5A1.5 1.5 0 0 0 2.5 
              15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 
              0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 
              0 0 1-.5-.5v-11a.5.5 0 0 
              1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 
              1.5 0 0 0 1 2.5z"/>
            </svg>
          </button>
          <button class="delete_btn" title="Delete">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
              fill="red" class="bi bi-trash" viewBox="0 0 16 16">
              <path d="M5.5 5.5A.5.5 0 0 1 6 
              6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 
              1 .5-.5m2.5 0a.5.5 0 0 1 
              .5.5v6a.5.5 0 0 1-1 
              0V6a.5.5 0 0 1 .5-.5m3 
              .5a.5.5 0 0 0-1 
              0v6a.5.5 0 0 0 1 0z"/>
              <path d="M14.5 3a1 1 0 0 
              1-1 1H13v9a2 2 0 0 1-2 
              2H5a2 2 0 0 1-2-2V4h-.5a1 
              1 0 0 1-1-1V2a1 1 0 0 
              1 1-1H6a1 1 0 0 1 1-1h2a1 
              1 0 0 1 1 1h3.5a1 1 0 0 
              1 1 1zM4.118 4 4 
              4.059V13a1 1 0 0 0 1 
              1h6a1 1 0 0 0 1-1V4.059L11.882 
              4zM2.5 3h11V2h-11z"/>
            </svg>
          </button>
        </div>
    </div>
      
      <p class="card_body">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-envelope" viewBox="0 0 16 16" style="padding-right: 7px;">
      <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z"/>
      </svg>
       ${reader.email}</p>
      <p class="card_body"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-telephone" viewBox="0 0 16 16" style="padding-right: 7px;">
      <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z"/>
      </svg> ${reader.phone}</p>
      <p class="card_body"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar" viewBox="0 0 16 16" style="padding-right: 7px;">
      <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
      </svg> ${formattedDate}</p>
    `;
    readersList.appendChild(div);
  });
}

addReaderBtn.addEventListener("click", () => {
  editingReaderId = null;
  readerForm.reset();
  readerModal.style.display = "flex";
});

cancelReaderBtn.addEventListener("click", () => {
  editingReaderId = null;
  readerModal.style.display = "none";
  readerForm.reset();
});

//add or edit readers
readerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const newReader = {
    name: document.getElementById("reader_name").value,
    email: document.getElementById("reader_email").value,
    phone: document.getElementById("reader_phone").value,
    date_of_birth: document.getElementById("reader_dob").value,
  };

  if (!newReader.name || !newReader.email || !newReader.phone) {
    alert("Please fill in all fields!");
    return;
  }

  const token = getToken();
  if (!token) return;
  
  if (editingReaderId) {
    await fetch(`${API_URL_READERS}/${editingReaderId}`, {
      method: "PUT",
      headers: getHeaders(token),
      body: JSON.stringify(newReader),
    });
  } else {
    await fetch(API_URL_READERS, {
      method: "POST",
      headers: getHeaders(token),
      body: JSON.stringify(newReader),
    });
  }

  readerModal.style.display = "none";
  readerForm.reset();
  editingReaderId = null;
  await renderReaders();
});
//edit and delete readers
readersList.addEventListener("click", async (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const card = btn.closest(".reader_card");
  const id = card.dataset.id;

  if (btn.classList.contains("delete_btn")) {
    if (!confirm("Delete this reader?")) return;
    const token = getToken();
    if (!token) return;
    await fetch(`${API_URL_READERS}/${id}`, { 
      method: "DELETE",
      headers: getHeaders(token)
    });
    await renderReaders();
    return;
  }

  if (btn.classList.contains("edit_btn")) {
    try {
      const token = getToken();
      if (!token) return;
      const res = await fetch(`${API_URL_READERS}/${id}`, {
        headers: getHeaders(token)
      });
      if (!res.ok) {
        alert("Error fetching reader data");
        return;
      }
      const reader = await res.json();

      document.getElementById("reader_name").value = reader.name || "";
      document.getElementById("reader_email").value = reader.email || "";
      document.getElementById("reader_phone").value = reader.phone || "";
      document.getElementById("reader_dob").value = reader.date_of_birth || "";
      editingReaderId = id;
      readerModal.style.display = "flex";
    } catch (error) {
      console.error("Error:", error);
      alert("Error loading reader data");
    }
  }
});

readerModal.addEventListener("click", (e) => {
  if (e.target === readerModal) {
    editingReaderId = null;
    readerModal.style.display = "none";
    readerForm.reset();
  }
});

readersBtn.addEventListener("click", () => {
  readersSection.classList.remove("hidden");
  booksSection.classList.add("hidden");
  authorsSection.classList.add("hidden");
  borrowingsSection.classList.add("hidden");

  readersBtn.classList.add("active");
  booksBtn.classList.remove("active");
  authorsBtn.classList.remove("active");
  borrowingsBtn.classList.remove("active");
});
renderReaders();

//author section 
const API_URL_AUTHORS = "https://projectcrud-viktoriia2.onrender.com/api/authors";
const API_URL_LOCAL_AUTHORS = "http://localhost:3000/api/authors";

const authorsList = document.getElementById("authors_list");
const authorModal = document.getElementById("author_modal");
const addAuthorBtn = document.getElementById("add_authors_btn");
const cancelAuthorBtn = document.getElementById("cancel_author_btn");
const authorForm = document.getElementById("author_form");
const authorsBtn = document.getElementById("button_authors");
const authorsSection = document.getElementById("authors_section");

let editingAuthorId = null;

// render authors
async function renderAuthors() {
  
    authorsList.innerHTML = "";
    const token = getToken();
    if (!token) return;
    
    const res = await fetch(API_URL_AUTHORS, {
      headers: getHeaders(token)
    });
    if (!res.ok) {
      if (res.status === 401) {
        logout();
        return;
      }
      throw new Error("Failed to fetch authors: " + res.statusText);
    }
    const authors = await res.json();

    authors.forEach((author) => {
    const div = document.createElement("div");
    div.className = "book_card"; // używamy tych samych stylów co book_card
    div.dataset.id = author.id;
    div.innerHTML = `
    <div class="card_header">
      <div>
        <h3>${author.name}</h3>
      </div>
        <div class="actions_btn">
          <button class="edit_btn" title="Edit">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
              class="bi bi-pencil-square" viewBox="0 0 16 16">
              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 
              0 0 1 .707 0l1.293 1.293zm-1.75 
              2.456-2-2L4.939 9.21a.5.5 0 0 
              0-.121.196l-.805 2.414a.25.25 0 0 
              0 .316.316l2.414-.805a.5.5 0 0 
              0 .196-.12l6.813-6.814z"/>
              <path fill-rule="evenodd" 
              d="M1 13.5A1.5 1.5 0 0 0 2.5 
              15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 
              0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 
              0 0 1-.5-.5v-11a.5.5 0 0 
              1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 
              1.5 0 0 0 1 2.5z"/>
            </svg>
          </button>
          <button class="delete_btn" title="Delete">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
              fill="red" class="bi bi-trash" viewBox="0 0 16 16">
              <path d="M5.5 5.5A.5.5 0 0 1 6 
              6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 
              1 .5-.5m2.5 0a.5.5 0 0 1 
              .5.5v6a.5.5 0 0 1-1 
              0V6a.5.5 0 0 1 .5-.5m3 
              .5a.5.5 0 0 0-1 
              0v6a.5.5 0 0 0 1 0z"/>
              <path d="M14.5 3a1 1 0 0 
              1-1 1H13v9a2 2 0 0 1-2 
              2H5a2 2 0 0 1-2-2V4h-.5a1 
              1 0 0 1-1-1V2a1 1 0 0 
              1 1-1H6a1 1 0 0 1 1-1h2a1 
              1 0 0 1 1 1h3.5a1 1 0 0 
              1 1 1zM4.118 4 4 
              4.059V13a1 1 0 0 0 1 
              1h6a1 1 0 0 0 1-1V4.059L11.882 
              4zM2.5 3h11V2h-11z"/>
            </svg>
          </button>
        </div>
        
    </div>
    <p class="card_body">
         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-globe-americas" viewBox="0 0 16 16" style="padding-right: 7px;">
        <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0M2.04 4.326c.325 1.329 2.532 2.54 3.717 3.19.48.263.793.434.743.484q-.121.12-.242.234c-.416.396-.787.749-.758 1.266.035.634.618.824 1.214 1.017.577.188 1.168.38 1.286.983.082.417-.075.988-.22 1.52-.215.782-.406 1.48.22 1.48 1.5-.5 3.798-3.186 4-5 .138-1.243-2-2-3.5-2.5-.478-.16-.755.081-.99.284-.172.15-.322.279-.51.216-.445-.148-2.5-2-1.5-2.5.78-.39.952-.171 1.227.182.078.099.163.208.273.318.609.304.662-.132.723-.633.039-.322.081-.671.277-.867.434-.434 1.265-.791 2.028-1.12.712-.306 1.365-.587 1.579-.88A7 7 0 1 1 2.04 4.327Z"/>
        </svg> ${author.country || "-"}</p>
      <p class="card_body">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar-date" viewBox="0 0 16 16" style="padding-right: 9px;">
      <path d="M6.445 11.688V6.354h-.633A13 13 0 0 0 4.5 7.16v.695c.375-.257.969-.62 1.258-.777h.012v4.61zm1.188-1.305c.047.64.594 1.406 1.703 1.406 1.258 0 2-1.066 2-2.871 0-1.934-.781-2.668-1.953-2.668-.926 0-1.797.672-1.797 1.809 0 1.16.824 1.77 1.676 1.77.746 0 1.23-.376 1.383-.79h.027c-.004 1.316-.461 2.164-1.305 2.164-.664 0-1.008-.45-1.05-.82zm2.953-2.317c0 .696-.559 1.18-1.184 1.18-.601 0-1.144-.383-1.144-1.2 0-.823.582-1.21 1.168-1.21.633 0 1.16.398 1.16 1.23"/>
      <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
      </svg>${author.birth_year || "-"}</p>
      <p class="card_body"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-richtext" viewBox="0 0 16 16" style="padding-right: 7px;">
        <path d="M7 4.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m-.861 1.542 1.33.886 1.854-1.855a.25.25 0 0 1 .289-.047l1.888.974V7.5a.5.5 0 0 1-.5.5H5a.5.5 0 0 1-.5-.5V7s1.54-1.274 1.639-1.208M5 9a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1z"/>
         <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1"/>
          </svg> ${author.bio || "-"}</p>
    `;
    authorsList.appendChild(div);
    });

}

// open modal
addAuthorBtn.addEventListener("click", () => {
  editingAuthorId = null;
  authorForm.reset();
  authorModal.style.display = "flex";
});

// close modal
cancelAuthorBtn.addEventListener("click", () => {
  editingAuthorId = null;
  authorModal.style.display = "none";
  authorForm.reset();
});

// add or edit authors
authorForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Debug: Check if form elements exist
  const authorNameEl = document.getElementById("author_name");
  const authorCountryEl = document.getElementById("author_country");
  const authorBirthYearEl = document.getElementById("author_birth_year");
  const authorBioEl = document.getElementById("author_bio");
  
 

  if (!authorNameEl || !authorCountryEl || !authorBirthYearEl || !authorBioEl) {
    alert("ERROR: Form fields not found! Check browser console for details.");
    return;
  }

  const authorData = {
    name: authorNameEl.value,
    country: authorCountryEl.value,
    birth_year: authorBirthYearEl.value,
    bio: authorBioEl.value,
  };

  if (!authorData.name) {
    alert("Please fill in the name.");
    return;
  }

  try {
    const token = getToken();
    if (!token) return;
    
    if (editingAuthorId) {
      const res = await fetch(`${API_URL_AUTHORS}/${editingAuthorId}`, {
        method: "PUT",
        headers: getHeaders(token),
        body: JSON.stringify(authorData),
      });
      if (!res.ok) {
        const error = await res.text();
        alert("Error updating author: " + error);
        return;
      }
    } else {
      const res = await fetch(API_URL_AUTHORS, {
        method: "POST",
        headers: getHeaders(token),
        body: JSON.stringify(authorData),
      });
      if (!res.ok) {
        const error = await res.text();
        alert("Error creating author: " + error);
        return;
      }
    }

    authorModal.style.display = "none";
    authorForm.reset();
    editingAuthorId = null;
    await renderAuthors();
  } catch (error) {
    alert("Error: " + error.message);
  }
});

// edit and delete authors
authorsList.addEventListener("click", async (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const card = btn.closest(".book_card");
  const id = card.dataset.id;

  if (btn.classList.contains("delete_btn")) {
    if (!confirm("Delete this author?")) return;
    const token = getToken();
    if (!token) return;
    await fetch(`${API_URL_AUTHORS}/${id}`, { 
      method: "DELETE",
      headers: getHeaders(token)
    });
    await renderAuthors();
  }

  if (btn.classList.contains("edit_btn")) {
    const token = getToken();
    if (!token) return;
    const res = await fetch(`${API_URL_AUTHORS}/${id}`, {
      headers: getHeaders(token)
    });
    const author = await res.json();

    document.getElementById("author_name").value = author.name;
    document.getElementById("author_country").value = author.country || "";
    document.getElementById("author_birth_year").value = author.birth_year || "";
    document.getElementById("author_bio").value = author.bio || "";
    editingAuthorId = id;
    authorModal.style.display = "flex";
  }
});

// close modal when clicking outside
authorModal.addEventListener("click", (e) => {
  if (e.target === authorModal) {
    editingAuthorId = null;
    authorModal.style.display = "none";
    authorForm.reset();
  }
});

// switch sections
authorsBtn.addEventListener("click", () => {
  authorsSection.classList.remove("hidden");
  readersSection.classList.add("hidden");
  booksSection.classList.add("hidden");
  borrowingsSection.classList.add("hidden");

  authorsBtn.classList.add("active");
  readersBtn.classList.remove("active");
  booksBtn.classList.remove("active");
  borrowingsBtn.classList.remove("active");
});
renderAuthors();

//borrowings section
const API_URL_BORROWINGS = "https://projectcrud-viktoriia2.onrender.com/api/borrowings";
const API_URL_LOCAL_BORROWINGS = "http://localhost:3000/api/borrowings";



const borrowingsList = document.getElementById("borrowings_list");
const borrowingModal = document.getElementById("borrowing_modal");
const addBorrowingBtn = document.getElementById("add_borrowings_btn");
const cancelBorrowingBtn = document.getElementById("cancel_borrowing_btn");
const borrowingForm = document.getElementById("borrowing_form");
const borrowingReaderSelect = document.getElementById("borrowing_reader");
const borrowingBookSelect = document.getElementById("borrowing_book");

let editingBorrowingId = null;

// populate readers and books select options
async function populateSelects() {
  const token = getToken();
  if (!token) return;
  
  const readersRes = await fetch(API_URL_READERS, {
    headers: getHeaders(token)
  });
  const readers = await readersRes.json();
  borrowingReaderSelect.innerHTML = `<option value="">Select reader</option>`;
  readers.forEach(r => {
    const option = document.createElement("option");
    option.value = r.id;
    option.textContent = r.name;
    borrowingReaderSelect.appendChild(option);
  });

  const booksRes = await fetch(API_URL_BOOKS, {
    headers: getHeaders(token)
  });
  const books = await booksRes.json();
  borrowingBookSelect.innerHTML = `<option value="">Select book</option>`;
  books.forEach(b => {
    const option = document.createElement("option");
    option.value = b.id;
    option.textContent = b.title;
    borrowingBookSelect.appendChild(option);
  });
}

// render borrowings
async function renderBorrowings() {
  try {
    borrowingsList.innerHTML = "";
    await populateSelects();

    const token = getToken();
    if (!token) return;
    
    const res = await fetch(API_URL_BORROWINGS, {
      headers: getHeaders(token)
    });
    if (!res.ok) {
      if (res.status === 401) {
        logout();
        return;
      }
      throw new Error("Failed to fetch borrowings: " + res.statusText);
    }
    const borrowings = await res.json();

    borrowings.forEach(b => {
    const div = document.createElement("div");
    div.className = "book_card";
    div.dataset.id = b.id;
    const borrowDateFormatted = b.borrow_date ? new Date(b.borrow_date).toLocaleDateString("en-GB") : "-";
    const returnDateFormatted = b.return_date ? new Date(b.return_date).toLocaleDateString("en-GB") : "-";

    div.innerHTML = `
      <div class="card_header">
        <div>
          <h3>${b.reader_name}</h3>
          <p class="card_body"><svg xmlns="http://www.w3.org/2000/svg" width="14"  fill="currentColor" class="bi bi-book" viewBox="0 0 16 16"  style="padding-right: 3px;">
          <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783"/>
          </svg> ${b.book_title}</p>
        </div>
        <div class="actions_btn">
          <button class="edit_btn" title="Edit">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
              class="bi bi-pencil-square" viewBox="0 0 16 16">
              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 
              0 0 1 .707 0l1.293 1.293zm-1.75 
              2.456-2-2L4.939 9.21a.5.5 0 0 
              0-.121.196l-.805 2.414a.25.25 0 0 
              0 .316.316l2.414-.805a.5.5 0 0 
              0 .196-.12l6.813-6.814z"/>
              <path fill-rule="evenodd" 
              d="M1 13.5A1.5 1.5 0 0 0 2.5 
              15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 
              0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 
              0 0 1-.5-.5v-11a.5.5 0 0 
              1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 
              1.5 0 0 0 1 2.5z"/>
            </svg>
          </button>
          <button class="delete_btn" title="Delete">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
              fill="red" class="bi bi-trash" viewBox="0 0 16 16">
              <path d="M5.5 5.5A.5.5 0 0 1 6 
              6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 
              1 .5-.5m2.5 0a.5.5 0 0 1 
              .5.5v6a.5.5 0 0 1-1 
              0V6a.5.5 0 0 1 .5-.5m3 
              .5a.5.5 0 0 0-1 
              0v6a.5.5 0 0 0 1 0z"/>
              <path d="M14.5 3a1 1 0 0 
              1-1 1H13v9a2 2 0 0 1-2 
              2H5a2 2 0 0 1-2-2V4h-.5a1 
              1 0 0 1-1-1V2a1 1 0 0 
              1 1-1H6a1 1 0 0 1 1-1h2a1 
              1 0 0 1 1 1h3.5a1 1 0 0 
              1 1 1zM4.118 4 4 
              4.059V13a1 1 0 0 0 1 
              1h6a1 1 0 0 0 1-1V4.059L11.882 
              4zM2.5 3h11V2h-11z"/>
            </svg>
          </button>
        </div>
      </div>
      <p class="card_body">Borrow Date: ${borrowDateFormatted}</p>
      <p class="card_body">Return Date: ${returnDateFormatted}</p>
    `;
    borrowingsList.appendChild(div);
    });
  } catch (error) {
    console.error("Error rendering borrowings:", error);
    
  }
}

// open modal
addBorrowingBtn.addEventListener("click", async () => {
  editingBorrowingId = null;
  borrowingForm.reset();
  await populateSelects();
  borrowingModal.style.display = "flex";
});

// close modal
cancelBorrowingBtn.addEventListener("click", () => {
  editingBorrowingId = null;
  borrowingModal.style.display = "none";
  borrowingForm.reset();
});

// add or edit borrowings
borrowingForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const borrowingData = {
    reader_id: borrowingReaderSelect.value,
    book_id: borrowingBookSelect.value,
    borrow_date: document.getElementById("borrow_date").value,
    return_date: document.getElementById("return_date").value
  };

  if (!borrowingData.reader_id || !borrowingData.book_id || !borrowingData.borrow_date) {
    alert("Please fill in all required fields.");
    return;
  }

  try {
    const token = getToken();
    if (!token) return;
    
    if (editingBorrowingId) {
      const res = await fetch(`${API_URL_BORROWINGS}/${editingBorrowingId}`, {
        method: "PUT",
        headers: getHeaders(token),
        body: JSON.stringify(borrowingData)
      });
      if (!res.ok) {
        const error = await res.text();
        alert("Error updating borrowing: " + error);
        return;
      }
    } else {
      const res = await fetch(API_URL_BORROWINGS, {
        method: "POST",
        headers: getHeaders(token),
        body: JSON.stringify(borrowingData)
      });
      if (!res.ok) {
        const error = await res.text();
        alert("Error creating borrowing: " + error);
        return;
      }
    }

    borrowingModal.style.display = "none";
    borrowingForm.reset();
    editingBorrowingId = null;
    await renderBorrowings();
  } catch (error) {
    alert("Error: " + error.message);
  }
});

// edit and delete borrowings
borrowingsList.addEventListener("click", async (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const card = btn.closest(".book_card");
  const id = card.dataset.id;

  if (btn.classList.contains("delete_btn")) {
    if (!confirm("Delete this borrowing?")) return;
    const token = getToken();
    if (!token) return;
    await fetch(`${API_URL_BORROWINGS}/${id}`, { 
      method: "DELETE",
      headers: getHeaders(token)
    });
    await renderBorrowings();
  }

  if (btn.classList.contains("edit_btn")) {
    const token = getToken();
    if (!token) return;
    const res = await fetch(`${API_URL_BORROWINGS}/${id}`, {
      headers: getHeaders(token)
    });
    const borrowing = await res.json();

    borrowingReaderSelect.value = borrowing.reader_id;
    borrowingBookSelect.value = borrowing.book_id;
    document.getElementById("borrow_date").value = borrowing.borrow_date;
    document.getElementById("return_date").value = borrowing.return_date || "";
    editingBorrowingId = id;
    borrowingModal.style.display = "flex";
  }
});

// close modal when clicking outside
borrowingModal.addEventListener("click", (e) => {
  if (e.target === borrowingModal) {
    editingBorrowingId = null;
    borrowingModal.style.display = "none";
    borrowingForm.reset();
  }
});

borrowingsBtn.addEventListener("click", () => {
  borrowingsSection.classList.remove("hidden");
  readersSection.classList.add("hidden");
  booksSection.classList.add("hidden");
  authorsSection.classList.add("hidden");

  borrowingsBtn.classList.add("active");
  readersBtn.classList.remove("active");
  booksBtn.classList.remove("active");
  authorsBtn.classList.remove("active");
});
// initial render
renderBorrowings();

const token = localStorage.getItem('token');
const API_ME = 'https://projectcrud-viktoriia2.onrender.com/api/users/me';
const API_LOCAL_ME="http://localhost:3000/api/users/me"

if(!token){
  window.location.href = '/public_page/public_page.html';
}else{
  fetch(`${API_ME}`, {
    headers:{
      'Authorization':`Bearer ${token}`
    }
  })

  .then(res =>{
    if(!res.ok) throw new Error('Unauthorized');
    return res.json()
  } )
  .then(user => {
    console.log("Logged in user:", user);
  })

  .catch(() => {
    localStorage.removeItem('token');
    window.location.href = '/public_page/public_page.html';
  })
}