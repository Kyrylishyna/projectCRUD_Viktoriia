README.md — Project CRUD (Books & Readers Management)

About the Project

Project CRUD is a full-stack web application built to manage books, readers, authors, and borrowings in a small library system.
The application allows users to:

1. Add, edit, view, and delete books

2. Manage readers and authors

3. Track book borrowings

4. Connect to a live MySQL database online

This project was created as part of a university web development course and deployed using Render, Netlify, and Railway.

-Live Demo
~Frontend (User Interface)
Netlify link: [Netlify link to my frontend](https://myfirstrealwebsite.netlify.app/)s
Hosted on Netlify — this is the main website users interact with.

~ Backend (API Server)
Render link:[Render link to my project](https://dashboard.render.com/web/srv-d3p18cemcj7s739mer1g)
Hosted on Render — provides REST API endpoints for books, readers, authors, and borrowings.

~ Database (MySQL)
Railway link: [Railway Database Console](https://railway.com/project/65af13eb-59e5-4bd5-a6d1-32474704b881?environmentId=0c00da44-826d-4336-8aa1-bf7733df1b00)
The project uses a live MySQL database hosted on Railway.

-Tech Stack

Frontend:
HTML, CSS, JavaScript (Vanilla)
Hosted on Netlify

Backend:
Node.js + Express.js
MySQL (connected via mysql2 package)
Hosted on Render

Database:
MySQL on Railway


Opis zmian

Ta gałąź dodaje pełny system autoryzacji użytkowników (register / login) z JWT oraz integrację z frontendem (modale logowania i rejestracji).



Jak uruchomić lokalnie: 
Backend
1: Install Dependencies
```powershell
cd backend
npm install
```
2: Create Environment File
Copy `.env.example` to `.env`:
```powershell
Copy-Item ".env.example" ".env"
```
3: Configure Database Connection
Edit `.env` file with your local MySQL credentials:
```env
DATABASE_URL=mysql://root:DSlZkNXyomXbbXvvEsasPcZGaJkIepxO@ballast.proxy.rlwy.net:54442/railway
PORT=3000
JWT_SECRET=your_super_secret_key_here_change_in_production
```
4: Start Backend Server
```powershell
npm run dev
```
Backend will run on: **http://localhost:3000**

---

Frontend
1: Update API URLs
Utworzyłam linki dla lokalnego uruchomiemia i dla urochomienia online, trzeba po prostu ich zmeniać, wyjątkiem jest /home trzeba zamienić https://projectcrud-viktoriia2.onrender.com/home na http://localhost:3000/home
2: Uruchom server
- Using Node.js http-server**
```powershell
npm install -g http-server
cd frontend
http-server
```
 Frontend will run on: **http://localhost:8000**


Żeby urochomić lokalnie postępuj tak: 
1: Zmień API URLs
Utworzyłam linki dla lokalnego uruchomiemia i dla urochomienia online, trzeba po prostu ich zmeniać, wyjątkiem jest /home trzeba zamienić http://localhost:3000/home na https://projectcrud-viktoriia2.onrender.com/home

i wejsc na strone Netlify uruchomić [link](https://myfirstrealwebsite.netlify.app/) 


