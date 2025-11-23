# Frontend - React + Vite Application

એક modern full-stack application નો frontend part જે React અને Vite થી બનાવેલ છે.

## 🚀 Features

- ✅ **User Registration** - નવા users register કરી શકે છે
- ✅ **User Login** - Existing users login કરી શકે છે
- ✅ **Dashboard** - Protected dashboard with user information
- ✅ **Responsive Design** - Mobile-friendly interface
- ✅ **Modern UI** - Beautiful gradient designs અને animations
- ✅ **JWT Authentication** - Secure token-based authentication
- ✅ **React Router** - Client-side routing

## 📋 Prerequisites

તમારા system પર આ installed હોવું જોઈએ:

- Node.js (v14 અથવા વધુ)
- npm અથવા yarn

## 🛠️ Installation

1. **Dependencies Install કરો:**

```bash
npm install
```

## 🎯 Available Scripts

### `npm run dev`

Development server start કરે છે.
Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

### `npm run build`

Production માટે app build કરે છે `dist` folder માં.

### `npm run preview`

Built app ને locally preview કરો.

### `npm run lint`

ESLint run કરે છે code quality check કરવા માટે.

## 📁 Project Structure

```
frontend/
├── public/              # Static files
├── src/
│   ├── pages/          # Page components
│   │   ├── Home.jsx    # Landing page
│   │   ├── Register.jsx # Registration page
│   │   ├── Login.jsx   # Login page
│   │   └── Dashboard.jsx # Dashboard page
│   ├── components/     # Reusable components
│   ├── styles/         # CSS files
│   │   ├── Auth.css    # Login/Register styles
│   │   ├── Dashboard.css # Dashboard styles
│   │   └── Home.css    # Home page styles
│   ├── App.jsx         # Main App component with routes
│   ├── App.css         # Global App styles
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── index.html          # HTML template
├── package.json        # Dependencies
├── vite.config.js      # Vite configuration
└── eslint.config.js    # ESLint configuration
```

## 🔗 Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Home | Landing page with features |
| `/register` | Register | User registration |
| `/login` | Login | User login |
| `/dashboard` | Dashboard | Protected user dashboard |

## 🌐 API Endpoints

Frontend આ backend endpoints ને call કરે છે:

### Authentication

```
POST /api/auth/register
Body: { name, email, password }
Response: { token, user }
```

```
POST /api/auth/login
Body: { email, password }
Response: { token, user }
```

```
GET /api/auth/me
Headers: { Authorization: Bearer <token> }
Response: { user }
```

## 🎨 Technologies Used

- **React** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **CSS3** - Styling with modern features
- **LocalStorage** - Token storage
- **Fetch API** - HTTP requests

## 💾 Local Storage

Application આ data localStorage માં store કરે છે:

- `token` - JWT authentication token

## 🔐 Authentication Flow

1. User register/login કરે છે
2. Server JWT token આપે છે
3. Token localStorage માં save થાય છે
4. Protected routes માં token automatically send થાય છે
5. Logout પર token remove થાય છે

## 🎨 Color Scheme

Primary gradient:
- `#667eea` to `#764ba2`

Secondary gradient:
- `#ffd89b` to `#19547b`

## 🚀 Getting Started

1. Backend server start કરો (port 5000 પર)
2. Frontend dev server start કરો:

```bash
npm run dev
```

3. Browser માં [http://localhost:5173](http://localhost:5173) ખોલો
4. Home page પર "Get Started" click કરો
5. Register કરો અને login કરો

## 📝 Notes

- Backend API URL: `http://localhost:5000/api`
- Make sure backend server is running
- Token expiration handled automatically
- Responsive design for all screen sizes

## 🐛 Common Issues

### CORS Error

Backend માં CORS enable કરો:

```javascript
app.use(cors());
```

### API Connection Error

Backend server running છે કે નહીં check કરો:

```bash
# Backend port check
curl http://localhost:5000/api/auth/login
```

### Build Error

Node modules clean કરો અને ફરીથી install કરો:

```bash
rm -rf node_modules
npm install
```

## 📄 License

MIT License

## 👨‍💻 Development

આ application Vite + React થી બનાવેલ છે modern web development practices સાથે.

Happy Coding! 🎉