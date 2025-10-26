Opis zmian

Ta gałąź dodaje pełny system autoryzacji użytkowników (register / login) z JWT oraz integrację z frontendem (modale logowania i rejestracji).
Zaimplementowano również podstawową obsługę ról użytkowników. 



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


