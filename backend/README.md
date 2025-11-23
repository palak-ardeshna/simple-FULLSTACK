# 🚀 Backend API - સરળ ગાઈડ

> એક JWT Authentication સાથેની REST API Backend

---

## 📖 આ શું છે?

આ એક **Backend Server** છે જે:
- ✅ User Registration કરે છે
- ✅ User Login કરે છે (Token આપે છે)
- ✅ User Profile Manage કરે છે
- ✅ Database માં data save કરે છે

**Simple Words માં:** એક એવી system જે users ને account બનાવવા, login થવા અને તેમની info manage કરવા દે છે.

---

## 🎨 Visual Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT (Browser)                        │
│                   (User Types Email/Password)                │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND SERVER                            │
│                                                              │
│   ┌──────────┐   ┌──────────┐   ┌──────────┐              │
│   │  Routes  │──▶│Controllers│──▶│  Models  │              │
│   │ (URLs)   │   │ (Logic)   │   │(Database)│              │
│   └──────────┘   └──────────┘   └──────────┘              │
│                                                              │
│   /api/auth/register → Register User                        │
│   /api/auth/login    → Login User                           │
│   /api/user/profile  → Get User Info                        │
│                                                              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  DATABASE (MySQL)                            │
│                                                              │
│   ┌─────────────────────────────────────┐                  │
│   │  users Table                         │                  │
│   ├──────────┬────────────┬──────────────┤                  │
│   │ id       │ name       │ email        │                  │
│   │ password │ last_login │ created_at   │                  │
│   └──────────┴────────────┴──────────────┘                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure (સરળ રીતે)

```
backend/
│
├── src/
│   │
│   ├── config/
│   │   └── database.js          ← Database connection
│   │
│   ├── models/
│   │   └── user.model.js        ← User table structure (fields)
│   │
│   ├── controllers/
│   │   ├── auth.controller.js   ← Register/Login logic
│   │   └── user.controller.js   ← User CRUD logic
│   │
│   ├── routes/
│   │   ├── auth.routes.js       ← /api/auth/* URLs
│   │   ├── user.routes.js       ← /api/user/* URLs
│   │   └── index.js             ← All routes export
│   │
│   ├── middlewares/
│   │   └── auth.middleware.js   ← Token check કરે છે
│   │
│   └── server.js                ← Main entry point
│
├── .env                         ← Secret keys (GitHub પર નહીં)
├── package.json                 ← Dependencies list
└── README.md                    ← આ file
```

### દરેક Folder નું કામ:

| Folder | શું કરે છે? |
|--------|-------------|
| **config/** | Database સાથે connect થાય છે |
| **models/** | Database tables નું structure (fields define કરે) |
| **controllers/** | Business logic (શું કરવું છે) |
| **routes/** | URLs define કરે (કયા URL પર શું થાય) |
| **middlewares/** | Security check (Token valid છે કે નહીં) |

---

## ⚡ Quick Start (તરત શરૂ કરો)

### 1️⃣ Install કરો

```bash
npm install
```

### 2️⃣ Database Setup

1. XAMPP start કરો → MySQL start કરો
2. phpMyAdmin ખોલો: `http://localhost/phpmyadmin`
3. Database બનાવો: `backendnormal`

### 3️⃣ Environment Variables

`.env` file બનાવો:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=backendnormal
JWT_SECRET=my_secret_key_12345
JWT_EXPIRE=7d
```

### 4️⃣ Server Start કરો

```bash
npm run dev
```

**Output:**
```
✅ Sequelize: Database Connected Successfully!
📦 Database: backendnormal
✅ Sequelize: Models synced with database

🚀 Server is running on port 5000
📍 URL: http://localhost:5000
```

---

## 🔄 How It Works? (કેવી રીતે કામ કરે છે?)

### Example: User Login

```
1. User enters email & password
         ↓
2. Frontend sends POST request to /api/auth/login
         ↓
3. Server receives request
         ↓
4. auth.controller.js runs
         ↓
5. Find user in database by email
         ↓
6. Compare password (bcrypt)
         ↓
7. Password correct? → Generate JWT Token
         ↓
8. Send token to user
         ↓
9. User saves token in localStorage
         ↓
10. Use token for future requests
```

---

## 🌐 API Endpoints (સરળ રીતે)

### 🔓 Public (કોઈ પણ access કરી શકે)

```http
POST /api/auth/register  → નવો user બનાવો
POST /api/auth/login     → Login થાવ
```

### 🔒 Protected (Token જરૂરી)

```http
GET    /api/user/profile → મારી profile જુઓ
GET    /api/user/all     → બધા users જુઓ
GET    /api/user/:id     → Specific user જુઓ
PUT    /api/user/update  → Profile update કરો
DELETE /api/user/delete  → Account delete કરો
```

---

## 📝 Example Usage

### Register

```bash
POST http://localhost:5000/api/auth/register

Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}

Response:
{
  "success": true,
  "message": "User registered successfully!",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login

```bash
POST http://localhost:5000/api/auth/login

Body:
{
  "email": "john@example.com",
  "password": "123456"
}

Response:
{
  "success": true,
  "message": "Login successful!",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Get Profile (Token Required)

```bash
GET http://localhost:5000/api/user/profile

Headers:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Response:
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

## 🔐 Authentication (સુરક્ષા)

### JWT Token શું છે?

એક **Security Code** જે login પછી user ને મળે છે.

```
Login → Server gives Token → User saves Token → Use in every request
```

**Token Example:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJqb2huQGV4YW1wbGUuY29tIn0.signature
```

**Token માં શું હોય છે?**
- User ID
- User Email
- Expiry Time (7 days)

---

## 🛠️ Technologies Used

| Technology | શું માટે? |
|------------|-----------|
| Node.js | Server-side JavaScript |
| Express.js | Web framework (routes બનાવવા) |
| MySQL | Database (data store કરવા) |
| Sequelize | Database queries સરળ બનાવે |
| JWT | Authentication (security) |
| bcrypt | Password encryption |

---

## 🐛 Common Issues & Solutions

### ❌ Server start નથી થતું?

✅ Check કરો:
- XAMPP MySQL running છે?
- Port 5000 free છે?
- `npm install` કર્યું છે?

### ❌ Database connection error?

✅ Check કરો:
- Database `backendnormal` exist કરે છે phpMyAdmin માં?
- `.env` file માં DB_NAME correct છે?
- MySQL running છે XAMPP માં?

### ❌ Token invalid error?

✅ Check કરો:
- Token 7 days પછી expire થઈ ગયો હોય?
- Header format: `Authorization: Bearer <token>`
- Token complete છે? (break નથી થયો?)

---

## 📚 Learn More

### Key Concepts:

**1. REST API** - Server અને Client વચ્ચે communication  
**2. JWT** - Token based authentication  
**3. Sequelize ORM** - Database queries JavaScript માં  
**4. Middleware** - Request-Response વચ્ચે run થતા functions  
**5. bcrypt** - Password security (hashing)

---

## 🎯 Next Steps

આ backend સાથે તમે:
- ✅ Frontend connect કરી શકો (React, Vue, etc.)
- ✅ More features add કરી શકો (forgot password, email verification)
- ✅ Admin panel બનાવી શકો
- ✅ File upload add કરી શકો

---

## 💡 Tips

1. **Development:** `npm run dev` (auto-restart)
2. **Production:** `npm start`
3. **Token:** localStorage માં save કરો
4. **Security:** JWT_SECRET production માં strong રાખજો
5. **Testing:** Postman use કરો API test કરવા માટે

---

## 📞 Support

Issues હોય તો GitHub પર issue create કરો અથવા email કરો.

---

**Made with ❤️ | Happy Coding! 🚀**