# Authentication Flow - Login/Register પછી Dashboard Redirect

આ document authentication flow અને redirect logic સમજાવે છે.

## 🔐 Authentication Flow Overview

```
User → Register/Login → Success → Dashboard
                      ↓
                    Error → Show Error Message
```

---

## 1️⃣ Register Flow (નવા User Registration)

### Step 1: User Form Fill કરે છે
```javascript
// Register.jsx
const [formData, setFormData] = useState({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});
```

### Step 2: Form Submit થાય છે
```javascript
const handleSubmit = (e) => {
  e.preventDefault();
  
  // Validation
  if (password !== confirmPassword) {
    setValidationError("Passwords do not match");
    return;
  }
  
  // Redux action dispatch
  dispatch(register({
    name: formData.name,
    email: formData.email,
    password: formData.password
  }));
};
```

### Step 3: Redux Action Call થાય છે
```javascript
// authSlice.js
export const register = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    const response = await authService.register(userData);
    return response; // { token, user }
  }
);
```

### Step 4: API Call થાય છે
```javascript
// authService.js
async register(userData) {
  const response = await apiService.post('/auth/register', userData);
  
  // Token automatically saved
  if (response.token) {
    localStorage.setItem('token', response.token);
  }
  
  return response;
}
```

### Step 5: Success પર Dashboard Redirect
```javascript
// Register.jsx
useEffect(() => {
  // Success થયું અને user data મળ્યો
  if (isSuccess && user) {
    navigate("/dashboard"); // ✅ Dashboard પર redirect
  }
}, [isSuccess, user, navigate]);
```

---

## 2️⃣ Login Flow (User Login)

### Step 1: User Credentials Enter કરે છે
```javascript
// Login.jsx
const [formData, setFormData] = useState({
  email: "",
  password: "",
});
```

### Step 2: Form Submit થાય છે
```javascript
const handleSubmit = (e) => {
  e.preventDefault();
  
  // Redux action dispatch
  dispatch(login({
    email: formData.email,
    password: formData.password
  }));
};
```

### Step 3: Redux Action Call થાય છે
```javascript
// authSlice.js
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, thunkAPI) => {
    const response = await authService.login(credentials);
    return response; // { token, user }
  }
);
```

### Step 4: API Call થાય છે
```javascript
// authService.js
async login(credentials) {
  const response = await apiService.post('/auth/login', credentials);
  
  // Token automatically saved
  if (response.token) {
    localStorage.setItem('token', response.token);
  }
  
  return response;
}
```

### Step 5: Success પર Dashboard Redirect
```javascript
// Login.jsx
useEffect(() => {
  // Success થયું અને user data મળ્યો
  if (isSuccess && user) {
    navigate("/dashboard"); // ✅ Dashboard પર redirect
  }
}, [isSuccess, user, navigate]);
```

---

## 3️⃣ Already Logged In Logic

જો user પહેલેથી logged in છે તો Login/Register page પર જવા દેતા નથી:

```javascript
// Register.jsx & Login.jsx
useEffect(() => {
  // Already authenticated
  if (isAuthenticated && user) {
    navigate("/dashboard"); // Directly redirect to dashboard
    return;
  }
}, [isAuthenticated, user, navigate]);
```

### કેમ જરૂરી છે?
- Logged in user ને Login page બતાવવાનો કોઈ અર્થ નથી
- Better user experience
- Security enhancement

---

## 4️⃣ Protected Routes (Dashboard Protection)

Dashboard ફક્ત logged in users માટે જ:

```javascript
// App.jsx
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

### ProtectedRoute Component:
```javascript
// ProtectedRoute.jsx
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user, isLoading } = useSelector(
    (state) => state.auth
  );

  // Loading દરમ્યાન
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />; // ❌ Login page પર redirect
  }

  // Authenticated
  return children; // ✅ Dashboard બતાવો
};
```

---

## 5️⃣ Logout Flow

```javascript
// Dashboard.jsx
const handleLogout = () => {
  dispatch(logout()); // Redux action
  navigate("/login"); // Login page પર redirect
};
```

### Logout Action:
```javascript
// authSlice.js
export const logout = createAsyncThunk('auth/logout', async () => {
  await authService.logout();
  return null;
});

// authService.js
logout() {
  localStorage.removeItem('token'); // Token delete
  return Promise.resolve();
}
```

---

## 6️⃣ Token Management

### Token Save થાય છે:
```javascript
// Register/Login success પર
localStorage.setItem('token', data.token);
```

### Token Use થાય છે:
```javascript
// api.js - દરેક API call સાથે automatic
getHeaders() {
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}
```

### Token Remove થાય છે:
```javascript
// Logout પર
localStorage.removeItem('token');

// 401 Error પર
if (response.status === 401) {
  localStorage.removeItem('token');
  window.location.href = '/login';
}
```

---

## 7️⃣ Complete Flow Diagram

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│ Register/Login  │
│     Page        │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Form Submit    │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Redux Action    │
│   Dispatch      │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Auth Service   │
│   API Call      │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Backend API    │
└──────┬──────────┘
       │
   ┌───┴───┐
   │       │
Success  Error
   │       │
   ▼       ▼
Save   Show
Token  Error
   │
   ▼
Update
Redux
State
   │
   ▼
Navigate
   to
Dashboard
```

---

## 8️⃣ Redux State Changes

### Before Login:
```javascript
{
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: ''
}
```

### During Login (Loading):
```javascript
{
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,  // ✅ Loading
  isSuccess: false,
  isError: false,
  message: ''
}
```

### After Success:
```javascript
{
  user: { name: 'John', email: 'john@example.com' },
  token: 'jwt-token-here',
  isAuthenticated: true,  // ✅ Authenticated
  isLoading: false,
  isSuccess: true,        // ✅ Success
  isError: false,
  message: 'Login successful'
}
```

### After Error:
```javascript
{
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  isSuccess: false,
  isError: true,          // ❌ Error
  message: 'Invalid credentials'
}
```

---

## 9️⃣ Home Page Conditional Rendering

```javascript
// Home.jsx
const { isAuthenticated, user } = useSelector((state) => state.auth);

{isAuthenticated ? (
  // Logged in users માટે
  <Link to="/dashboard">Go to Dashboard</Link>
) : (
  // Not logged in users માટે
  <>
    <Link to="/register">Get Started</Link>
    <Link to="/login">Login</Link>
  </>
)}
```

---

## 🎯 Redirect Summary

| Condition | Action |
|-----------|--------|
| Register Success | → `/dashboard` |
| Login Success | → `/dashboard` |
| Already Logged In + Visit Login | → `/dashboard` |
| Already Logged In + Visit Register | → `/dashboard` |
| Not Logged In + Visit Dashboard | → `/login` |
| Logout | → `/login` |
| 401 Error | → `/login` |

---

## ✅ Testing Checklist

1. **Register Flow:**
   - [ ] નવો user register કરો
   - [ ] Success થયા પછી dashboard પર redirect થાય છે?
   - [ ] Token localStorage માં save થયું છે?
   - [ ] User data Redux માં છે?

2. **Login Flow:**
   - [ ] Existing user login કરો
   - [ ] Success થયા પછી dashboard પર redirect થાય છે?
   - [ ] Token localStorage માં save થયું છે?
   - [ ] User data Redux માં છે?

3. **Already Logged In:**
   - [ ] Logged in હોવા છતાં `/login` visit કરો
   - [ ] Automatically dashboard પર redirect થાય છે?
   - [ ] Logged in હોવા છતાં `/register` visit કરો
   - [ ] Automatically dashboard પર redirect થાય છે?

4. **Protected Route:**
   - [ ] Logout કરો
   - [ ] Directly `/dashboard` visit કરો
   - [ ] Login page પર redirect થાય છે?

5. **Logout:**
   - [ ] Dashboard માંથી logout કરો
   - [ ] Login page પર redirect થાય છે?
   - [ ] Token remove થયું છે?
   - [ ] Redux state clear થયું છે?

---

## 🐛 Common Issues & Solutions

### Issue 1: Redirect કામ નથી કરતું
**Solution:**
```javascript
// Check if useEffect dependencies correct છે
useEffect(() => {
  if (isSuccess && user) {
    navigate("/dashboard");
  }
}, [isSuccess, user, navigate]); // ✅ All dependencies
```

### Issue 2: Infinite redirect loop
**Solution:**
```javascript
// reset() dispatch કરો cleanup માં
useEffect(() => {
  // ... redirect logic
  
  return () => {
    dispatch(reset()); // ✅ Cleanup
  };
}, [dependencies]);
```

### Issue 3: Token છે પણ user null છે
**Solution:**
```javascript
// Dashboard માં getCurrentUser() call કરો
useEffect(() => {
  if (isAuthenticated && !user) {
    dispatch(getCurrentUser()); // ✅ Fetch user
  }
}, [isAuthenticated, user, dispatch]);
```

---

## 📝 Key Points

1. ✅ Register/Login success = Dashboard redirect
2. ✅ Already logged in = Dashboard redirect  
3. ✅ Not authenticated + Dashboard = Login redirect
4. ✅ Token automatic manage થાય છે
5. ✅ Redux state automatic update થાય છે
6. ✅ 401 error = Automatic logout + Login redirect

---

Happy Coding! 🚀