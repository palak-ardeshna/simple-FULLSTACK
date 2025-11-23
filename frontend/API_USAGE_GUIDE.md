# API Usage Guide - API નો ઉપયોગ કેવી રીતે કરવો

આ guide તમને બતાવશે કે API calls કેવી રીતે કરવી - Redux actions થી, services થી, અને direct API service થી.

## 📚 Table of Contents

1. [Redux Actions (Recommended)](#1-redux-actions-recommended)
2. [Direct Service Calls](#2-direct-service-calls)
3. [Base API Service](#3-base-api-service)
4. [Custom API Calls](#4-custom-api-calls)

---

## 1. Redux Actions (Recommended) ⭐

આ સૌથી સારી રીત છે કારણ કે state management automatic થાય છે.

### Register User

```javascript
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../redux/slices/authSlice';

function MyComponent() {
  const dispatch = useDispatch();
  const { isLoading, isError, message } = useSelector((state) => state.auth);

  const handleRegister = () => {
    const userData = {
      name: "John Doe",
      email: "john@example.com",
      password: "password123"
    };
    
    dispatch(register(userData));
  };

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error: {message}</p>}
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}
```

### Login User

```javascript
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/slices/authSlice';

function LoginComponent() {
  const dispatch = useDispatch();
  const { user, isLoading, isError } = useSelector((state) => state.auth);

  const handleLogin = () => {
    const credentials = {
      email: "john@example.com",
      password: "password123"
    };
    
    dispatch(login(credentials));
  };

  return (
    <button onClick={handleLogin} disabled={isLoading}>
      {isLoading ? 'Logging in...' : 'Login'}
    </button>
  );
}
```

### Get Current User

```javascript
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from '../redux/slices/authSlice';

function ProfileComponent() {
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Profile</h2>
      <p>Name: {user?.name}</p>
      <p>Email: {user?.email}</p>
    </div>
  );
}
```

### Logout User

```javascript
import { useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';

function LogoutButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return <button onClick={handleLogout}>Logout</button>;
}
```

---

## 2. Direct Service Calls

જો તમારે Redux વગર સીધું API call કરવું હોય તો services નો use કરો.

### Auth Service Usage

```javascript
import authService from '../services/authService';

// Register
async function registerUser() {
  try {
    const userData = {
      name: "John Doe",
      email: "john@example.com",
      password: "password123"
    };
    
    const response = await authService.register(userData);
    console.log('User registered:', response);
    // Token automatically saved in localStorage
    
  } catch (error) {
    console.error('Registration failed:', error.message);
  }
}

// Login
async function loginUser() {
  try {
    const credentials = {
      email: "john@example.com",
      password: "password123"
    };
    
    const response = await authService.login(credentials);
    console.log('User logged in:', response);
    // Token automatically saved in localStorage
    
  } catch (error) {
    console.error('Login failed:', error.message);
  }
}

// Get Current User
async function fetchCurrentUser() {
  try {
    const response = await authService.getCurrentUser();
    console.log('Current user:', response.user);
    
  } catch (error) {
    console.error('Failed to fetch user:', error.message);
  }
}

// Logout
function logoutUser() {
  authService.logout();
  console.log('User logged out');
}

// Check if authenticated
const isLoggedIn = authService.isAuthenticated();
console.log('Is logged in:', isLoggedIn);

// Get token
const token = authService.getToken();
console.log('Token:', token);
```

---

## 3. Base API Service

સૌથી low-level API calls માટે base API service નો use કરો.

### GET Request

```javascript
import apiService from '../services/api';

async function fetchData() {
  try {
    // Simple GET
    const response = await apiService.get('/users');
    console.log('Users:', response);
    
    // GET with custom headers
    const response2 = await apiService.get('/profile', {
      'X-Custom-Header': 'value'
    });
    console.log('Profile:', response2);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

### POST Request

```javascript
import apiService from '../services/api';

async function createPost() {
  try {
    const postData = {
      title: "My Post",
      content: "This is the content"
    };
    
    const response = await apiService.post('/posts', postData);
    console.log('Post created:', response);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

### PUT Request

```javascript
import apiService from '../services/api';

async function updateUser() {
  try {
    const updateData = {
      name: "Updated Name",
      email: "newemail@example.com"
    };
    
    const response = await apiService.put('/users/123', updateData);
    console.log('User updated:', response);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

### PATCH Request

```javascript
import apiService from '../services/api';

async function partialUpdate() {
  try {
    const updateData = {
      name: "New Name Only"
    };
    
    const response = await apiService.patch('/users/123', updateData);
    console.log('User patched:', response);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

### DELETE Request

```javascript
import apiService from '../services/api';

async function deleteUser() {
  try {
    const response = await apiService.delete('/users/123');
    console.log('User deleted:', response);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

---

## 4. Custom API Calls

તમારી પોતાની service બનાવો નવા features માટે.

### Example: Posts Service

```javascript
// src/services/postsService.js
import apiService from './api';

class PostsService {
  // Get all posts
  async getAllPosts() {
    try {
      return await apiService.get('/posts');
    } catch (error) {
      throw error;
    }
  }

  // Get single post
  async getPost(id) {
    try {
      return await apiService.get(`/posts/${id}`);
    } catch (error) {
      throw error;
    }
  }

  // Create post
  async createPost(postData) {
    try {
      return await apiService.post('/posts', postData);
    } catch (error) {
      throw error;
    }
  }

  // Update post
  async updatePost(id, postData) {
    try {
      return await apiService.put(`/posts/${id}`, postData);
    } catch (error) {
      throw error;
    }
  }

  // Delete post
  async deletePost(id) {
    try {
      return await apiService.delete(`/posts/${id}`);
    } catch (error) {
      throw error;
    }
  }

  // Like post
  async likePost(id) {
    try {
      return await apiService.post(`/posts/${id}/like`);
    } catch (error) {
      throw error;
    }
  }
}

const postsService = new PostsService();
export default postsService;
```

### Example: Posts Slice (Redux)

```javascript
// src/redux/slices/postsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import postsService from '../../services/postsService';

const initialState = {
  posts: [],
  currentPost: null,
  isLoading: false,
  isError: false,
  message: '',
};

// Get all posts
export const getPosts = createAsyncThunk(
  'posts/getAll',
  async (_, thunkAPI) => {
    try {
      return await postsService.getAllPosts();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Create post
export const createPost = createAsyncThunk(
  'posts/create',
  async (postData, thunkAPI) => {
    try {
      return await postsService.createPost(postData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPosts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload;
      })
      .addCase(getPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createPost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts.push(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = postsSlice.actions;
export default postsSlice.reducer;
```

### Use Posts in Component

```javascript
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPosts, createPost } from '../redux/slices/postsSlice';

function PostsComponent() {
  const dispatch = useDispatch();
  const { posts, isLoading, isError, message } = useSelector(
    (state) => state.posts
  );

  useEffect(() => {
    dispatch(getPosts());
  }, [dispatch]);

  const handleCreatePost = () => {
    const newPost = {
      title: 'New Post',
      content: 'Post content here'
    };
    dispatch(createPost(newPost));
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {message}</p>;

  return (
    <div>
      <button onClick={handleCreatePost}>Create Post</button>
      {posts.map((post) => (
        <div key={post._id}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## 🔐 Important Notes

### 1. Token Management

Token automatic manage થાય છે:
- Login/Register પર automatically save થાય છે
- Logout પર automatically remove થાય છે
- દરેક API call સાથે automatically send થાય છે

### 2. Error Handling

```javascript
try {
  const response = await apiService.get('/endpoint');
  // Success
  console.log(response);
} catch (error) {
  // Error
  console.error('Status:', error.status);
  console.error('Message:', error.message);
  console.error('Data:', error.data);
}
```

### 3. 401 Unauthorized

જ્યારે 401 error આવે ત્યારે:
- Token automatically remove થાય છે
- User automatically login page પર redirect થાય છે

### 4. Base URL

Base URL `.env` file માં set કરેલું છે:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 📝 Best Practices

1. **Redux Actions Use કરો** - State management માટે best છે
2. **Services Direct Use કરો** - Simple API calls માટે
3. **Error Handling** - હંમેશા try-catch use કરો
4. **Loading States** - User ને feedback આપો
5. **Token Security** - Token ને secure રીતે handle કરો

---

## 🎯 Quick Reference

| Method | Usage | Example |
|--------|-------|---------|
| Redux Action | `dispatch(action(data))` | `dispatch(login(credentials))` |
| Service | `await service.method()` | `await authService.login(data)` |
| API Service | `await apiService.method('/endpoint')` | `await apiService.get('/users')` |

---

## 💡 Examples Summary

### Redux (Recommended)
✅ Automatic state management  
✅ Loading states handled  
✅ Error handling included  
✅ Redux DevTools support  

### Direct Service
✅ Simple and direct  
✅ No Redux overhead  
✅ Good for utility functions  
✅ Manual state management  

### Base API
✅ Maximum flexibility  
✅ Custom endpoints  
✅ Full control  
✅ More code needed  

---

Happy Coding! 🚀