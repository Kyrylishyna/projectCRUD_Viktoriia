# Development Setup Guide

This guide explains how to set up the Books & Readers project locally for development.

## 📋 Prerequisites

- **Node.js** (v14+) - [Download here](https://nodejs.org/)
- **MySQL** (v5.7+) - [Download here](https://dev.mysql.com/downloads/mysql/)
- **Git** - [Download here](https://git-scm.com/)
- **Code Editor** - VS Code or similar

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd projectCRUD_Viktoriia
```

### 2. Setup Backend

#### Step 1: Install Dependencies
```powershell
cd backend
npm install
```

#### Step 2: Create Environment File
Copy `.env.example` to `.env`:
```powershell
Copy-Item ".env.example" ".env"
```

#### Step 3: Configure Database Connection
Edit `.env` file with your local MySQL credentials:

```env
DATABASE_URL=mysql://root:your_password@localhost:3306/books_readers
PORT=3000
JWT_SECRET=your_super_secret_key_here_change_in_production
```

> Replace `your_password` with your MySQL root password

#### Step 4: Create Database
Open MySQL and run:
```sql
CREATE DATABASE books_readers;
```

Then import the schema:
```powershell
mysql -u root -p books_readers < migration.sql
```

#### Step 5: Start Backend Server
```powershell
npm run dev
```

✅ Backend will run on: **http://localhost:3000**

---

### 3. Setup Frontend

#### Step 1: Update API URLs
Edit these files to use localhost instead of production URL:

**File: `frontend/main-page-script.js`**
```javascript
// Change from:
const API_URL_BOOKS = "https://projectcrud-viktoriia2.onrender.com/api/books";

// To:
const API_URL_BOOKS = "http://localhost:3000/api/books";
```

Do the same for all API constants:
- `API_URL_READERS`
- `API_URL_AUTHORS`
- `API_URL_BORROWINGS`

**File: `frontend/public_page/public_page_script.js`**
```javascript
// Change the fetch URLs from Render to localhost:
// "https://projectcrud-viktoriia2.onrender.com/api/users/register" → "http://localhost:3000/api/users/register"
// "https://projectcrud-viktoriia2.onrender.com/api/users/login" → "http://localhost:3000/api/users/login"
```

#### Step 2: Start Frontend Server

**Option A: Using Python (built-in)**
```powershell
cd frontend
python -m http.server 8000
```

**Option B: Using Node.js http-server**
```powershell
npm install -g http-server
cd frontend
http-server
```

✅ Frontend will run on: **http://localhost:8000**

---

## 🧪 Testing

### Run Backend Tests
```powershell
cd backend
npm test
```

### Manual Testing Workflow
1. Open browser: http://localhost:8000
2. Click "Sign Up" or "Get Started"
3. Create new account with email and password
4. Login with credentials
5. Test CRUD operations (add/edit/delete books, readers, authors, borrowings)
6. Click "Logout" button to return to public page

---

## 📁 Project Structure

```
projectCRUD_Viktoriia/
├── backend/                    # Node.js/Express API
│   ├── routes/                # API endpoints
│   │   ├── books.js          # Book CRUD operations
│   │   ├── readers.js        # Reader CRUD operations
│   │   ├── authors.js        # Author CRUD operations
│   │   ├── borrowings.js     # Borrowing CRUD operations
│   │   └── users.js          # Authentication (login/register)
│   ├── middleware/            # Custom middleware
│   │   └── auth.js           # JWT authentication
│   ├── db.js                 # Database connection
│   ├── server.js             # Express app setup
│   ├── migration.sql         # Database schema
│   ├── .env.example          # Environment variables template
│   └── package.json          # Dependencies
│
├── frontend/                  # HTML/CSS/JavaScript UI
│   ├── main-page.html        # Main dashboard (protected)
│   ├── main-page-script.js   # Dashboard logic (books, readers, etc.)
│   ├── main-page-style.css   # Dashboard styles
│   ├── public_page/          # Public pages
│   │   ├── public_page.html  # Login/Register page
│   │   ├── public_page_script.js  # Auth logic
│   │   └── public_page_style.css
│   └── _redirects            # Netlify redirect rules
│
└── README.md                 # Project documentation
```

---

## 🔐 Authentication Flow

1. **Public Page**: User registers or logs in (no token required)
2. **Backend**: 
   - Registration: Hash password with bcrypt, create user
   - Login: Verify password, generate JWT token
3. **Frontend**: Store JWT token in localStorage
4. **Protected Pages**: Token sent in every API request header
5. **Logout**: Remove token, redirect to public page

---

## 🛠️ Useful Commands

### Backend
```powershell
npm run dev       # Start with hot reload (nodemon)
npm start         # Start normally
npm test          # Run tests
```

### Frontend
```powershell
python -m http.server 8000    # Start Python server
http-server                    # Start Node.js server
```

---

## 🐛 Common Issues

### Issue: "Connection refused" on MySQL
**Solution:** Make sure MySQL is running
```powershell
# Windows
net start MySQL80

# Or use MySQL Workbench to start MySQL
```

### Issue: "Cannot find module" errors
**Solution:** Install dependencies
```powershell
cd backend
npm install
```

### Issue: API returns 401 Unauthorized
**Solution:** 
- Token expired or missing in localStorage
- Check DevTools → Application → Local Storage → `token`
- Login again to get a fresh token

### Issue: CORS errors in browser console
**Solution:** Make sure backend is running on port 3000 and frontend is on port 8000

---

## 🚢 Deploying to Production

### Backend Deployment (Render)
1. Push code to GitHub
2. Connect repository to Render
3. Set environment variables in Render dashboard
4. Deploy

### Frontend Deployment (Netlify)
1. Push code to GitHub
2. Connect repository to Netlify
3. Set build command: (leave empty for static files)
4. Set publish directory: `frontend`
5. Update API URLs to production backend
6. Deploy

See **README.md** for detailed deployment instructions.

---

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [JWT (jsonwebtoken) Documentation](https://www.npmjs.com/package/jsonwebtoken)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [CORS Documentation](https://www.npmjs.com/package/cors)

---

## ❓ Need Help?

- Check the **README.md** for general project info
- Review the existing code in `routes/` and `frontend/` for examples
- Check browser DevTools (F12) for API errors
- Check terminal logs for backend errors

Happy coding! 🎉